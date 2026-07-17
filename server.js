const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const URL = require('url').URL;
const createSupabaseApi = require('./supabase-api').createSupabaseApi;
const analyzeProject = require('./ai-advisor').analyzeProject;

const root = __dirname;
const dataFile = path.join(root, 'data.json');
const aiRequestLog = new Map();
const mimeTypes = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8' };
const providers = [
  { id: 'milan', name: 'Milan Jovanović', category: 'Električar', rating: '4,9', reviews: 86, responseTime: 'odgovara za ~8 min', availability: 'dostupan danas', verified: true },
  { id: 'jelena', name: 'Jelena Marković', category: 'Električar', rating: '4,8', reviews: 42, responseTime: 'odgovara za ~15 min', availability: 'dostupna danas', verified: true },
  { id: 'nikola', name: 'Nikola Petrović', category: 'Vodoinstalater', rating: '5,0', reviews: 64, responseTime: 'odgovara za ~8 min', availability: 'dostupan danas', verified: true },
  { id: 'marko', name: 'Marko Ilić', category: 'Keramičar', rating: '4,8', reviews: 51, responseTime: 'odgovara za ~20 min', availability: 'dostupan sutra', verified: true }
];
function matchedProviders(category) {
  const directMatches = providers.filter(function (provider) { return provider.category === category && provider.availability.indexOf('danas') >= 0; });
  if (directMatches.length) return directMatches;
  return [{ id: 'mreza-' + String(category || 'majstor').toLowerCase().replace(/[^a-z0-9]+/g, '-'), name: 'Proverena mreža · ' + category, category: category, rating: '4,8', reviews: 24, responseTime: 'odgovara za ~15 min', availability: 'dostupan danas', verified: true }];
}
const demoJob = { id: 1, category: 'Električar', location: 'Detelinara, Novi Sad', description: 'Povremeno izbacuje osigurač u kuhinji. Potreban pregled danas.', status: 'Traži majstora', createdAt: '2026-07-17T08:30:00.000Z', offers: [], matches: matchedProviders('Električar') };
const demoChatJob = { id: 902, category: 'Električar', location: 'Grbavica, Novi Sad', description: 'Zamena dve plafonjere i provera prekidača. Termin je već dogovoren.', status: 'Dogovoren termin', progress: 'Dogovoren termin', createdAt: '2026-07-17T09:15:00.000Z', matches: matchedProviders('Električar'), offers: [{ id: 9021, providerName: 'Milan Jovanović', amount: '6.500', eta: 'sutra u 10h', note: 'Verifikovan električar · 4,9★', createdAt: '2026-07-17T09:20:00.000Z' }], acceptedOfferId: 9021, activity: [{ label: 'Majstor je izabran', at: '2026-07-17T09:25:00.000Z' }], messages: [{ id: 90201, author: 'klijent', text: 'Zdravo Milane, da li ti odgovara sutra u 10h?', createdAt: '2026-07-17T09:26:00.000Z' }, { id: 90202, author: 'majstor', text: 'Odgovara, Ana. Doneću i odgovarajuće LED sijalice za probu.', createdAt: '2026-07-17T09:28:00.000Z' }] };
const supabaseApi = createSupabaseApi({ providers: providers, matchedProviders: matchedProviders, demoJob: demoJob });

function seedDemoJobs(data) {
  const jobs = Array.isArray(data.jobs) ? data.jobs : [];
  if (!jobs.some(function (job) { return Number(job.id) === demoChatJob.id; })) jobs.unshift(JSON.parse(JSON.stringify(demoChatJob)));
  if (!jobs.some(function (job) { return Number(job.id) === demoJob.id; })) jobs.push(JSON.parse(JSON.stringify(demoJob)));
  data.jobs = jobs;
  data.nextJobId = Math.max(Number(data.nextJobId || 2), 903);
  return data;
}
function readData() {
  try {
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    return seedDemoJobs(data);
  } catch (error) { return seedDemoJobs({ jobs: [], nextJobId: 903, nextOfferId: 1 }); }
}
function writeData(data) { fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), 'utf8'); }
function reply(response, status, body) { response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' }); response.end(JSON.stringify(body)); }
function parseBody(request, done) {
  let raw = '';
  request.on('data', function (chunk) { raw += chunk; if (raw.length > 1500000) request.destroy(); });
  request.on('end', function () { try { done(null, JSON.parse(raw || '{}')); } catch (error) { done(error); } });
}
function findJob(data, id) { return data.jobs.find(function (job) { return job.id === Number(id); }); }
function partnerTicket(ticket) { const fields = {}; String(ticket.message || '').split('\n').forEach(function (line) { const index = line.indexOf(':'); if (index > 0) fields[line.slice(0, index).trim()] = line.slice(index + 1).trim(); }); return { id: ticket.id, company: String(ticket.subject || '').replace(/^Partner katalog ·\s*/, ''), category: fields.Kategorija || 'Ostalo', city: fields.Grad || '—', website: fields.Sajt || '', contact: fields.Kontakt || '', description: fields.Opis || '', featured: fields.Istaknuto === 'da', status: ticket.status === 'Rešeno' || ticket.status === 'resolved' ? 'active' : 'paused' }; }
function partnerMessage(payload) { return ['Kategorija: ' + String(payload.category || '').trim(), 'Grad: ' + String(payload.city || '').trim(), 'Sajt: ' + String(payload.website || '').trim(), 'Kontakt: ' + String(payload.contact || '').trim(), 'Istaknuto: ' + (payload.featured ? 'da' : 'ne'), 'Opis: ' + String(payload.description || '').trim()].join('\n'); }
function isAdmin(request) {
  const expected = String(process.env.ADMIN_PASSWORD || '').trim(); const received = String(request.headers['x-admin-password'] || '').trim();
  if (!expected || !received || expected.length !== received.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(received));
}
function adminUsers(data) {
  const moderation = data && data.userModeration ? data.userModeration : {};
  return [{ id: 'demo-customer', full_name: 'Ana Petrović', role: 'customer', city: 'Novi Sad', phone_verified: true, identity_verified: true, verification_status: 'not_applicable', created_at: 'Demo nalog', provider: null }].concat(providers.map(function (provider) { return { id: provider.id, full_name: provider.name, role: 'provider', city: 'Novi Sad', phone_verified: true, identity_verified: provider.verified, verification_status: provider.verified ? 'verified' : 'pending', created_at: 'Demo nalog', provider: { trade: provider.category, available: provider.availability.indexOf('danas') >= 0, rating: provider.rating, review_count: provider.reviews } }; })).map(function (user) { return Object.assign({}, user, moderation[user.id] || {}); });
}
function adminOverview(data) {
  const jobs = data.jobs || []; const tickets = data.supportTickets || [];
  const users = adminUsers(data);
  return { stats: { users: users.length, providers: providers.length, blocked: users.filter(function (user) { return user.is_blocked; }).length, openJobs: jobs.filter(function (job) { return ['Traži majstora', 'Primljene ponude'].indexOf(job.status) >= 0; }).length, activeJobs: jobs.filter(function (job) { return ['Dogovoren termin', 'Potvrđen dolazak', 'Radovi u toku'].indexOf(job.status) >= 0; }).length, openTickets: tickets.filter(function (ticket) { return ticket.status !== 'Rešeno'; }).length }, jobs: jobs.slice(0, 8), tickets: tickets.slice(0, 8) };
}
function aiLimit(name, fallback) { return Math.max(1, Number(process.env[name] || fallback)); }
function canUseAi(request) {
  const address = request.socket.remoteAddress || 'unknown'; const now = Date.now(); const day = new Date().toISOString().slice(0, 10);
  const hourKey = 'hour:' + address; const dayKey = 'day:' + day + ':' + address; const globalKey = 'global:' + day;
  const recent = (aiRequestLog.get(hourKey) || []).filter(function (time) { return now - time < 3600000; });
  const perIpLimit = aiLimit('AI_DAILY_LIMIT_PER_IP', 3); const globalLimit = aiLimit('AI_DAILY_LIMIT_GLOBAL', 50);
  const dailyCount = Number(aiRequestLog.get(dayKey) || 0); const globalCount = Number(aiRequestLog.get(globalKey) || 0);
  if (recent.length >= 5) return { ok: false, error: 'Previše AI saveta u kratkom periodu. Pokušaj ponovo za sat vremena.' };
  if (dailyCount >= perIpLimit) return { ok: false, error: 'Dostignut je dnevni limit od ' + perIpLimit + ' AI saveta. Pokušaj ponovo sutra.' };
  if (globalCount >= globalLimit) return { ok: false, error: 'Današnji AI limit platforme je dostignut. Pokušaj ponovo sutra.' };
  recent.push(now); aiRequestLog.set(hourKey, recent); aiRequestLog.set(dayKey, dailyCount + 1); aiRequestLog.set(globalKey, globalCount + 1);
  return { ok: true };
}

const server = http.createServer(function (request, response) {
  const url = new URL(request.url, 'http://localhost');
  if (url.pathname.indexOf('/api/auth/') === 0 || url.pathname.indexOf('/api/notifications') === 0) {
    return supabaseApi.handleAuth(request, response, url).catch(function (error) { console.error('Auth greška:', error.message); reply(response, 400, { error: error.message || 'Prijava nije uspela.' }); });
  }
  if (url.pathname.indexOf('/api/admin/') === 0) {
    if (!isAdmin(request)) return reply(response, 401, { error: 'Administratorski pristup nije dozvoljen.' });
    if (supabaseApi.enabled) return supabaseApi.handleAdmin(request, response, url).catch(function (error) { console.error('Supabase admin greška:', error.message); reply(response, 502, { error: 'Admin podaci trenutno nisu dostupni.' }); });
    const adminSupportMatch = url.pathname.match(/^\/api\/admin\/support\/(\d+)$/); const adminPartnerMatch = url.pathname.match(/^\/api\/admin\/partners\/(\d+)$/); const adminJobFlagMatch = url.pathname.match(/^\/api\/admin\/jobs\/(\d+)\/flag$/); const adminUserBlockMatch = url.pathname.match(/^\/api\/admin\/users\/([^/]+)\/block$/); const adminVerificationMatch = url.pathname.match(/^\/api\/admin\/users\/([^/]+)\/verification$/);
    if (url.pathname === '/api/admin/overview' && request.method === 'GET') return reply(response, 200, adminOverview(readData()));
    if (url.pathname === '/api/admin/users' && request.method === 'GET') return reply(response, 200, adminUsers(readData()));
    if (url.pathname === '/api/admin/jobs' && request.method === 'GET') return reply(response, 200, readData().jobs);
    if (url.pathname === '/api/admin/support' && request.method === 'GET') return reply(response, 200, readData().supportTickets || []);
    if (url.pathname === '/api/admin/partners' && request.method === 'GET') return reply(response, 200, (readData().supportTickets || []).filter(function (ticket) { return String(ticket.subject || '').indexOf('Partner katalog · ') === 0; }).map(partnerTicket));
    if (url.pathname === '/api/admin/partners' && request.method === 'POST') return parseBody(request, function (error, payload) { const company = String(payload.company || '').trim(); const category = String(payload.category || '').trim(); const city = String(payload.city || '').trim(); const description = String(payload.description || '').trim(); if (error || !company || !category || !city || !description || company.length > 90 || description.length > 500) return reply(response, 400, { error: 'Proveri naziv, kategoriju, grad i opis partnera.' }); const data = readData(); data.supportTickets = data.supportTickets || []; const ticket = { id: Date.now(), subject: 'Partner katalog · ' + company, message: partnerMessage(payload), status: 'Rešeno', createdAt: new Date().toISOString() }; data.supportTickets.push(ticket); writeData(data); reply(response, 201, partnerTicket(ticket)); });
    if (adminPartnerMatch && request.method === 'POST') return parseBody(request, function (error, payload) { const data = readData(); const ticket = (data.supportTickets || []).find(function (item) { return item.id === Number(adminPartnerMatch[1]) && String(item.subject || '').indexOf('Partner katalog · ') === 0; }); if (error || !ticket) return reply(response, 404, { error: 'Partner nije pronađen.' }); ticket.status = payload.status === 'active' ? 'Rešeno' : 'Primljeno'; ticket.updatedAt = new Date().toISOString(); writeData(data); reply(response, 200, partnerTicket(ticket)); });
    if (adminSupportMatch && request.method === 'POST') return parseBody(request, function (error, payload) { const data = readData(); const ticket = (data.supportTickets || []).find(function (item) { return item.id === Number(adminSupportMatch[1]); }); const statuses = { open: 'Primljeno', in_progress: 'U obradi', resolved: 'Rešeno' }; if (error || !ticket || !statuses[payload.status]) return reply(response, 400, { error: 'Status podrške nije validan.' }); ticket.status = statuses[payload.status]; ticket.updatedAt = new Date().toISOString(); writeData(data); reply(response, 200, ticket); });
    if (adminJobFlagMatch && request.method === 'POST') return parseBody(request, function (error, payload) { const data = readData(); const job = findJob(data, adminJobFlagMatch[1]); if (error || !job) return reply(response, 404, { error: 'Posao nije pronađen.' }); job.adminFlag = Boolean(payload.flagged); job.adminFlaggedAt = job.adminFlag ? new Date().toISOString() : null; writeData(data); reply(response, 200, job); });
    if (adminUserBlockMatch && request.method === 'POST') return parseBody(request, function (error, payload) { const data = readData(); const user = adminUsers(data).find(function (item) { return item.id === adminUserBlockMatch[1]; }); if (error || !user) return reply(response, 404, { error: 'Korisnik nije pronađen.' }); data.userModeration = data.userModeration || {}; const blocked = Boolean(payload.blocked); data.userModeration[user.id] = Object.assign({}, data.userModeration[user.id] || {}, { is_blocked: blocked, blocked_at: blocked ? new Date().toISOString() : null, blocked_reason: blocked ? String(payload.reason || 'Administrativna provera').trim().slice(0, 300) : null }); writeData(data); reply(response, 200, Object.assign({}, user, data.userModeration[user.id])); });
    if (adminVerificationMatch && request.method === 'POST') return parseBody(request, function (error, payload) { const data = readData(); const user = adminUsers(data).find(function (item) { return item.id === adminVerificationMatch[1] && item.role === 'provider'; }); const status = String(payload.status || ''); if (error || !user || ['pending', 'verified', 'rejected'].indexOf(status) < 0) return reply(response, 400, { error: 'Status verifikacije nije validan.' }); data.userModeration = data.userModeration || {}; data.userModeration[user.id] = Object.assign({}, data.userModeration[user.id] || {}, { verification_status: status, identity_verified: status === 'verified' }); writeData(data); reply(response, 200, Object.assign({}, user, data.userModeration[user.id])); });
    return reply(response, 404, { error: 'Admin ruta nije pronađena.' });
  }
  if (supabaseApi.enabled && (url.pathname === '/api/partners' || url.pathname === '/api/partner-rankings' || /^\/api\/partners\/[^/]+\/reviews$/.test(url.pathname))) {
    supabaseApi.handle(request, response, url).catch(function (error) { console.error('Partnerski katalog greška:', error.message); reply(response, 502, { error: error.message || 'Partnerski katalog trenutno nije dostupan.' }); });
    return;
  }
  if (supabaseApi.enabled && url.pathname.indexOf('/api/') === 0 && url.pathname !== '/api/ai-advice') {
    supabaseApi.handle(request, response, url).catch(function (error) {
      console.error('Supabase API greška:', error.message);
      reply(response, 502, { error: 'Privremeno nije moguće sačuvati podatke.' });
    });
    return;
  }
  const offerMatch = url.pathname.match(/^\/api\/jobs\/(\d+)\/offers$/);
  const acceptMatch = url.pathname.match(/^\/api\/jobs\/(\d+)\/accept$/);
  const progressMatch = url.pathname.match(/^\/api\/jobs\/(\d+)\/progress$/);
  const messageMatch = url.pathname.match(/^\/api\/jobs\/(\d+)\/messages$/);
  const photoMatch = url.pathname.match(/^\/api\/jobs\/(\d+)\/photos$/);
  const reviewMatch = url.pathname.match(/^\/api\/jobs\/(\d+)\/review$/);

  if (url.pathname === '/api/ai-advice' && request.method === 'POST') {
    const access = canUseAi(request);
    if (!access.ok) return reply(response, 429, { error: access.error });
    return parseBody(request, function (error, payload) {
      if (error) return reply(response, 400, { error: 'Podaci za AI savet nisu validni.' });
      analyzeProject(payload).then(function (advice) { reply(response, 200, advice); }).catch(function (aiError) {
        console.error('AI savetnik greška:', aiError.message); reply(response, aiError.status || 502, { error: aiError.message || 'AI savetnik trenutno nije dostupan.' });
      });
    });
  }

  if (url.pathname === '/api/providers' && request.method === 'GET') return reply(response, 200, providers);
  if (url.pathname === '/api/partners' && request.method === 'GET') return reply(response, 200, (readData().supportTickets || []).filter(function (ticket) { return String(ticket.subject || '').indexOf('Partner katalog · ') === 0 && (ticket.status === 'Rešeno' || ticket.status === 'resolved'); }).map(partnerTicket));
  if (url.pathname === '/api/jobs' && request.method === 'GET') return reply(response, 200, readData().jobs);
  if (url.pathname === '/api/jobs' && request.method === 'POST') {
    return parseBody(request, function (error, job) {
      if (error || !job.category || !job.location || !job.description) return reply(response, 400, { error: 'Nedostaju obavezna polja.' });
      const data = readData();
      job.id = data.nextJobId || 1;
      data.nextJobId = job.id + 1;
      job.status = 'Traži majstora';
      job.createdAt = new Date().toISOString();
      job.offers = [];
      job.matches = matchedProviders(job.category);
      job.images = Array.isArray(job.images) ? job.images.slice(0, 3) : [];
      job.messages = [];
      data.jobs.unshift(job);
      writeData(data);
      reply(response, 201, job);
    });
  }
  if (offerMatch && request.method === 'POST') {
    return parseBody(request, function (error, offer) {
      const data = readData(); const job = findJob(data, offerMatch[1]);
      if (error || !job || !offer.providerName || !offer.amount || !offer.eta) return reply(response, 400, { error: 'Ponuda nije potpuna.' });
      offer.id = data.nextOfferId || 1; data.nextOfferId = offer.id + 1; offer.createdAt = new Date().toISOString();
      job.offers = job.offers || []; job.offers.push(offer); job.status = 'Primljene ponude';
      writeData(data); reply(response, 201, job);
    });
  }
  if (acceptMatch && request.method === 'POST') {
    return parseBody(request, function (error, payload) {
      const data = readData(); const job = findJob(data, acceptMatch[1]);
      const offer = job && (job.offers || []).find(function (item) { return item.id === Number(payload.offerId); });
      if (error || !offer) return reply(response, 400, { error: 'Ponuda nije pronađena.' });
      job.acceptedOfferId = offer.id; job.status = 'Dogovoren termin'; job.updatedAt = new Date().toISOString();
      job.progress = 'Dogovoren termin';
      job.activity = [{ label: 'Majstor je izabran', at: job.updatedAt }];
      writeData(data); reply(response, 200, job);
    });
  }
  if (progressMatch && request.method === 'POST') {
    return parseBody(request, function (error, payload) {
      const allowed = ['Potvrđen dolazak', 'Radovi u toku', 'Završeno'];
      const data = readData(); const job = findJob(data, progressMatch[1]);
      if (error || !job || !job.acceptedOfferId || allowed.indexOf(payload.progress) < 0) return reply(response, 400, { error: 'Status radova nije moguće promeniti.' });
      job.progress = payload.progress; job.status = payload.progress; job.updatedAt = new Date().toISOString();
      job.activity = job.activity || []; job.activity.push({ label: payload.progress, at: job.updatedAt });
      writeData(data); reply(response, 200, job);
    });
  }
  if (messageMatch && request.method === 'POST') {
    return parseBody(request, function (error, payload) {
      const data = readData(); const job = findJob(data, messageMatch[1]);
      const text = String(payload.text || '').trim();
      if (error || !job || !job.acceptedOfferId || !text || text.length > 600) return reply(response, 400, { error: 'Poruka nije validna.' });
      job.messages = job.messages || []; job.messages.push({ id: Date.now(), author: payload.author === 'majstor' ? 'majstor' : 'klijent', text: text, createdAt: new Date().toISOString() });
      writeData(data); reply(response, 201, job);
    });
  }
  if (photoMatch && request.method === 'POST') {
    return parseBody(request, function (error, payload) {
      const data = readData(); const job = findJob(data, photoMatch[1]);
      const image = String(payload.image || ''); const caption = String(payload.caption || '').trim();
      if (error || !job || !job.acceptedOfferId || image.indexOf('data:image/') !== 0 || image.length > 650000) return reply(response, 400, { error: 'Fotografija nije validna.' });
      job.workPhotos = job.workPhotos || []; job.workPhotos.push({ id: Date.now(), image: image, caption: caption.slice(0, 120), createdAt: new Date().toISOString() });
      writeData(data); reply(response, 201, job);
    });
  }
  if (reviewMatch && request.method === 'POST') {
    return parseBody(request, function (error, payload) {
      const data = readData(); const job = findJob(data, reviewMatch[1]);
      const rating = Number(payload.rating); const comment = String(payload.comment || '').trim();
      if (error || !job || job.progress !== 'Završeno' || rating < 1 || rating > 5 || !comment || comment.length > 500) return reply(response, 400, { error: 'Ocena nije validna.' });
      const author = payload.author === 'majstor' ? 'majstor' : 'klijent';
      job.reviews = job.reviews || {};
      job.reviews[author] = { rating: rating, comment: comment, createdAt: new Date().toISOString() };
      if (author === 'klijent') job.review = job.reviews[author];
      writeData(data); reply(response, 201, job);
    });
  }
  if (url.pathname === '/api/support' && request.method === 'POST') {
    return parseBody(request, function (error, ticket) {
      const subject = String(ticket.subject || '').trim(); const message = String(ticket.message || '').trim();
      if (error || !subject || !message || subject.length > 120 || message.length > 1500) return reply(response, 400, { error: 'Poruka za podršku nije validna.' });
      const data = readData(); data.supportTickets = data.supportTickets || [];
      const saved = { id: Date.now(), subject: subject, message: message, status: 'Primljeno', createdAt: new Date().toISOString() };
      data.supportTickets.push(saved); writeData(data); reply(response, 201, saved);
    });
  }
  if (request.method !== 'GET' && request.method !== 'HEAD') return reply(response, 405, { error: 'Metod nije dozvoljen.' });
  const relativePath = url.pathname === '/' ? '/index.html' : url.pathname;
  const filePath = path.normalize(path.join(root, relativePath));
  if (filePath.indexOf(root) !== 0) return reply(response, 403, { error: 'Zabranjeno.' });
  fs.readFile(filePath, function (error, file) {
    if (error) return reply(response, 404, { error: 'Stranica nije pronađena.' });
    response.writeHead(200, { 'Content-Type': mimeTypes[path.extname(filePath)] || 'application/octet-stream' });
    if (request.method === 'HEAD') response.end(); else response.end(file);
  });
});

const port = Number(process.env.PORT || 3000);
server.listen(port, function () { console.log('Majstor odmah radi na portu ' + port); });
