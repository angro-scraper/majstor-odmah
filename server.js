const http = require('http');
const fs = require('fs');
const path = require('path');
const URL = require('url').URL;

const root = __dirname;
const dataFile = path.join(root, 'data.json');
const mimeTypes = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8' };

function readData() {
  try { return JSON.parse(fs.readFileSync(dataFile, 'utf8')); }
  catch (error) { return { jobs: [], nextJobId: 1 }; }
}

function writeData(data) { fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), 'utf8'); }
function reply(response, status, body) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(body));
}

const server = http.createServer(function (request, response) {
  const url = new URL(request.url, 'http://localhost');
  if (url.pathname === '/api/jobs' && request.method === 'GET') {
    return reply(response, 200, readData().jobs);
  }
  if (url.pathname === '/api/jobs' && request.method === 'POST') {
    let raw = '';
    request.on('data', function (chunk) { raw += chunk; if (raw.length > 100000) request.destroy(); });
    request.on('end', function () {
      try {
        const job = JSON.parse(raw);
        if (!job.category || !job.location || !job.description) return reply(response, 400, { error: 'Nedostaju obavezna polja.' });
        const data = readData();
        job.id = data.nextJobId++;
        job.status = 'Traži majstora';
        job.createdAt = new Date().toISOString();
        data.jobs.unshift(job);
        writeData(data);
        reply(response, 201, job);
      } catch (error) { reply(response, 400, { error: 'Neispravan zahtev.' }); }
    });
    return;
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
