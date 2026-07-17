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

function renderImages(job) {
  const images = job.images || [];
  if (!images.length) return '';
  return '<div class="image-strip">' + images.map(function (image, index) { return '<img src="' + escapeHtml(image) + '" alt="Fotografija problema ' + (index + 1) + '" />'; }).join('') + '</div>';
}

function renderChat(job, isPro) {
  if (!job.acceptedOfferId) return '';
  const messages = job.messages || [];
  const display = messages.length ? messages.map(function (message) { return '<div class="chat-message ' + (message.author === 'majstor' ? 'pro' : '') + '"><b>' + (message.author === 'majstor' ? 'Milan · majstor' : 'Klijent') + '</b>' + escapeHtml(message.text) + '</div>'; }).join('') : '<p class="helper-note">Dogovorite detalje posla ovde — sve poruke ostaju uz ovaj projekat.</p>';
  return '<div class="chat"><h4>Poruke sa ' + (isPro ? 'klijentom' : 'majstorom') + '</h4><div class="chat-feed">' + display + '</div><form class="chat-form" data-job-id="' + job.id + '"><input required maxlength="600" name="message" placeholder="Napiši poruku…" /><button type="submit">Pošalji</button></form></div>';
}

function renderWorkPhotos(job, isPro) {
  if (!job.acceptedOfferId) return '';
  const photos = job.workPhotos || [];
  const existing = photos.length ? '<div>' + photos.map(function (photo) { return '<span class="work-photo-item"><img src="' + escapeHtml(photo.image) + '" alt="Fotografija sa radova" />' + escapeHtml(photo.caption || 'Ažuriranje radova') + '</span>'; }).join('') + '</div>' : '<p class="helper-note">Još nema fotografija sa radova.</p>';
  const form = isPro ? '<form class="work-photo-form" data-job-id="' + job.id + '"><input required type="file" accept="image/*" name="workPhoto" /><input maxlength="120" name="caption" placeholder="Kratak opis" /><button type="submit">Dodaj sliku</button></form>' : '';
  return '<div class="work-log"><h4>Fotografije sa radova</h4>' + existing + form + '</div>';
}

function renderReview(job, isPro) {
  if (job.review) return '<div class="review-box"><h4>Ocena klijenta</h4><div class="review-display"><b>★ ' + escapeHtml(job.review.rating) + ' / 5</b><br />' + escapeHtml(job.review.comment) + '</div></div>';
  if (isPro || job.progress !== 'Završeno') return '';
  return '<div class="review-box"><h4>Kako je prošao posao?</h4><form class="review-form" data-job-id="' + job.id + '"><input required name="rating" type="number" min="1" max="5" placeholder="Ocena 1–5" /><textarea required name="comment" maxlength="500" rows="2" placeholder="Opiši iskustvo sa majstorom."></textarea><button type="submit">Ostavi ocenu</button></form></div>';
}

function fileToDataUrl(file) {
  return new Promise(function (resolve, reject) { if (!file || file.size > 450000) { reject(new Error('Fotografija mora biti manja od 450 KB.')); return; } const reader = new FileReader(); reader.onload = function () { resolve(reader.result); }; reader.onerror = reject; reader.readAsDataURL(file); });
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
  return '<article class="dashboard-job"><div><b>' + escapeHtml(job.category) + ' · ' + escapeHtml(job.location) + '</b><p>' + escapeHtml(job.description) + '</p><p>' + dateLabel(job.createdAt) + '</p>' + renderImages(job) + '</div><span class="job-status ' + statusClass + '">' + escapeHtml(job.status || 'Novo') + '</span><div class="offer-panel">' + (isPro ? '<h4>Pošalji svoju ponudu</h4>' + proAction + (offers.length ? '<p class="helper-note">Na posao je stiglo ' + offers.length + ' ponuda.</p>' : '') : '<h4>Obavešteni majstori (' + (job.matches || []).length + ')</h4>' + renderMatches(job) + '<h4 style="margin-top:12px">Ponude majstora</h4>' + renderOffers(job)) + progress + renderWorkPhotos(job, isPro) + renderChat(job, isPro) + renderReview(job, isPro) + '</div></article>';
}

function showDashboard(role) {
  accountWelcome.classList.add('hidden');
  dashboard.classList.remove('hidden');
  const jobs = JSON.parse(localStorage.getItem('majstorOdmahJobs') || '[]');
  const isPro = role === 'pro';
  const profile = typeof getDemoProfile === 'function' ? getDemoProfile(role) : (isPro ? { name: 'Milan Jovanović', email: 'milan.demo@majstorodmah.rs' } : { name: 'Ana Petrović', email: 'ana.demo@majstorodmah.rs' });
  const offerCount = jobs.reduce(function (total, job) { return total + (job.offers || []).length; }, 0);
  const selectedCount = jobs.filter(function (job) { return job.acceptedOfferId; }).length;
  const list = jobs.length ? jobs.map(function (job) { return renderJob(job, isPro); }).join('') : '<div class="empty-jobs">Trenutno nema otvorenih poslova u ovoj zoni.</div>';
  dashboard.innerHTML = '<div class="dashboard-header"><div><p class="eyebrow"><span></span> ' + escapeHtml(profile.email) + '</p><h2>Zdravo, ' + escapeHtml(profile.name.split(' ')[0]) + '.</h2><p>' + (isPro ? 'Tvoj demo nalog prikazuje poslove iz blizine. Pošalji jasnu ponudu i Ana može odmah da te izabere.' : 'Tvoj demo nalog prikazuje zahteve, ponude i ceo tok dogovora sa Milanom.') + '</p></div><span class="dashboard-role">' + (isPro ? 'DEMO MAJSTOR' : 'DEMO KLIJENT') + '</span></div><div class="dashboard-stats"><div class="dashboard-stat"><b>' + jobs.length + '</b><span>' + (isPro ? 'otvorena posla' : 'aktivni zahtevi') + '</span></div><div class="dashboard-stat"><b>' + (isPro ? '4,9' : offerCount) + '</b><span>' + (isPro ? 'prosečna ocena' : 'primljene ponude') + '</span></div><div class="dashboard-stat"><b>' + selectedCount + '</b><span>dogovoreni termini</span></div></div><h3>' + (isPro ? 'Poslovi za tvoju delatnost' : 'Tok posla') + '</h3><div class="job-list">' + list + '</div><div class="dashboard-actions"><button class="button" id="dashboardPrimary">' + (isPro ? 'Osveži poslove' : 'Objavi posao') + ' →</button><button class="secondary-button" id="switchRole">Promeni demo nalog</button></div>';
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
  document.querySelectorAll('.chat-form').forEach(function (form) { form.addEventListener('submit', function (event) {
    event.preventDefault(); const text = form.querySelector('[name="message"]').value;
    requestWorkflow('/api/jobs/' + form.dataset.jobId + '/messages', { text: text, author: isPro ? 'majstor' : 'klijent' }).then(function () { refreshWorkflow(role); }).catch(function () { alert('Poruka nije poslata. Pokušaj ponovo.'); });
  }); });
  document.querySelectorAll('.work-photo-form').forEach(function (form) { form.addEventListener('submit', function (event) {
    event.preventDefault(); const file = form.querySelector('[name="workPhoto"]').files[0]; const caption = form.querySelector('[name="caption"]').value;
    fileToDataUrl(file).then(function (image) { return requestWorkflow('/api/jobs/' + form.dataset.jobId + '/photos', { image: image, caption: caption }); }).then(function () { refreshWorkflow(role); }).catch(function (error) { alert(error.message || 'Fotografija nije poslata.'); });
  }); });
  document.querySelectorAll('.review-form').forEach(function (form) { form.addEventListener('submit', function (event) {
    event.preventDefault(); requestWorkflow('/api/jobs/' + form.dataset.jobId + '/review', { rating: form.querySelector('[name="rating"]').value, comment: form.querySelector('[name="comment"]').value }).then(function () { refreshWorkflow(role); }).catch(function () { alert('Ocena nije poslata. Pokušaj ponovo.'); });
  }); });
  document.querySelector('#switchRole').addEventListener('click', function () { localStorage.removeItem('majstorOdmahRole'); localStorage.removeItem('majstorOdmahDemoAccount'); document.querySelector('#loginButton').textContent = 'Moj nalog'; accountWelcome.classList.remove('hidden'); dashboard.classList.add('hidden'); });
}
