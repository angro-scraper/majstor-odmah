function createSupabaseApi(options) {
  const baseUrl = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
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
    const response = await fetch(baseUrl + path, {
      method: method,
      headers: {
        apikey: serviceRoleKey,
        Authorization: 'Bearer ' + serviceRoleKey,
        'Content-Type': 'application/json',
        Prefer: 'return=representation'
      },
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

  async function handle(request, response, url) {
    const offerMatch = url.pathname.match(/^\/api\/jobs\/([^/]+)\/offers$/);
    const acceptMatch = url.pathname.match(/^\/api\/jobs\/([^/]+)\/accept$/);
    const progressMatch = url.pathname.match(/^\/api\/jobs\/([^/]+)\/progress$/);
    const messageMatch = url.pathname.match(/^\/api\/jobs\/([^/]+)\/messages$/);
    const photoMatch = url.pathname.match(/^\/api\/jobs\/([^/]+)\/photos$/);
    const reviewMatch = url.pathname.match(/^\/api\/jobs\/([^/]+)\/review$/);

    if (url.pathname === '/api/providers' && request.method === 'GET') return reply(response, 200, providers);
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

  return { enabled: enabled, handle: handle };
}

module.exports = { createSupabaseApi: createSupabaseApi };
