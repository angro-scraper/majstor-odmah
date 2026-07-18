function createSupabaseApi(options) {
  const baseUrl = (process.env.SUPABASE_URL || '').replace(/\/$/, '').replace(/\/(?:rest|auth)\/v1$/, '');
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const enabled = Boolean(baseUrl && serviceRoleKey);
  const providers = options.providers;
  const matchedProviders = options.matchedProviders;
  const demoJob = options.demoJob;

  function reply(response, status, body) {
    response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
    response.end(JSON.stringify(body));
  }

  function parseBody(request) {
    return new Promise(function (resolve, reject) {
      let raw = '';
      request.on('data', function (chunk) {
        raw += chunk;
        if (raw.length > 1500000) request.destroy();
      });
      request.on('end', function () {
        try { resolve(JSON.parse(raw || '{}')); } catch (error) { reject(error); }
      });
    });
  }

  async function database(method, path, body) {
    // New Supabase secret keys (sb_secret_...) authorize via `apikey` only.
    // They are opaque values rather than JWTs, so sending one as a Bearer
    // token downgrades the database request and can trigger RLS errors.
    const headers = {
      apikey: serviceRoleKey,
      'Content-Type': 'application/json',
      Prefer: 'return=representation'
    };
    if (!serviceRoleKey.startsWith('sb_')) headers.Authorization = 'Bearer ' + serviceRoleKey;
    const response = await fetch(baseUrl + path, {
      method: method,
      headers: headers,
      body: body === undefined ? undefined : JSON.stringify(body)
    });
    const text = await response.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch (error) { data = text; }
    if (!response.ok) {
      const message = data && data.message ? data.message : 'Supabase nije prihvatio zahtev.';
      throw new Error(message);
    }
    return data;
  }

  async function authRequest(method, path, body, token) {
    const response = await fetch(baseUrl + path, {
      method: method,
      headers: { apikey: serviceRoleKey, Authorization: 'Bearer ' + (token || serviceRoleKey), 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body)
    });
    const text = await response.text(); let data = null;
    try { data = text ? JSON.parse(text) : null; } catch (error) { data = text; }
    if (!response.ok) throw new Error((data && (data.msg || data.message || data.error_description)) || 'Prijava nije uspela.');
    return data;
  }

  function bearer(request) {
    const value = String(request.headers.authorization || '');
    return value.indexOf('Bearer ') === 0 ? value.slice(7).trim() : '';
  }

  async function currentProfile(request) {
    const token = bearer(request);
    if (!token) throw new Error('Prijavi se da nastaviš.');
    const user = await authRequest('GET', '/auth/v1/user', undefined, token);
    const rows = await database('GET', '/rest/v1/profiles?auth_user_id=eq.' + encodeURIComponent(user.id) + '&select=*');
    const profile = rows && rows[0];
    if (!profile) throw new Error('Profil još nije spreman. Pokušaj ponovo za nekoliko sekundi.');
    if (profile.is_blocked) throw new Error('Ovaj nalog je blokiran. Obrati se podršci ako smatraš da je došlo do greške.');
    return { profile: profile, token: token };
  }

  const coreModuleKeys = ['market', 'deals', 'save-food', 'business', 'money'];
  const businessTypes = ['sole_trader', 'company', 'store', 'service_provider', 'nonprofit', 'other'];

  function coreProfile(profile) {
    return {
      id: profile.id,
      fullName: profile.full_name,
      role: profile.role,
      city: profile.city || '',
      countryCode: profile.country_code || '',
      preferredLocale: profile.preferred_locale || 'sr',
      phoneVerified: Boolean(profile.phone_verified),
      identityVerified: Boolean(profile.identity_verified),
      verificationStatus: profile.verification_status,
      latitude: profile.latitude,
      longitude: profile.longitude
    };
  }

  function businessView(business) {
    return {
      id: business.id,
      legalName: business.legal_name,
      displayName: business.display_name,
      businessType: business.business_type,
      city: business.city,
      countryCode: business.country_code || '',
      website: business.website || '',
      description: business.description || '',
      phone: business.phone || '',
      email: business.email || '',
      verificationStatus: business.verification_status,
      active: business.is_active !== false
    };
  }

  async function handleCore(request, response, url) {
    if (!enabled) return reply(response, 503, { error: 'Balkan Core još nije povezan sa bazom.' });
    const current = await currentProfile(request);
    const profileId = current.profile.id;
    const businessMatch = url.pathname.match(/^\/api\/core\/businesses\/([^/]+)$/);

    if (url.pathname === '/api/core/me' && request.method === 'GET') {
      const [businesses, preferences] = await Promise.all([
        database('GET', '/rest/v1/business_profiles?owner_profile_id=eq.' + encodeURIComponent(profileId) + '&select=*&order=created_at.desc'),
        database('GET', '/rest/v1/profile_module_preferences?profile_id=eq.' + encodeURIComponent(profileId) + '&select=module_key,is_pinned,notifications_enabled&order=module_key.asc')
      ]);
      return reply(response, 200, { profile: coreProfile(current.profile), businesses: (businesses || []).map(businessView), modulePreferences: preferences || [] });
    }

    if (url.pathname === '/api/core/me' && request.method === 'PATCH') {
      const payload = await parseBody(request);
      const fullName = payload.fullName === undefined ? current.profile.full_name : String(payload.fullName || '').trim();
      const city = payload.city === undefined ? current.profile.city : String(payload.city || '').trim();
      const preferredLocale = payload.preferredLocale === undefined ? (current.profile.preferred_locale || 'sr') : String(payload.preferredLocale || '').trim();
      const countryCode = payload.countryCode === undefined ? (current.profile.country_code || null) : String(payload.countryCode || '').trim().toUpperCase().slice(0, 2);
      if (fullName.length < 2 || fullName.length > 120 || city.length < 2 || city.length > 80 || ['sr', 'hr', 'bs', 'mk', 'sq', 'en', 'de'].indexOf(preferredLocale) < 0) return reply(response, 400, { error: 'Proveri ime, grad i jezik profila.' });
      const rows = await database('PATCH', '/rest/v1/profiles?id=eq.' + encodeURIComponent(profileId), { full_name: fullName, city: city, preferred_locale: preferredLocale, country_code: countryCode || null });
      return reply(response, 200, { profile: coreProfile(rows && rows[0] ? rows[0] : Object.assign({}, current.profile, { full_name: fullName, city: city, preferred_locale: preferredLocale, country_code: countryCode })) });
    }

    if (url.pathname === '/api/core/module-preferences' && request.method === 'PUT') {
      const payload = await parseBody(request);
      const preferences = Array.isArray(payload.preferences) ? payload.preferences : [];
      if (preferences.length > coreModuleKeys.length || preferences.some(function (item) { return !item || coreModuleKeys.indexOf(item.moduleKey) < 0; })) return reply(response, 400, { error: 'Lista modula nije validna.' });
      await database('DELETE', '/rest/v1/profile_module_preferences?profile_id=eq.' + encodeURIComponent(profileId));
      const rows = preferences.length ? await database('POST', '/rest/v1/profile_module_preferences', preferences.map(function (item) { return { profile_id: profileId, module_key: item.moduleKey, is_pinned: item.isPinned !== false, notifications_enabled: item.notificationsEnabled !== false }; })) : [];
      return reply(response, 200, { modulePreferences: rows || [] });
    }

    if (url.pathname === '/api/core/businesses' && request.method === 'GET') {
      const rows = await database('GET', '/rest/v1/business_profiles?owner_profile_id=eq.' + encodeURIComponent(profileId) + '&select=*&order=created_at.desc');
      return reply(response, 200, { businesses: (rows || []).map(businessView) });
    }

    if (url.pathname === '/api/core/businesses' && request.method === 'POST') {
      const payload = await parseBody(request);
      const legalName = String(payload.legalName || '').trim(); const displayName = String(payload.displayName || '').trim(); const businessType = String(payload.businessType || '').trim(); const city = String(payload.city || current.profile.city || '').trim();
      if (legalName.length < 2 || legalName.length > 180 || displayName.length < 2 || displayName.length > 120 || businessTypes.indexOf(businessType) < 0 || city.length < 2 || city.length > 80) return reply(response, 400, { error: 'Proveri naziv firme, tip i grad.' });
      const rows = await database('POST', '/rest/v1/business_profiles', { owner_profile_id: profileId, legal_name: legalName, display_name: displayName, business_type: businessType, city: city, country_code: String(payload.countryCode || current.profile.country_code || '').trim().toUpperCase().slice(0, 2) || null, website: String(payload.website || '').trim().slice(0, 300) || null, description: String(payload.description || '').trim().slice(0, 2000) || null, phone: String(payload.phone || '').trim().slice(0, 50) || null, email: String(payload.email || '').trim().toLowerCase().slice(0, 160) || null });
      await database('POST', '/rest/v1/notifications', { profile_id: profileId, title: 'Firma je dodata', body: 'Poslovni profil čeka administrativnu verifikaciju.' });
      return reply(response, 201, { business: businessView(rows[0]) });
    }

    if (businessMatch && request.method === 'PATCH') {
      const owned = await database('GET', '/rest/v1/business_profiles?id=eq.' + encodeURIComponent(businessMatch[1]) + '&owner_profile_id=eq.' + encodeURIComponent(profileId) + '&select=id');
      if (!owned || !owned[0]) return reply(response, 404, { error: 'Poslovni profil nije pronađen.' });
      const payload = await parseBody(request); const patch = {};
      if (payload.displayName !== undefined) patch.display_name = String(payload.displayName || '').trim().slice(0, 120);
      if (payload.city !== undefined) patch.city = String(payload.city || '').trim().slice(0, 80);
      if (payload.website !== undefined) patch.website = String(payload.website || '').trim().slice(0, 300) || null;
      if (payload.description !== undefined) patch.description = String(payload.description || '').trim().slice(0, 2000) || null;
      if (payload.phone !== undefined) patch.phone = String(payload.phone || '').trim().slice(0, 50) || null;
      if (payload.email !== undefined) patch.email = String(payload.email || '').trim().toLowerCase().slice(0, 160) || null;
      if (!Object.keys(patch).length || (patch.display_name !== undefined && patch.display_name.length < 2) || (patch.city !== undefined && patch.city.length < 2)) return reply(response, 400, { error: 'Nema validnih izmena poslovnog profila.' });
      const rows = await database('PATCH', '/rest/v1/business_profiles?id=eq.' + encodeURIComponent(businessMatch[1]) + '&owner_profile_id=eq.' + encodeURIComponent(profileId), patch);
      return reply(response, 200, { business: businessView(rows[0]) });
    }

    if (url.pathname === '/api/core/ratings' && request.method === 'POST') {
      const payload = await parseBody(request); const rating = Number(payload.rating); const moduleKey = String(payload.moduleKey || '').trim(); const subjectProfileId = String(payload.subjectProfileId || '').trim(); const businessProfileId = String(payload.businessProfileId || '').trim();
      if (!Number.isInteger(rating) || rating < 1 || rating > 5 || coreModuleKeys.indexOf(moduleKey) < 0 || Boolean(subjectProfileId) === Boolean(businessProfileId)) return reply(response, 400, { error: 'Ocena mora imati modul i tačno jednog primaoca.' });
      const rows = await database('POST', '/rest/v1/platform_ratings', { reviewer_profile_id: profileId, subject_profile_id: subjectProfileId || null, business_profile_id: businessProfileId || null, module_key: moduleKey, reference_id: String(payload.referenceId || '').trim().slice(0, 120) || null, rating: rating, comment: String(payload.comment || '').trim().slice(0, 1000) || null, is_visible: true });
      return reply(response, 201, { rating: rows && rows[0] ? rows[0] : null });
    }

    return reply(response, 404, { error: 'Balkan Core ruta nije pronađena.' });
  }

  function dbStatus(label) {
    const map = {
      'Traži majstora': 'open',
      'Primljene ponude': 'offered',
      'Dogovoren termin': 'accepted',
      'Potvrđen dolazak': 'accepted',
      'Radovi u toku': 'in_progress',
      'Završeno': 'completed'
    };
    return map[label] || 'open';
  }

  function cityFrom(location) {
    const parts = String(location || '').split(',');
    return String(parts[parts.length - 1] || location || 'Novi Sad').trim() || 'Novi Sad';
  }

  function partnerTicket(ticket) {
    const fields = {};
    String(ticket.message || '').split('\n').forEach(function (line) { const index = line.indexOf(':'); if (index > 0) fields[line.slice(0, index).trim()] = line.slice(index + 1).trim(); });
    return { id: ticket.id, company: String(ticket.subject || '').replace(/^Partner katalog ·\s*/, ''), category: fields.Kategorija || 'Ostalo', city: fields.Grad || '—', website: fields.Sajt || '', contact: fields.Kontakt || '', description: fields.Opis || '', featured: fields.Istaknuto === 'da', status: ticket.status === 'resolved' ? 'active' : 'paused' };
  }

  function partnerMessage(payload) { return ['Kategorija: ' + String(payload.category || '').trim(), 'Grad: ' + String(payload.city || '').trim(), 'Sajt: ' + String(payload.website || '').trim(), 'Kontakt: ' + String(payload.contact || '').trim(), 'Istaknuto: ' + (payload.featured ? 'da' : 'ne'), 'Opis: ' + String(payload.description || '').trim()].join('\n'); }

  function catalogItem(row) {
    return { id: row.id, partnerId: row.partner_id, title: row.title, description: row.description || '', priceLabel: row.price_label || '', linkUrl: row.link_url || '', imageUrl: row.image_url || '', active: row.is_active !== false, createdAt: row.created_at };
  }

  async function loadPartnersWithRatings(activeOnly) {
    const tickets = await database('GET', '/rest/v1/support_tickets?select=*&order=created_at.desc');
    let reviews = [];
    try { reviews = await database('GET', '/rest/v1/partner_reviews?select=partner_id,rating,is_visible'); } catch (error) { console.warn('Partner ocene još nisu dostupne:', error.message); }
    if (!reviews.length) {
      reviews = (tickets || []).filter(function (ticket) { return String(ticket.subject || '').indexOf('Partner ocena · ') === 0; }).map(function (ticket) {
        const parts = String(ticket.subject || '').split(' · '); const fields = {};
        String(ticket.message || '').split('\n').forEach(function (line) { const index = line.indexOf(':'); if (index > 0) fields[line.slice(0, index).trim()] = line.slice(index + 1).trim(); });
        return { partner_id: parts[1], rating: Number(fields.Ocena || 0), is_visible: ticket.status === 'resolved' };
      });
    }
    const totals = {};
    (reviews || []).filter(function (review) { return review.is_visible !== false; }).forEach(function (review) {
      const id = String(review.partner_id); const entry = totals[id] || { sum: 0, count: 0 };
      entry.sum += Number(review.rating || 0); entry.count += 1; totals[id] = entry;
    });
    return (tickets || []).filter(function (ticket) {
      return String(ticket.subject || '').indexOf('Partner katalog · ') === 0 && (!activeOnly || ticket.status === 'resolved');
    }).map(function (ticket) {
      const partner = partnerTicket(ticket); const total = totals[String(partner.id)] || { sum: 0, count: 0 };
      partner.rating = total.count ? Math.round((total.sum / total.count) * 10) / 10 : null;
      partner.reviewCount = total.count;
      partner.rankingEligible = total.count >= 3;
      return partner;
    }).sort(function (first, second) {
      const firstScore = first.rankingEligible ? first.rating : -1; const secondScore = second.rankingEligible ? second.rating : -1;
      return secondScore - firstScore || second.reviewCount - first.reviewCount || first.company.localeCompare(second.company, 'sr');
    });
  }

  function toJob(row) {
    const workflow = row.workflow && typeof row.workflow === 'object' ? row.workflow : {};
    const job = Object.assign({}, workflow);
    job.id = row.id;
    job.category = job.category || row.trade;
    job.location = job.location || row.city;
    job.description = job.description || row.description;
    job.status = job.status || 'Traži majstora';
    job.createdAt = job.createdAt || row.created_at;
    return job;
  }

  async function getJob(id) {
    const rows = await database('GET', '/rest/v1/jobs?id=eq.' + encodeURIComponent(id) + '&select=*');
    return rows && rows[0] ? { row: rows[0], job: toJob(rows[0]) } : null;
  }

  async function saveJob(id, job) {
    const rows = await database('PATCH', '/rest/v1/jobs?id=eq.' + encodeURIComponent(id), {
      status: dbStatus(job.status),
      workflow: job
    });
    return rows && rows[0] ? toJob(rows[0]) : job;
  }

  async function handleAdmin(request, response, url) {
    const supportMatch = url.pathname.match(/^\/api\/admin\/support\/([^/]+)$/); const partnerMatch = url.pathname.match(/^\/api\/admin\/partners\/([^/]+)$/); const catalogMatch = url.pathname.match(/^\/api\/admin\/catalog\/([^/]+)$/);
    if (url.pathname === '/api/admin/partners' && request.method === 'GET') {
      return reply(response, 200, await loadPartnersWithRatings(false));
    }
    if (url.pathname === '/api/admin/partners' && request.method === 'POST') {
      const payload = await parseBody(request); const company = String(payload.company || '').trim(); const category = String(payload.category || '').trim(); const city = String(payload.city || '').trim(); const description = String(payload.description || '').trim();
      if (!company || !category || !city || !description || company.length > 90 || description.length > 500) return reply(response, 400, { error: 'Proveri naziv, kategoriju, grad i opis partnera.' });
      const rows = await database('POST', '/rest/v1/support_tickets', { subject: 'Partner katalog · ' + company, message: partnerMessage(payload), status: 'resolved' }); return reply(response, 201, partnerTicket(rows[0]));
    }
    if (partnerMatch && request.method === 'POST') {
      const payload = await parseBody(request); const status = payload.status === 'active' ? 'resolved' : 'open'; const rows = await database('PATCH', '/rest/v1/support_tickets?id=eq.' + encodeURIComponent(partnerMatch[1]), { status: status }); return reply(response, 200, partnerTicket(rows && rows[0] ? rows[0] : { id: partnerMatch[1], status: status }));
    }
    if (url.pathname === '/api/admin/catalog' && request.method === 'GET') {
      const partnerId = String(url.searchParams.get('partner_id') || '').trim();
      const query = '/rest/v1/partner_catalog_items?select=*&order=created_at.desc' + (partnerId ? '&partner_id=eq.' + encodeURIComponent(partnerId) : '');
      const rows = await database('GET', query); return reply(response, 200, (rows || []).map(catalogItem));
    }
    if (url.pathname === '/api/admin/catalog' && request.method === 'POST') {
      const payload = await parseBody(request); const partnerId = String(payload.partnerId || '').trim(); const title = String(payload.title || '').trim(); const description = String(payload.description || '').trim(); const priceLabel = String(payload.priceLabel || '').trim(); const linkUrl = String(payload.linkUrl || '').trim(); const imageUrl = String(payload.imageUrl || '').trim();
      if (!partnerId || !title || title.length > 120 || description.length > 700 || priceLabel.length > 80 || linkUrl.length > 300 || imageUrl.length > 500) return reply(response, 400, { error: 'Proveri partnera, naziv i podatke stavke kataloga.' });
      const rows = await database('POST', '/rest/v1/partner_catalog_items', { partner_id: partnerId, title: title, description: description, price_label: priceLabel, link_url: linkUrl, image_url: imageUrl, is_active: payload.active !== false }); return reply(response, 201, catalogItem(rows[0]));
    }
    if (catalogMatch && request.method === 'POST') {
      const payload = await parseBody(request); const rows = await database('PATCH', '/rest/v1/partner_catalog_items?id=eq.' + encodeURIComponent(catalogMatch[1]), { is_active: Boolean(payload.active) }); return reply(response, 200, catalogItem(rows && rows[0] ? rows[0] : { id: catalogMatch[1], is_active: Boolean(payload.active) }));
    }
    const jobFlagMatch = url.pathname.match(/^\/api\/admin\/jobs\/([^/]+)\/flag$/);
    const userBlockMatch = url.pathname.match(/^\/api\/admin\/users\/([^/]+)\/block$/);
    const verificationMatch = url.pathname.match(/^\/api\/admin\/users\/([^/]+)\/verification$/);
    if (url.pathname === '/api/admin/overview' && request.method === 'GET') {
      const results = await Promise.all([
        database('GET', '/rest/v1/profiles?select=id,full_name,role,city,phone_verified,identity_verified,verification_status,is_blocked,blocked_at,blocked_reason,created_at&order=created_at.desc'),
        database('GET', '/rest/v1/providers?select=id,profile_id,trade,available,rating,review_count'),
        database('GET', '/rest/v1/jobs?select=*&order=created_at.desc'),
        database('GET', '/rest/v1/support_tickets?select=*&order=created_at.desc')
      ]);
      const profiles = results[0] || []; const providersRows = results[1] || []; const jobs = (results[2] || []).map(toJob); const tickets = results[3] || [];
      return reply(response, 200, { stats: { users: profiles.length, providers: providersRows.length, blocked: profiles.filter(function (profile) { return profile.is_blocked; }).length, openJobs: jobs.filter(function (job) { return ['Traži majstora', 'Primljene ponude'].indexOf(job.status) >= 0; }).length, activeJobs: jobs.filter(function (job) { return ['Dogovoren termin', 'Potvrđen dolazak', 'Radovi u toku'].indexOf(job.status) >= 0; }).length, openTickets: tickets.filter(function (ticket) { return ticket.status !== 'resolved'; }).length }, jobs: jobs.slice(0, 8), tickets: tickets.slice(0, 8) });
    }
    if (url.pathname === '/api/admin/users' && request.method === 'GET') {
      const results = await Promise.all([database('GET', '/rest/v1/profiles?select=id,full_name,role,city,phone_verified,identity_verified,verification_status,is_blocked,blocked_at,blocked_reason,created_at&order=created_at.desc'), database('GET', '/rest/v1/providers?select=profile_id,trade,available,rating,review_count')]);
      const providerByProfile = {}; (results[1] || []).forEach(function (provider) { providerByProfile[provider.profile_id] = provider; });
      return reply(response, 200, (results[0] || []).map(function (profile) { return Object.assign({}, profile, { provider: providerByProfile[profile.id] || null }); }));
    }
    if (url.pathname === '/api/admin/jobs' && request.method === 'GET') {
      const rows = await database('GET', '/rest/v1/jobs?select=*&order=created_at.desc'); return reply(response, 200, (rows || []).map(toJob));
    }
    if (url.pathname === '/api/admin/support' && request.method === 'GET') {
      const tickets = await database('GET', '/rest/v1/support_tickets?select=*&order=created_at.desc'); return reply(response, 200, tickets || []);
    }
    if (supportMatch && request.method === 'POST') {
      const payload = await parseBody(request); const status = String(payload.status || '');
      if (['open', 'in_progress', 'resolved'].indexOf(status) < 0) return reply(response, 400, { error: 'Status podrške nije validan.' });
      const rows = await database('PATCH', '/rest/v1/support_tickets?id=eq.' + encodeURIComponent(supportMatch[1]), { status: status }); return reply(response, 200, rows && rows[0] ? rows[0] : { status: status });
    }
    if (jobFlagMatch && request.method === 'POST') {
      const payload = await parseBody(request); const saved = await getJob(jobFlagMatch[1]);
      if (!saved) return reply(response, 404, { error: 'Posao nije pronađen.' });
      saved.job.adminFlag = Boolean(payload.flagged); saved.job.adminFlaggedAt = saved.job.adminFlag ? new Date().toISOString() : null;
      return reply(response, 200, await saveJob(saved.row.id, saved.job));
    }
    if (userBlockMatch && request.method === 'POST') {
      const payload = await parseBody(request); const profileRows = await database('GET', '/rest/v1/profiles?id=eq.' + encodeURIComponent(userBlockMatch[1]) + '&select=id,role'); const profile = profileRows && profileRows[0];
      if (!profile) return reply(response, 404, { error: 'Korisnik nije pronađen.' });
      if (profile.role === 'admin') return reply(response, 403, { error: 'Administratorski nalog se ne može blokirati ovim putem.' });
      const blocked = Boolean(payload.blocked); const rows = await database('PATCH', '/rest/v1/profiles?id=eq.' + encodeURIComponent(profile.id), { is_blocked: blocked, blocked_at: blocked ? new Date().toISOString() : null, blocked_reason: blocked ? String(payload.reason || 'Administrativna provera').trim().slice(0, 300) : null });
      return reply(response, 200, rows && rows[0] ? rows[0] : { id: profile.id, is_blocked: blocked });
    }
    if (verificationMatch && request.method === 'POST') {
      const payload = await parseBody(request); const status = String(payload.status || '');
      if (['pending', 'verified', 'rejected'].indexOf(status) < 0) return reply(response, 400, { error: 'Status verifikacije nije validan.' });
      const rows = await database('PATCH', '/rest/v1/profiles?id=eq.' + encodeURIComponent(verificationMatch[1]) + '&role=eq.provider', { verification_status: status, identity_verified: status === 'verified' });
      return reply(response, 200, rows && rows[0] ? rows[0] : { id: verificationMatch[1], verification_status: status });
    }
    return reply(response, 404, { error: 'Admin ruta nije pronađena.' });
  }

  async function handleAuth(request, response, url) {
    if (!enabled) return reply(response, 503, { error: 'Registracija će uskoro biti dostupna.' });
    if (url.pathname === '/api/auth/signup' && request.method === 'POST') {
      const payload = await parseBody(request); const email = String(payload.email || '').trim().toLowerCase(); const password = String(payload.password || ''); const fullName = String(payload.fullName || '').trim(); const city = String(payload.city || '').trim(); const role = payload.role === 'provider' ? 'provider' : 'customer'; const trade = String(payload.trade || '').trim();
      if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 8 || fullName.length < 2 || city.length < 2 || (role === 'provider' && trade.length < 2)) return reply(response, 400, { error: 'Proveri ime, grad, e-mail, lozinku i zanat.' });
      const created = await authRequest('POST', '/auth/v1/admin/users', { email: email, password: password, email_confirm: true }); const authUser = created.user || created;
      const profiles = await database('POST', '/rest/v1/profiles', { auth_user_id: authUser.id, role: role, full_name: fullName, city: city, verification_status: role === 'provider' ? 'pending' : 'not_applicable' }); const profile = profiles && profiles[0];
      if (!profile) throw new Error('Profil nije kreiran.');
      if (role === 'provider') await database('POST', '/rest/v1/providers', { profile_id: profile.id, trade: trade, available: true });
      await database('POST', '/rest/v1/notifications', { profile_id: profile.id, title: 'Dobro došli na Majstor odmah', body: role === 'provider' ? 'Profil majstora je kreiran i čeka administrativnu verifikaciju.' : 'Nalog je kreiran. Sada možeš da objaviš prvi posao.' });
      const session = await authRequest('POST', '/auth/v1/token?grant_type=password', { email: email, password: password });
      return reply(response, 201, { session: { access_token: session.access_token, expires_in: session.expires_in }, profile: profile });
    }
    if (url.pathname === '/api/auth/login' && request.method === 'POST') {
      const payload = await parseBody(request); const session = await authRequest('POST', '/auth/v1/token?grant_type=password', { email: String(payload.email || '').trim().toLowerCase(), password: String(payload.password || '') });
      const user = await authRequest('GET', '/auth/v1/user', undefined, session.access_token); const rows = await database('GET', '/rest/v1/profiles?auth_user_id=eq.' + encodeURIComponent(user.id) + '&select=*'); const profile = rows && rows[0];
      if (!profile) return reply(response, 403, { error: 'Profil nije pronađen.' });
      if (profile.is_blocked) return reply(response, 403, { error: 'Ovaj nalog je blokiran. Obrati se podršci.' });
      return reply(response, 200, { session: { access_token: session.access_token, expires_in: session.expires_in }, profile: profile });
    }
    if (url.pathname === '/api/auth/me' && request.method === 'GET') { const current = await currentProfile(request); return reply(response, 200, current.profile); }
    if (url.pathname === '/api/notifications' && request.method === 'GET') { const current = await currentProfile(request); const rows = await database('GET', '/rest/v1/notifications?profile_id=eq.' + encodeURIComponent(current.profile.id) + '&select=*&order=created_at.desc&limit=30'); return reply(response, 200, rows || []); }
    if (url.pathname === '/api/notifications/read' && request.method === 'POST') { const current = await currentProfile(request); await database('PATCH', '/rest/v1/notifications?profile_id=eq.' + encodeURIComponent(current.profile.id) + '&read_at=is.null', { read_at: new Date().toISOString() }); return reply(response, 200, { ok: true }); }
    return reply(response, 404, { error: 'Auth ruta nije pronađena.' });
  }

  async function handle(request, response, url) {
    if (url.pathname.indexOf('/api/core/') === 0) return handleCore(request, response, url);
    const offerMatch = url.pathname.match(/^\/api\/jobs\/([^/]+)\/offers$/);
    const acceptMatch = url.pathname.match(/^\/api\/jobs\/([^/]+)\/accept$/);
    const declineMatch = url.pathname.match(/^\/api\/jobs\/([^/]+)\/decline$/);
    const progressMatch = url.pathname.match(/^\/api\/jobs\/([^/]+)\/progress$/);
    const messageMatch = url.pathname.match(/^\/api\/jobs\/([^/]+)\/messages$/);
    const photoMatch = url.pathname.match(/^\/api\/jobs\/([^/]+)\/photos$/);
    const reviewMatch = url.pathname.match(/^\/api\/jobs\/([^/]+)\/review$/);
    const partnerReviewMatch = url.pathname.match(/^\/api\/partners\/([^/]+)\/reviews$/);

    if (url.pathname === '/api/providers' && request.method === 'GET') return reply(response, 200, providers);
    if (url.pathname === '/api/partners' && request.method === 'GET') {
      return reply(response, 200, await loadPartnersWithRatings(true));
    }
    if (url.pathname === '/api/partner-rankings' && request.method === 'GET') {
      const partners = await loadPartnersWithRatings(true);
      return reply(response, 200, { overall: partners.filter(function (partner) { return partner.rankingEligible; }).slice(0, 10), categories: partners.reduce(function (groups, partner) { if (!partner.rankingEligible) return groups; const key = partner.category; groups[key] = groups[key] || []; groups[key].push(partner); return groups; }, {}) });
    }
    if (partnerReviewMatch && request.method === 'POST') {
      const current = await currentProfile(request);
      if (current.profile.role !== 'customer') return reply(response, 403, { error: 'Partnere mogu oceniti samo prijavljeni klijenti.' });
      const payload = await parseBody(request); const rating = Number(payload.rating); const comment = String(payload.comment || '').trim();
      if (!Number.isInteger(rating) || rating < 1 || rating > 5 || comment.length > 500) return reply(response, 400, { error: 'Ocena mora biti od 1 do 5, a komentar do 500 znakova.' });
      const partners = await loadPartnersWithRatings(true); const partner = partners.find(function (item) { return String(item.id) === String(partnerReviewMatch[1]); });
      if (!partner) return reply(response, 404, { error: 'Aktivan partner nije pronađen.' });
      const body = { rating: rating, comment: comment, is_visible: true, updated_at: new Date().toISOString() };
      try {
        const existing = await database('GET', '/rest/v1/partner_reviews?partner_id=eq.' + encodeURIComponent(partner.id) + '&profile_id=eq.' + encodeURIComponent(current.profile.id) + '&select=id');
        if (existing && existing[0]) await database('PATCH', '/rest/v1/partner_reviews?id=eq.' + encodeURIComponent(existing[0].id), body);
        else await database('POST', '/rest/v1/partner_reviews', Object.assign({ partner_id: partner.id, profile_id: current.profile.id }, body));
      } catch (error) {
        const subject = 'Partner ocena · ' + partner.id + ' · ' + current.profile.id;
        const message = 'Ocena: ' + rating + '\nKomentar: ' + comment;
        const tickets = await database('GET', '/rest/v1/support_tickets?subject=eq.' + encodeURIComponent(subject) + '&select=id');
        if (tickets && tickets[0]) await database('PATCH', '/rest/v1/support_tickets?id=eq.' + encodeURIComponent(tickets[0].id), { message: message, status: 'resolved' });
        else await database('POST', '/rest/v1/support_tickets', { subject: subject, message: message, status: 'resolved' });
      }
      return reply(response, 201, { ok: true, message: 'Ocena je sačuvana. Možeš je kasnije izmeniti.' });
    }
    if (url.pathname === '/api/catalog' && request.method === 'GET') {
      const partnerId = String(url.searchParams.get('partner_id') || '').trim();
      const query = '/rest/v1/partner_catalog_items?select=*&is_active=eq.true&order=created_at.desc' + (partnerId ? '&partner_id=eq.' + encodeURIComponent(partnerId) : '');
      const rows = await database('GET', query); return reply(response, 200, (rows || []).map(catalogItem));
    }
    if (url.pathname === '/api/jobs' && request.method === 'GET') {
      const rows = await database('GET', '/rest/v1/jobs?select=*&order=created_at.desc');
      const jobs = (rows || []).map(toJob);
      return reply(response, 200, jobs.length ? jobs : [demoJob]);
    }
    if (url.pathname === '/api/jobs' && request.method === 'POST') {
      const job = await parseBody(request);
      if (!job.category || !job.location || !job.description) return reply(response, 400, { error: 'Nedostaju obavezna polja.' });
      job.status = 'Traži majstora';
      job.createdAt = new Date().toISOString();
      job.offers = [];
      job.matches = matchedProviders(job.category);
      job.images = Array.isArray(job.images) ? job.images.slice(0, 3) : [];
      job.messages = [];
      const saved = await database('POST', '/rest/v1/jobs', {
        title: job.category + ' — ' + job.location,
        description: job.description,
        trade: job.category,
        city: cityFrom(job.location),
        status: 'open',
        workflow: job
      });
      job.id = saved[0].id;
      return reply(response, 201, job);
    }
    if (offerMatch && request.method === 'POST') {
      const offer = await parseBody(request);
      const saved = await getJob(offerMatch[1]);
      if (!saved || !offer.providerName || !offer.amount || !offer.eta) return reply(response, 400, { error: 'Ponuda nije potpuna.' });
      const job = saved.job;
      job.offers = job.offers || [];
      offer.id = Date.now();
      offer.createdAt = new Date().toISOString();
      job.offers.push(offer);
      job.status = 'Primljene ponude';
      return reply(response, 201, await saveJob(saved.row.id, job));
    }
    if (acceptMatch && request.method === 'POST') {
      const payload = await parseBody(request);
      const saved = await getJob(acceptMatch[1]);
      const job = saved && saved.job;
      const offer = job && (job.offers || []).find(function (item) { return String(item.id) === String(payload.offerId); });
      if (!offer) return reply(response, 400, { error: 'Ponuda nije pronađena.' });
      job.acceptedOfferId = offer.id;
      job.status = 'Dogovoren termin';
      job.progress = 'Dogovoren termin';
      job.updatedAt = new Date().toISOString();
      job.activity = [{ label: 'Majstor je izabran', at: job.updatedAt }];
      return reply(response, 200, await saveJob(saved.row.id, job));
    }
    if (declineMatch && request.method === 'POST') {
      const payload = await parseBody(request); const saved = await getJob(declineMatch[1]); const job = saved && saved.job;
      const providerName = String(payload.providerName || '').trim(); const reason = String(payload.reason || '').trim().slice(0, 300);
      if (!job || job.acceptedOfferId || !providerName) return reply(response, 400, { error: 'Ovaj posao više nije moguće odbiti.' });
      job.declinedBy = (job.declinedBy || []).filter(function (item) { return item.providerName !== providerName; });
      job.declinedBy.push({ providerName: providerName, reason: reason || 'Nisam trenutno dostupan', createdAt: new Date().toISOString() });
      job.activity = job.activity || []; job.activity.push({ label: providerName + ' je odbio posao', at: new Date().toISOString() });
      return reply(response, 200, await saveJob(saved.row.id, job));
    }
    if (progressMatch && request.method === 'POST') {
      const payload = await parseBody(request);
      const allowed = ['Potvrđen dolazak', 'Radovi u toku', 'Završeno'];
      const saved = await getJob(progressMatch[1]);
      const job = saved && saved.job;
      if (!job || !job.acceptedOfferId || allowed.indexOf(payload.progress) < 0) return reply(response, 400, { error: 'Status radova nije moguće promeniti.' });
      job.progress = payload.progress;
      job.status = payload.progress;
      job.updatedAt = new Date().toISOString();
      job.activity = job.activity || [];
      job.activity.push({ label: payload.progress, at: job.updatedAt });
      return reply(response, 200, await saveJob(saved.row.id, job));
    }
    if (messageMatch && request.method === 'POST') {
      const payload = await parseBody(request);
      const saved = await getJob(messageMatch[1]);
      const job = saved && saved.job;
      const text = String(payload.text || '').trim();
      if (!job || !job.acceptedOfferId || !text || text.length > 600) return reply(response, 400, { error: 'Poruka nije validna.' });
      job.messages = job.messages || [];
      job.messages.push({ id: Date.now(), author: payload.author === 'majstor' ? 'majstor' : 'klijent', text: text, createdAt: new Date().toISOString() });
      return reply(response, 201, await saveJob(saved.row.id, job));
    }
    if (photoMatch && request.method === 'POST') {
      const payload = await parseBody(request);
      const saved = await getJob(photoMatch[1]);
      const job = saved && saved.job;
      const image = String(payload.image || '');
      const caption = String(payload.caption || '').trim();
      if (!job || !job.acceptedOfferId || image.indexOf('data:image/') !== 0 || image.length > 650000) return reply(response, 400, { error: 'Fotografija nije validna.' });
      job.workPhotos = job.workPhotos || [];
      job.workPhotos.push({ id: Date.now(), image: image, caption: caption.slice(0, 120), createdAt: new Date().toISOString() });
      return reply(response, 201, await saveJob(saved.row.id, job));
    }
    if (reviewMatch && request.method === 'POST') {
      const payload = await parseBody(request);
      const saved = await getJob(reviewMatch[1]);
      const job = saved && saved.job;
      const rating = Number(payload.rating);
      const comment = String(payload.comment || '').trim();
      if (!job || job.progress !== 'Završeno' || rating < 1 || rating > 5 || !comment || comment.length > 500) return reply(response, 400, { error: 'Ocena nije validna.' });
      const author = payload.author === 'majstor' ? 'majstor' : 'klijent';
      job.reviews = job.reviews || {};
      job.reviews[author] = { rating: rating, comment: comment, createdAt: new Date().toISOString() };
      if (author === 'klijent') job.review = job.reviews[author];
      return reply(response, 201, await saveJob(saved.row.id, job));
    }
    if (url.pathname === '/api/support' && request.method === 'POST') {
      const ticket = await parseBody(request);
      const subject = String(ticket.subject || '').trim();
      const message = String(ticket.message || '').trim();
      if (!subject || !message || subject.length > 120 || message.length > 1500) return reply(response, 400, { error: 'Poruka za podršku nije validna.' });
      const saved = await database('POST', '/rest/v1/support_tickets', { subject: subject, message: message });
      return reply(response, 201, { id: saved[0].id, subject: subject, status: 'Primljeno', createdAt: saved[0].created_at });
    }
    return reply(response, 404, { error: 'API ruta nije pronađena.' });
  }

  return { enabled: enabled, handle: handle, handleAdmin: handleAdmin, handleAuth: handleAuth, handleCore: handleCore };
}

module.exports = { createSupabaseApi: createSupabaseApi };
