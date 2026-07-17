const http = require('http');
const fs = require('fs');
const path = require('path');
const URL = require('url').URL;

const root = __dirname;
const dataFile = path.join(root, 'data.json');
const mimeTypes = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8' };
const providers = [
  { id: 'milan', name: 'Milan Jovanović', category: 'Električar', rating: '4,9', reviews: 86, responseTime: 'odgovara za ~8 min', availability: 'dostupan danas', verified: true },
  { id: 'jelena', name: 'Jelena Marković', category: 'Električar', rating: '4,8', reviews: 42, responseTime: 'odgovara za ~15 min', availability: 'dostupna danas', verified: true },
  { id: 'nikola', name: 'Nikola Petrović', category: 'Vodoinstalater', rating: '5,0', reviews: 64, responseTime: 'odgovara za ~8 min', availability: 'dostupan danas', verified: true },
  { id: 'marko', name: 'Marko Ilić', category: 'Keramičar', rating: '4,8', reviews: 51, responseTime: 'odgovara za ~20 min', availability: 'dostupan sutra', verified: true }
];
function matchedProviders(category) { return providers.filter(function (provider) { return provider.category === category && provider.availability.indexOf('danas') >= 0; }); }
const demoJob = { id: 1, category: 'Električar', location: 'Detelinara, Novi Sad', description: 'Povremeno izbacuje osigurač u kuhinji. Potreban pregled danas.', status: 'Traži majstora', createdAt: '2026-07-17T08:30:00.000Z', offers: [], matches: matchedProviders('Električar') };

function readData() {
  try {
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    if (!data.jobs || !data.jobs.length) return { jobs: [demoJob], nextJobId: 2, nextOfferId: data.nextOfferId || 1 };
    return data;
  } catch (error) { return { jobs: [demoJob], nextJobId: 2, nextOfferId: 1 }; }
}
function writeData(data) { fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), 'utf8'); }
function reply(response, status, body) { response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' }); response.end(JSON.stringify(body)); }
function parseBody(request, done) {
  let raw = '';
  request.on('data', function (chunk) { raw += chunk; if (raw.length > 100000) request.destroy(); });
  request.on('end', function () { try { done(null, JSON.parse(raw || '{}')); } catch (error) { done(error); } });
}
function findJob(data, id) { return data.jobs.find(function (job) { return job.id === Number(id); }); }

const server = http.createServer(function (request, response) {
  const url = new URL(request.url, 'http://localhost');
  const offerMatch = url.pathname.match(/^\/api\/jobs\/(\d+)\/offers$/);
  const acceptMatch = url.pathname.match(/^\/api\/jobs\/(\d+)\/accept$/);

  if (url.pathname === '/api/providers' && request.method === 'GET') return reply(response, 200, providers);
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
      writeData(data); reply(response, 200, job);
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
