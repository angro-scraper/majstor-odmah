function escapeHtml(value) {
  return String(value || '').replace(/[&<>'"]/g, function (character) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]; });
}

function updateLocalJobs(jobs) { localStorage.setItem('majstorOdmahJobs', JSON.stringify(jobs)); }
function syncJobsFromServer(role) {
  if (window.location.protocol === 'file:') return;
  fetch('/api/jobs').then(function (response) { return response.json(); }).then(function (jobs) {
    updateLocalJobs(jobs);
    if (localStorage.getItem('majstorOdmahRole') === role) showDashboard(role);
  }).catch(function () { console.info('Prikazujemo lokalno sačuvane zahteve.'); });
}
function requestWorkflow(path, payload) {
  return fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).then(function (response) {
    if (!response.ok) throw new Error('Akcija nije uspela.'); return response.json();
  });
}
function refreshWorkflow(role) { syncJobsFromServer(role); }

function renderOffers(job) {
  const offers = job.offers || [];
  if (!offers.length) return '<p class="helper-note">Majstori dobijaju obaveštenje. Prva ponuda obično stiže za nekoliko minuta.</p>';
  return '<div class="offers">' + offers.map(function (offer) {
    const accepted = job.acceptedOfferId === offer.id;
    return '<div class="offer-card"><div><b>' + escapeHtml(offer.providerName) + ' · ' + escapeHtml(offer.amount) + ' RSD</b><span>Dolazak: ' + escapeHtml(offer.eta) + (offer.note ? ' · ' + escapeHtml(offer.note) : '') + '</span></div>' + (accepted ? '<span class="job-status confirmed">Izabran</span>' : (job.acceptedOfferId ? '' : '<button class="accept-offer" data-job-id="' + job.id + '" data-offer-id="' + offer.id + '">Izaberi</button>')) + '</div>';
  }).join('') + '</div>';
}

function renderMatches(job) {
  const matches = job.matches || [];
  if (!matches.length) return '';
  return '<div class="match-grid">' + matches.map(function (provider) {
    return '<div class="match-card"><b>✓ ' + escapeHtml(provider.name) + ' · ★ ' + escapeHtml(provider.rating) + '</b><span>' + escapeHtml(provider.responseTime) + '</span><em>' + escapeHtml(provider.availability) + '</em></div>';
  }).join('') + '</div>';
}

function renderProgress(job, isPro) {
  if (!job.acceptedOfferId) return '';
  const stages = ['Dogovoren termin', 'Potvrđen dolazak', 'Radovi u toku', 'Završeno'];
  const current = stages.indexOf(job.progress || job.status);
  const next = stages[current + 1];
  const done = Math.max(current, 0);
  const line = '<div class="timeline">' + stages.map(function (stage, index) { return '<i class="' + (index <= done ? 'done' : '') + '"></i>'; }).join('') + '</div>';
  const latest = (job.activity || []).slice(-1)[0];
  const activity = latest ? '<div class="activity-line"><b>' + escapeHtml(latest.label) + '</b><span>' + dateLabel(latest.at) + '</span></div>' : '';
  const action = isPro && next ? '<button class="progress-action" data-job-id="' + job.id + '" data-progress="' + next + '">' + next + ' →</button>' : '';
  return line + '<p class="helper-note">' + escapeHtml(job.progress || job.status) + '</p>' + activity + action;
}

function renderJob(job, isPro) {
  const offers = job.offers || [];
  const statusClass = job.acceptedOfferId ? 'confirmed' : (offers.length ? 'accepted' : '');
  const proAction = isPro && !job.acceptedOfferId ? '<form class="offer-form" data-job-id="' + job.id + '"><input required name="amount" inputmode="numeric" placeholder="Cena RSD" /><input required name="eta" placeholder="npr. danas 17h" /><button class="secondary-button" type="submit">Pošalji ponudu</button></form>' : '';
  const progress = renderProgress(job, isPro);
  return '<article class="dashboard-job"><div><b>' + escapeHtml(job.category) + ' · ' + escapeHtml(job.location) + '</b><p>' + escapeHtml(job.description) + '</p><p>' + dateLabel(job.createdAt) + '</p></div><span class="job-status ' + statusClass + '">' + escapeHtml(job.status || 'Novo') + '</span><div class="offer-panel">' + (isPro ? '<h4>Pošalji svoju ponudu</h4>' + proAction + (offers.length ? '<p class="helper-note">Na posao je stiglo ' + offers.length + ' ponuda.</p>' : '') : '<h4>Obavešteni majstori (' + (job.matches || []).length + ')</h4>' + renderMatches(job) + '<h4 style="margin-top:12px">Ponude majstora</h4>' + renderOffers(job) + progress) + '</div></article>';
}

function showDashboard(role) {
  accountWelcome.classList.add('hidden');
  dashboard.classList.remove('hidden');
  const jobs = JSON.parse(localStorage.getItem('majstorOdmahJobs') || '[]');
  const isPro = role === 'pro';
  const offerCount = jobs.reduce(function (total, job) { return total + (job.offers || []).length; }, 0);
  const selectedCount = jobs.filter(function (job) { return job.acceptedOfferId; }).length;
  const list = jobs.length ? jobs.map(function (job) { return renderJob(job, isPro); }).join('') : '<div class="empty-jobs">Trenutno nema otvorenih poslova u ovoj zoni.</div>';
  dashboard.innerHTML = '<div class="dashboard-header"><div><p class="eyebrow"><span></span> Moj nalog</p><h2>' + (isPro ? 'Poslovi u blizini' : 'Moji zahtevi i ponude') + '</h2><p>' + (isPro ? 'Pošalji jasnu ponudu i klijent može odmah da te izabere.' : 'Uporedi ponude, izaberi majstora i prati dogovoreni posao.') + '</p></div><span class="dashboard-role">' + (isPro ? 'MAJSTOR' : 'KLIJENT') + '</span></div><div class="dashboard-stats"><div class="dashboard-stat"><b>' + jobs.length + '</b><span>' + (isPro ? 'otvorena posla' : 'aktivni zahtevi') + '</span></div><div class="dashboard-stat"><b>' + (isPro ? '4,9' : offerCount) + '</b><span>' + (isPro ? 'prosečna ocena' : 'primljene ponude') + '</span></div><div class="dashboard-stat"><b>' + selectedCount + '</b><span>dogovoreni termini</span></div></div><h3>' + (isPro ? 'Poslovi za tvoju delatnost' : 'Tok posla') + '</h3><div class="job-list">' + list + '</div><div class="dashboard-actions"><button class="button" id="dashboardPrimary">' + (isPro ? 'Osveži poslove' : 'Objavi posao') + ' →</button><button class="secondary-button" id="switchRole">Promeni ulogu</button></div>';
  document.querySelector('#dashboardPrimary').addEventListener('click', function () { if (isPro) refreshWorkflow(role); else { closeAccount(); openModal(); } });
  document.querySelectorAll('.offer-form').forEach(function (form) { form.addEventListener('submit', function (event) {
    event.preventDefault(); const jobId = form.dataset.jobId; const amount = form.querySelector('[name="amount"]').value; const eta = form.querySelector('[name="eta"]').value;
    requestWorkflow('/api/jobs/' + jobId + '/offers', { providerName: 'Milan Jovanović', amount: amount, eta: eta, note: 'Verifikovan električar · 4,9★' }).then(function () { refreshWorkflow(role); }).catch(function () { alert('Ponuda nije poslata. Pokušaj ponovo.'); });
  }); });
  document.querySelectorAll('.accept-offer').forEach(function (button) { button.addEventListener('click', function () {
    requestWorkflow('/api/jobs/' + button.dataset.jobId + '/accept', { offerId: button.dataset.offerId }).then(function () { refreshWorkflow(role); }).catch(function () { alert('Ponuda nije izabrana. Pokušaj ponovo.'); });
  }); });
  document.querySelectorAll('.progress-action').forEach(function (button) { button.addEventListener('click', function () {
    requestWorkflow('/api/jobs/' + button.dataset.jobId + '/progress', { progress: button.dataset.progress }).then(function () { refreshWorkflow(role); }).catch(function () { alert('Status nije promenjen. Pokušaj ponovo.'); });
  }); });
  document.querySelector('#switchRole').addEventListener('click', function () { localStorage.removeItem('majstorOdmahRole'); accountWelcome.classList.remove('hidden'); dashboard.classList.add('hidden'); });
}
