function escapeHtml(value) {
  return String(value || '').replace(/[&<>'"]/g, function (character) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]; });
}

function updateLocalJobs(jobs) { localStorage.setItem('majstorOdmahJobs', JSON.stringify(Array.isArray(jobs) ? jobs : [])); }
function getWorkflowJobs() { try { const saved = JSON.parse(localStorage.getItem('majstorOdmahJobs') || '[]'); return Array.isArray(saved) ? saved : []; } catch (error) { return []; } }
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

function offerProfile(name) {
  const profiles = {
    'Milan Jovanović': { trade: 'Električar', rating: '4,9', reliability: '98%', jobs: '142 rada' },
    'Nikola Petrović': { trade: 'Vodoinstalater', rating: '5,0', reliability: '99%', jobs: '118 radova' },
    'Marko Ilić': { trade: 'Keramičar', rating: '4,8', reliability: '96%', jobs: '76 radova' }
  };
  return profiles[name] || { trade: 'Verifikovan majstor', rating: '4,8', reliability: '95%', jobs: 'završenih radova' };
}

function offerAmount(value) { return Number(String(value || '').replace(/[^0-9]/g, '')) || 0; }

function renderOffers(job) {
  const offers = job.offers || [];
  if (!offers.length) return '<p class="helper-note">Majstori dobijaju obaveštenje. Prva ponuda obično stiže za nekoliko minuta.</p>';
  const prices = offers.map(function (offer) { return offerAmount(offer.amount); }).filter(Boolean);
  const bestPrice = prices.length ? Math.min.apply(null, prices) : 0;
  return '<p class="offer-comparison-note">Uporedi cenu, vreme dolaska i pouzdanost pre izbora.</p><div class="offers">' + offers.map(function (offer) {
    const accepted = job.acceptedOfferId === offer.id;
    const profile = offerProfile(offer.providerName);
    const amount = offerAmount(offer.amount);
    const best = !accepted && amount && amount === bestPrice;
    const initials = String(offer.providerName || 'M').split(' ').map(function (part) { return part.charAt(0); }).join('').slice(0, 2);
    return '<div class="offer-card' + (best ? ' best-price' : '') + '"><div class="offer-provider"><span class="offer-avatar">' + escapeHtml(initials) + '</span><div><b>' + escapeHtml(offer.providerName) + '</b><small>' + escapeHtml(profile.trade) + ' · ★ ' + profile.rating + '</small></div></div><div class="offer-price"><b>' + escapeHtml(offer.amount) + ' RSD</b>' + (best ? '<small>Najniža cena</small>' : '<small>Procena ponude</small>') + '</div><div class="offer-metrics"><span>Dolazak <b>' + escapeHtml(offer.eta) + '</b></span><span>Pouzdanost <b>' + profile.reliability + '</b></span><span>' + profile.jobs + '</span></div>' + (accepted ? '<span class="job-status confirmed">Izabran</span>' : (job.acceptedOfferId ? '' : '<button class="accept-offer" data-job-id="' + job.id + '" data-offer-id="' + offer.id + '">Izaberi majstora</button>')) + '</div>';
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
  const reviews = job.reviews || (job.review ? { klijent: job.review } : {});
  const ownKey = isPro ? 'majstor' : 'klijent';
  const displays = [
    { key: 'klijent', label: 'Ocena klijenta za majstora' },
    { key: 'majstor', label: 'Ocena majstora za klijenta' }
  ].filter(function (item) { return reviews[item.key]; }).map(function (item) {
    const review = reviews[item.key];
    return '<div class="review-display"><b>' + item.label + ' · ★ ' + escapeHtml(review.rating) + ' / 5</b><br />' + escapeHtml(review.comment) + '</div>';
  }).join('');
  if (job.progress !== 'Završeno') return displays ? '<div class="review-box"><h4>Uzajamne ocene</h4>' + displays + '</div>' : '';
  const form = reviews[ownKey] ? '' : '<form class="review-form" data-job-id="' + job.id + '"><input required name="rating" type="number" min="1" max="5" placeholder="Ocena 1–5" /><textarea required name="comment" maxlength="500" rows="2" placeholder="' + (isPro ? 'Opiši saradnju sa klijentom.' : 'Opiši iskustvo sa majstorom.') + '"></textarea><button type="submit">Ostavi ocenu</button></form>';
  return '<div class="review-box"><h4>Uzajamne ocene</h4>' + displays + form + (form ? '<p class="helper-note">Ocena je vidljiva drugoj strani i utiče na pokazatelj pouzdanosti.</p>' : '') + '</div>';
}

function renderAiAdvisor(isPro) {
  const title = isPro ? 'AI savetnik za ponudu' : 'AI savetnik za radove';
  const lead = isPro ? 'Dodaj fotografiju i opis da dobiješ predlog obima radova i materijala za ponudu.' : 'Dodaj fotografiju problema i opis — dobićeš predlog majstora, radova i materijala.';
  return '<section class="ai-advisor"><div class="ai-advisor-head"><span>✦</span><div><h4>' + title + '</h4><p>' + lead + '</p></div></div><form id="aiAdvisorForm"><textarea required name="description" maxlength="1500" rows="3" placeholder="Opiši šta vidiš ili šta želiš da uradiš."></textarea><input name="images" type="file" accept="image/jpeg,image/png,image/webp" multiple /><label class="ai-consent"><input required type="checkbox" /> Razumem da se izabrane fotografije i opis šalju AI servisu radi izrade predloga.</label><button type="submit">Analiziraj fotografiju i opis →</button></form><div class="ai-advice-result hidden" id="aiAdviceResult" aria-live="polite"></div><p class="ai-disclaimer">Savet je informativan. Kvalifikovan majstor potvrđuje stanje, bezbednost i potrebne količine na licu mesta. Dostupna su do 3 AI saveta dnevno po korisniku.</p></section>';
}

function renderAiAdvice(advice) {
  const work = (advice.work_scope || []).map(function (item) { return '<li>' + escapeHtml(item) + '</li>'; }).join('');
  const materials = (advice.materials || []).map(function (item) { return '<li><b>' + escapeHtml(item.item) + '</b><span>' + escapeHtml(item.quantity_note) + '</span></li>'; }).join('');
  return '<div class="ai-advice-summary"><span>Predlog · pouzdanost: ' + escapeHtml(advice.confidence || 'srednja') + '</span><h4>' + escapeHtml(advice.recommended_trade || 'Potreban je stručan pregled') + '</h4><p>' + escapeHtml(advice.summary || '') + '</p></div><div class="ai-advice-columns"><div><b>Predlog radova</b><ul>' + work + '</ul></div><div><b>Okvirni materijali</b><ul class="ai-materials">' + materials + '</ul></div></div><p class="ai-safety">⚠ ' + escapeHtml(advice.safety_note || 'Pre početka radova proveri stanje sa kvalifikovanim majstorom.') + '</p><div class="ai-advice-actions"><button type="button" class="ai-create-job">Objavi zahtev za majstora →</button><a href="partneri.html">Pretraži materijale</a></div>';
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
  const counterparty = isPro ? 'Klijent Ana Petrović · ★ 4,9 · pouzdanost 98% · bez otkazanih termina' : 'Majstor Milan Jovanović · ★ 4,9 (86 ocena) · pouzdanost 98%';
  return '<article class="dashboard-job"><div><b>' + escapeHtml(job.category) + ' · ' + escapeHtml(job.location) + '</b><p>' + escapeHtml(job.description) + '</p><p>' + dateLabel(job.createdAt) + '</p><p class="counterparty-rating">' + counterparty + '</p>' + renderImages(job) + '</div><span class="job-status ' + statusClass + '">' + escapeHtml(job.status || 'Novo') + '</span><div class="offer-panel">' + (isPro ? '<h4>Pošalji svoju ponudu</h4>' + proAction + (offers.length ? '<p class="helper-note">Na posao je stiglo ' + offers.length + ' ponuda.</p>' : '') : '<h4>Obavešteni majstori (' + (job.matches || []).length + ')</h4>' + renderMatches(job) + '<h4 style="margin-top:12px">Ponude majstora</h4>' + renderOffers(job)) + progress + renderWorkPhotos(job, isPro) + renderChat(job, isPro) + renderReview(job, isPro) + '</div></article>';
}

function defaultPortfolio() {
  return [
    { title: 'Rasveta u kuhinji', detail: 'LED i nova instalacija', emoji: '💡', color: '#3e7058' },
    { title: 'Razvodna tabla', detail: 'Zamena osigurača', emoji: '⚡', color: '#315f81' },
    { title: 'Pametni prekidači', detail: 'Stan · Grbavica', emoji: '⌁', color: '#9a6547' }
  ];
}

function getPortfolio() {
  try {
    const saved = JSON.parse(localStorage.getItem('majstorOdmahPortfolio') || 'null');
    return Array.isArray(saved) && saved.length ? saved : defaultPortfolio();
  } catch (error) { return defaultPortfolio(); }
}

function renderPortfolioItem(item) {
  const image = item.image ? '<img src="' + escapeHtml(item.image) + '" alt="Rad: ' + escapeHtml(item.title) + '" />' : '<span class="portfolio-emoji">' + escapeHtml(item.emoji || '🛠') + '</span>';
  return '<article class="portfolio-item" style="background:' + escapeHtml(item.color || '#3e7058') + '">' + image + '<div><b>' + escapeHtml(item.title) + '</b><small>' + escapeHtml(item.detail || 'Radovi Milana Jovanovića') + '</small></div></article>';
}

function renderProPanel() {
  const portfolio = getPortfolio();
  const available = localStorage.getItem('majstorOdmahAvailability') !== 'false';
  return '<section class="pro-panel"><div class="pro-panel-top"><span class="pro-panel-avatar">MJ</span><div><h3>Milan Jovanović</h3><p>Verifikovan električar · 4,9 ★ · 86 ocena · pouzdanost 98%</p></div><label class="availability-toggle"><input id="availabilityToggle" type="checkbox"' + (available ? ' checked' : '') + ' /> ' + (available ? 'Dostupan danas' : 'Nisam dostupan') + '</label></div><div class="pro-panel-metrics"><div><b>86</b><span>završenih radova</span></div><div><b>~8 min</b><span>prosečan odgovor</span></div><div><b>20 km</b><span>radijus dolaska</span></div></div><p class="service-zones"><b>Zone rada:</b> Detelinara, Liman, Grbavica, Centar i Novi Sad</p><p class="trust-note">Poslovi klijenata sa dobrom istorijom saradnje imaju prednost. Ponavljana otkazivanja i potvrđene prijave spuštaju prioritet, uz mogućnost žalbe.</p><div class="portfolio-head"><h4>Portfolio radova</h4><span>' + portfolio.length + ' prikazanih projekata</span></div><div class="portfolio-grid">' + portfolio.map(renderPortfolioItem).join('') + '</div><form class="portfolio-upload" id="portfolioUpload"><input required name="portfolioImage" type="file" accept="image/*" /><input required name="portfolioTitle" maxlength="42" placeholder="npr. Zamena plafonjere" /><button type="submit">Dodaj rad</button></form>' + renderAiAdvisor(true) + renderNotifications('pro') + '</section>';
}

function renderCoverageMap() {
  return '<section class="coverage-card"><div class="coverage-card-head"><div><b>Zona dolaska</b><small>Trenutno prima zahteve do 20 km</small></div><span>● Dostupan danas</span></div><div class="coverage-map" aria-label="Prikaz zone rada u Novom Sadu"><i class="coverage-ring ring-large"></i><i class="coverage-ring ring-small"></i><b class="coverage-origin">● Detelinara</b><span class="coverage-zone zone-centar">Centar</span><span class="coverage-zone zone-liman">Liman</span><span class="coverage-zone zone-grbavica">Grbavica</span><span class="coverage-zone zone-veternik">Veternik</span></div><div class="coverage-legend"><span>✓ 5 zona pokriveno</span><span>prosečan odgovor ~8 min</span></div></section>';
}

var baseProPanel = renderProPanel;
renderProPanel = function () { return baseProPanel().replace('<p class="service-zones">', renderCoverageMap() + '<p class="service-zones">'); };
var baseCustomerPanel = renderCustomerPanel;
renderCustomerPanel = function () { return baseCustomerPanel().replace('<p class="trust-note">', '<section class="project-location"><span>⌖</span><div><b>Lokacija projekta</b><small>Detelinara, Novi Sad · 8 dostupnih majstora u blizini</small></div><em>Prikaži zonu</em></section><p class="trust-note">'); };

function initialNotifications(role) {
  return role === 'pro' ? [
    { text: 'Novi zahtev za električara u Detelinari je u tvom radijusu.', at: 'sada' },
    { text: 'Ana Petrović je otvorila detalje posla.', at: 'pre 3 min' }
  ] : [
    { text: 'Tri dostupna majstora su obaveštena o tvom zahtevu.', at: 'sada' },
    { text: 'Milan Jovanović je dostupan danas.', at: 'pre 8 min' }
  ];
}

function getNotifications(role) {
  try {
    const saved = JSON.parse(localStorage.getItem('majstorOdmahNotifications_' + role) || '[]');
    return saved.concat(initialNotifications(role)).slice(0, 5);
  } catch (error) { return initialNotifications(role); }
}

function addNotification(role, text) {
  let saved = [];
  try { saved = JSON.parse(localStorage.getItem('majstorOdmahNotifications_' + role) || '[]'); } catch (error) { saved = []; }
  saved.unshift({ text: text, at: 'upravo sada' });
  localStorage.setItem('majstorOdmahNotifications_' + role, JSON.stringify(saved.slice(0, 5)));
}

function renderNotifications(role) {
  const notifications = getNotifications(role);
  return '<section class="notification-center"><div class="notification-heading"><h4>Obaveštenja</h4><span class="notification-count">' + notifications.length + '</span></div><div class="notification-list">' + notifications.slice(0, 3).map(function (item) { return '<article class="notification-item ' + (role === 'pro' ? 'pro' : '') + '"><i class="notification-dot"></i><div><p>' + escapeHtml(item.text) + '</p><small>' + escapeHtml(item.at) + '</small></div></article>'; }).join('') + '</div></section>';
}

function defaultCustomerPortfolio() {
  return [
    { title: 'Kuhinja', detail: 'Rasveta i utičnice', symbol: '🍳', color: '#b97755' },
    { title: 'Kupatilo', detail: 'Planirano renoviranje', symbol: '◫', color: '#6d90a2' },
    { title: 'Dnevni boravak', detail: 'Pametna rasveta', symbol: '⌂', color: '#8a7764' }
  ];
}

function getCustomerPortfolio() {
  try {
    const saved = JSON.parse(localStorage.getItem('majstorOdmahCustomerPortfolio') || 'null');
    return Array.isArray(saved) && saved.length ? saved : defaultCustomerPortfolio();
  } catch (error) { return defaultCustomerPortfolio(); }
}

function renderCustomerPanel() {
  const portfolio = getCustomerPortfolio();
  const cards = portfolio.map(function (item) {
    const visual = item.image ? '<img src="' + escapeHtml(item.image) + '" alt="Prostor: ' + escapeHtml(item.title) + '" />' : '<span class="customer-symbol">' + escapeHtml(item.symbol || '⌂') + '</span>';
    return '<article class="customer-project" style="background:' + escapeHtml(item.color || '#b97755') + '">' + visual + '<div><b>' + escapeHtml(item.title) + '</b><small>' + escapeHtml(item.detail || 'Moj projekat') + '</small></div></article>';
  }).join('');
  return '<section class="customer-panel"><div class="customer-panel-top"><span class="customer-panel-avatar">AP</span><div><h3>Ana Petrović</h3><p>Moj dom · Detelinara, Novi Sad · 4,9 ★ · pouzdanost 98%</p></div><span class="home-tag">KLIJENT</span></div><p class="trust-note">Pre izbora ponude vidiš ocenu, broj završenih poslova i pouzdanost majstora. Ponavljana otkazivanja, potvrđene prijave i slab odziv utiču na rang-listu.</p><div class="portfolio-head"><h4>Moj dom i projekti</h4><span>dodaj prostor za sledeći posao</span></div><div class="customer-projects">' + cards + '</div><form class="customer-upload" id="customerPortfolioUpload"><input required name="customerImage" type="file" accept="image/*" /><input required name="customerTitle" maxlength="42" placeholder="npr. Terasa" /><button type="submit">Dodaj prostor</button></form>' + renderAiAdvisor(false) + renderNotifications('customer') + '</section>';
}

function showDashboard(role) {
  accountWelcome.classList.add('hidden');
  dashboard.classList.remove('hidden');
  accountBackdrop.classList.add('dashboard-open');
  const jobs = getWorkflowJobs();
  const isPro = role === 'pro';
  const profile = typeof getDemoProfile === 'function' ? getDemoProfile(role) : (isPro ? { name: 'Milan Jovanović', email: 'milan.demo@majstorodmah.rs' } : { name: 'Ana Petrović', email: 'ana.demo@majstorodmah.rs' });
  const offerCount = jobs.reduce(function (total, job) { return total + (job.offers || []).length; }, 0);
  const selectedCount = jobs.filter(function (job) { return job.acceptedOfferId; }).length;
  const list = jobs.length ? jobs.map(function (job) { return renderJob(job, isPro); }).join('') : '<div class="empty-jobs">Trenutno nema otvorenih poslova u ovoj zoni.</div>';
  dashboard.innerHTML = '<div class="dashboard-header"><div><p class="eyebrow"><span></span> ' + escapeHtml(profile.email) + '</p><h2>Zdravo, ' + escapeHtml(profile.name.split(' ')[0]) + '.</h2><p>' + (isPro ? 'Tvoj demo nalog prikazuje poslove iz blizine. Pošalji jasnu ponudu i Ana može odmah da te izabere.' : 'Tvoj demo nalog prikazuje zahteve, ponude i ceo tok dogovora sa Milanom.') + '</p></div><span class="dashboard-role">' + (isPro ? 'DEMO MAJSTOR' : 'DEMO KLIJENT') + '</span></div>' + (isPro ? renderProPanel() : renderCustomerPanel()) + '<div class="dashboard-stats"><div class="dashboard-stat"><b>' + jobs.length + '</b><span>' + (isPro ? 'otvorena posla' : 'aktivni zahtevi') + '</span></div><div class="dashboard-stat"><b>' + (isPro ? '4,9' : offerCount) + '</b><span>' + (isPro ? 'prosečna ocena' : 'primljene ponude') + '</span></div><div class="dashboard-stat"><b>' + selectedCount + '</b><span>dogovoreni termini</span></div></div><h3>' + (isPro ? 'Poslovi za tvoju delatnost' : 'Tok posla') + '</h3><div class="job-list">' + list + '</div><div class="dashboard-actions"><button class="button" id="dashboardPrimary">' + (isPro ? 'Osveži poslove' : 'Objavi posao') + ' →</button><button class="secondary-button" id="switchRole">Promeni demo nalog</button></div>';
  document.querySelector('#dashboardPrimary').addEventListener('click', function () { if (isPro) refreshWorkflow(role); else { closeAccount(); openModal(); } });
  if (isPro) {
    document.querySelector('#availabilityToggle').addEventListener('change', function (event) { localStorage.setItem('majstorOdmahAvailability', event.target.checked ? 'true' : 'false'); showDashboard(role); });
    document.querySelector('#portfolioUpload').addEventListener('submit', function (event) {
      event.preventDefault();
      const form = event.currentTarget;
      const file = form.querySelector('[name="portfolioImage"]').files[0];
      const title = form.querySelector('[name="portfolioTitle"]').value.trim();
      fileToDataUrl(file).then(function (image) {
        const portfolio = getPortfolio();
        portfolio.unshift({ title: title, detail: 'Novi demo rad', image: image, color: '#3e7058' });
        localStorage.setItem('majstorOdmahPortfolio', JSON.stringify(portfolio.slice(0, 6)));
        showDashboard(role);
      }).catch(function (error) { alert(error.message || 'Fotografija nije dodata.'); });
    });
  } else {
    document.querySelector('#customerPortfolioUpload').addEventListener('submit', function (event) {
      event.preventDefault();
      const form = event.currentTarget;
      const file = form.querySelector('[name="customerImage"]').files[0];
      const title = form.querySelector('[name="customerTitle"]').value.trim();
      fileToDataUrl(file).then(function (image) {
        const portfolio = getCustomerPortfolio();
        portfolio.unshift({ title: title, detail: 'Moj prostor', image: image, color: '#b97755' });
        localStorage.setItem('majstorOdmahCustomerPortfolio', JSON.stringify(portfolio.slice(0, 6)));
        showDashboard(role);
      }).catch(function (error) { alert(error.message || 'Fotografija nije dodata.'); });
    });
  }
  const aiAdvisorForm = document.querySelector('#aiAdvisorForm');
  aiAdvisorForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const result = document.querySelector('#aiAdviceResult'); const button = aiAdvisorForm.querySelector('button'); const files = Array.prototype.slice.call(aiAdvisorForm.querySelector('[name="images"]').files || []).slice(0, 2);
    button.disabled = true; button.textContent = 'AI analizira…'; result.classList.remove('hidden'); result.innerHTML = '<p class="helper-note">Analiziram opis' + (files.length ? ' i fotografiju' : '') + '…</p>';
    Promise.all(files.map(fileToDataUrl)).then(function (images) {
      return fetch('/api/ai-advice', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ description: aiAdvisorForm.querySelector('[name="description"]').value, images: images }) });
    }).then(function (response) { return response.json().then(function (body) { if (!response.ok) throw new Error(body.error || 'AI savetnik trenutno nije dostupan.'); return body; }); }).then(function (advice) {
      result.innerHTML = renderAiAdvice(advice);
      result.querySelector('.ai-create-job').addEventListener('click', function () {
        const materials = (advice.materials || []).map(function (item) { return item.item; }).join(', ');
        closeAccount(); openModal(advice.recommended_trade || '');
        document.querySelector('#jobDescription').value = 'AI predlog: ' + (advice.summary || '') + (materials ? '\nPredloženi materijali: ' + materials + '.' : '');
      });
    }).catch(function (error) { result.innerHTML = '<p class="ai-error">' + escapeHtml(error.message || 'AI savetnik trenutno nije dostupan.') + '</p>'; }).finally(function () { button.disabled = false; button.textContent = 'Analiziraj fotografiju i opis →'; });
  });
  document.querySelectorAll('.offer-form').forEach(function (form) { form.addEventListener('submit', function (event) {
    event.preventDefault(); const jobId = form.dataset.jobId; const amount = form.querySelector('[name="amount"]').value; const eta = form.querySelector('[name="eta"]').value;
    requestWorkflow('/api/jobs/' + jobId + '/offers', { providerName: 'Milan Jovanović', amount: amount, eta: eta, note: 'Verifikovan električar · 4,9★' }).then(function () { addNotification('customer', 'Milan Jovanović je poslao ponudu za tvoj posao.'); refreshWorkflow(role); }).catch(function () { alert('Ponuda nije poslata. Pokušaj ponovo.'); });
  }); });
  document.querySelectorAll('.accept-offer').forEach(function (button) { button.addEventListener('click', function () {
    requestWorkflow('/api/jobs/' + button.dataset.jobId + '/accept', { offerId: button.dataset.offerId }).then(function () { addNotification('pro', 'Ana Petrović je izabrala tvoju ponudu. Dogovorite termin u chatu.'); refreshWorkflow(role); }).catch(function () { alert('Ponuda nije izabrana. Pokušaj ponovo.'); });
  }); });
  document.querySelectorAll('.progress-action').forEach(function (button) { button.addEventListener('click', function () {
    requestWorkflow('/api/jobs/' + button.dataset.jobId + '/progress', { progress: button.dataset.progress }).then(function () { if (isPro) addNotification('customer', 'Milan je ažurirao status radova: ' + button.dataset.progress + '.'); refreshWorkflow(role); }).catch(function () { alert('Status nije promenjen. Pokušaj ponovo.'); });
  }); });
  document.querySelectorAll('.chat-form').forEach(function (form) { form.addEventListener('submit', function (event) {
    event.preventDefault(); const text = form.querySelector('[name="message"]').value;
    requestWorkflow('/api/jobs/' + form.dataset.jobId + '/messages', { text: text, author: isPro ? 'majstor' : 'klijent' }).then(function () { addNotification(isPro ? 'customer' : 'pro', (isPro ? 'Milan' : 'Ana') + ' ti je poslao/la novu poruku.'); refreshWorkflow(role); }).catch(function () { alert('Poruka nije poslata. Pokušaj ponovo.'); });
  }); });
  document.querySelectorAll('.work-photo-form').forEach(function (form) { form.addEventListener('submit', function (event) {
    event.preventDefault(); const file = form.querySelector('[name="workPhoto"]').files[0]; const caption = form.querySelector('[name="caption"]').value;
    fileToDataUrl(file).then(function (image) { return requestWorkflow('/api/jobs/' + form.dataset.jobId + '/photos', { image: image, caption: caption }); }).then(function () { addNotification('customer', 'Milan je dodao novu fotografiju sa radova.'); refreshWorkflow(role); }).catch(function (error) { alert(error.message || 'Fotografija nije poslata.'); });
  }); });
  document.querySelectorAll('.review-form').forEach(function (form) { form.addEventListener('submit', function (event) {
    event.preventDefault(); requestWorkflow('/api/jobs/' + form.dataset.jobId + '/review', { author: isPro ? 'majstor' : 'klijent', rating: form.querySelector('[name="rating"]').value, comment: form.querySelector('[name="comment"]').value }).then(function () { addNotification(isPro ? 'customer' : 'pro', isPro ? 'Milan ti je ostavio ocenu za završeni posao.' : 'Ana ti je ostavila novu ocenu za završeni posao.'); refreshWorkflow(role); }).catch(function () { alert('Ocena nije poslata. Pokušaj ponovo.'); });
  }); });
document.querySelector('#switchRole').addEventListener('click', function () { localStorage.removeItem('majstorOdmahRole'); localStorage.removeItem('majstorOdmahDemoAccount'); document.querySelector('#loginButton').textContent = 'Moj nalog'; accountBackdrop.classList.remove('dashboard-open'); accountWelcome.classList.remove('hidden'); dashboard.classList.add('hidden'); });
}

var workflowDashboard = showDashboard;
showDashboard = function (role) {
  try { workflowDashboard(role === 'pro' ? 'pro' : 'customer'); }
  catch (error) {
    console.error('Prikaz naloga nije uspeo:', error);
    accountWelcome.classList.add('hidden'); dashboard.classList.remove('hidden'); accountBackdrop.classList.add('dashboard-open');
    dashboard.innerHTML = '<section class="dashboard-recovery"><span>✓</span><h2>Nalog je bezbedan.</h2><p>Prikaz se osvežava. Možeš odmah da se vratiš na izbor naloga ili pokušaš ponovo.</p><div><button class="button" id="retryDashboard">Pokušaj ponovo</button><button class="secondary-button" id="resetDashboard">Izaberi nalog</button></div></section>';
    document.querySelector('#retryDashboard').addEventListener('click', function () { workflowDashboard(role === 'pro' ? 'pro' : 'customer'); });
    document.querySelector('#resetDashboard').addEventListener('click', function () { localStorage.removeItem('majstorOdmahRole'); localStorage.removeItem('majstorOdmahDemoAccount'); accountBackdrop.classList.remove('dashboard-open'); accountWelcome.classList.remove('hidden'); dashboard.classList.add('hidden'); });
  }
};
