const categories = [
  { name: 'Vodoinstalater', icon: '🔧', count: '42 dostupna' },
  { name: 'Električar', icon: '⚡', count: '31 dostupan' },
  { name: 'Keramičar', icon: '▦', count: '18 dostupno' },
  { name: 'Moler', icon: '◒', count: '26 dostupno' },
  { name: 'Bravar', icon: '🔑', count: '11 dostupno' },
  { name: 'Stolar', icon: '▤', count: '23 dostupna' },
  { name: 'Klimatizer', icon: '❄', count: '14 dostupno' },
  { name: 'Gipsar', icon: '▱', count: '17 dostupno' },
  { name: 'Parketar', icon: '▥', count: '12 dostupno' },
  { name: 'Podopolagač', icon: '▦', count: '9 dostupno' },
  { name: 'Fasader', icon: '▤', count: '16 dostupno' },
  { name: 'Krovopokrivač', icon: '⌂', count: '8 dostupno' },
  { name: 'Limar', icon: '⌁', count: '10 dostupno' },
  { name: 'Zidar', icon: '▰', count: '21 dostupno' },
  { name: 'Armirač', icon: '╬', count: '7 dostupno' },
  { name: 'Tapetar', icon: '▧', count: '6 dostupno' },
  { name: 'Staklar', icon: '◇', count: '8 dostupno' },
  { name: 'Roletnar', icon: '▤', count: '11 dostupno' },
  { name: 'Dimnjačar', icon: '♨', count: '5 dostupno' },
  { name: 'Serviser bele tehnike', icon: '◉', count: '18 dostupno' },
  { name: 'Serviser računara', icon: '⌘', count: '15 dostupno' },
  { name: 'Video nadzor', icon: '◌', count: '10 dostupno' },
  { name: 'Solarni sistemi', icon: '☀', count: '6 dostupno' },
  { name: 'Baštovan', icon: '♣', count: '19 dostupno' },
  { name: 'Pejzažni arhitekta', icon: '🌿', count: '7 dostupno' },
  { name: 'Čistač / održavanje', icon: '✦', count: '28 dostupno' },
  { name: 'Odgušenje kanalizacije', icon: '◉', count: '12 dostupno' },
  { name: 'Septičke jame', icon: '◌', count: '5 dostupno' },
  { name: 'Pest kontrola', icon: '◈', count: '9 dostupno' },
  { name: 'Protivpožarna zaštita', icon: '🧯', count: '6 dostupno' },
  { name: 'Alarmni sistemi', icon: '🔔', count: '11 dostupno' },
  { name: 'Mreže i internet', icon: '⌁', count: '13 dostupno' },
  { name: 'Antene i sateliti', icon: '◒', count: '8 dostupno' },
  { name: 'Kućni aparati', icon: '▣', count: '18 dostupno' },
  { name: 'Servis bojlera', icon: '♨', count: '16 dostupno' },
  { name: 'Grejanje i radijatori', icon: '♨', count: '20 dostupno' },
  { name: 'Toplotne pumpe', icon: '❄', count: '7 dostupno' },
  { name: 'Lift servis', icon: '↕', count: '4 dostupno' },
  { name: 'Selidbe', icon: '▰', count: '25 dostupno' },
  { name: 'Montaža nameštaja', icon: '▤', count: '22 dostupno' },
  { name: 'PVC i ALU stolarija', icon: '▯', count: '15 dostupno' },
  { name: 'Zavarivač', icon: '⚙', count: '10 dostupno' },
  { name: 'Bunar i pumpe', icon: '◍', count: '6 dostupno' },
  { name: 'Izolater', icon: '▨', count: '14 dostupno' },
  { name: 'Majstor za sitne popravke', icon: '🛠', count: '34 dostupno' }
];

const demoAccounts = {
  customer: { name: 'Ana Petrović', label: 'demo klijent', email: 'ana.demo@majstorodmah.rs' },
  pro: { name: 'Milan Jovanović', label: 'demo majstor', email: 'milan.demo@majstorodmah.rs' }
};
function getDemoProfile(role) {
  const fallback = demoAccounts[role] || demoAccounts.customer;
  try { return JSON.parse(localStorage.getItem('majstorOdmahDemoAccount') || 'null') || fallback; } catch (error) { return fallback; }
}
function setDemoProfile(role) {
  const profile = demoAccounts[role] || demoAccounts.customer;
  localStorage.setItem('majstorOdmahDemoAccount', JSON.stringify(profile));
  document.querySelector('#loginButton').textContent = profile.name.split(' ')[0] + ' · demo';
}

function saveJobToServer(job) {
  if (window.location.protocol === 'file:') return;
  fetch('/api/jobs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(job)
  }).then(function (response) {
    if (!response.ok) throw new Error('Server nije sačuvao zahtev.');
    return response.json();
  }).then(function (savedJob) {
    const localJobs = JSON.parse(localStorage.getItem('majstorOdmahJobs') || '[]');
    const matchingIndex = localJobs.findIndex(function (item) { return item.clientId === job.clientId; });
    if (matchingIndex >= 0) { localJobs[matchingIndex] = savedJob; localStorage.setItem('majstorOdmahJobs', JSON.stringify(localJobs)); }
  }).catch(function () {
    console.info('Zahtev je bezbedno ostao lokalno sačuvan.');
  });
}

function syncJobsFromServer(role) {
  if (window.location.protocol === 'file:') return;
  fetch('/api/jobs').then(function (response) {
    if (!response.ok) throw new Error('Server nije dostupan.');
    return response.json();
  }).then(function (serverJobs) {
    if (!serverJobs.length) return;
    localStorage.setItem('majstorOdmahJobs', JSON.stringify(serverJobs));
    if (localStorage.getItem('majstorOdmahRole') === role) showDashboard(role);
  }).catch(function () {
    console.info('Prikazujemo lokalno sačuvane zahteve.');
  });
}

const pros = [
  { name: 'Milan Jovanović', trade: 'Električar · Detelinara', rating: '4,9 (86)', color: '#d8eae1', emoji: '⚡', label: 'Dostupan danas' },
  { name: 'Nikola Petrović', trade: 'Vodoinstalater · Liman', rating: '5,0 (64)', color: '#f8ded1', emoji: '🔧', label: 'Odgovara za 8 min' },
  { name: 'Marko Ilić', trade: 'Keramičar · Grbavica', rating: '4,8 (51)', color: '#e2e3f3', emoji: '▦', label: 'Dostupan sutra' }
];

const rankedPros = [
  { name: 'Nikola Petrović', category: 'Vodoinstalater', area: 'Liman', rating: 5.0, jobs: 118, score: 98, reliability: 99 },
  { name: 'Milan Jovanović', category: 'Električar', area: 'Detelinara', rating: 4.9, jobs: 142, score: 97, reliability: 98 },
  { name: 'Jelena Marković', category: 'Električar', area: 'Centar', rating: 4.8, jobs: 91, score: 92, reliability: 97 },
  { name: 'Marko Ilić', category: 'Keramičar', area: 'Grbavica', rating: 4.8, jobs: 76, score: 91, reliability: 96 },
  { name: 'Stefan Savić', category: 'Vodoinstalater', area: 'Novo naselje', rating: 4.8, jobs: 69, score: 90, reliability: 95 },
  { name: 'Ivana Ristić', category: 'Moler', area: 'Liman', rating: 4.9, jobs: 82, score: 90, reliability: 97 },
  { name: 'Luka Pavlović', category: 'Stolar', area: 'Veternik', rating: 4.9, jobs: 57, score: 88, reliability: 96 },
  { name: 'Vuk Kovačević', category: 'Bravar', area: 'Sajmište', rating: 4.7, jobs: 88, score: 87, reliability: 93 },
  { name: 'Tamara Babić', category: 'Moler', area: 'Telep', rating: 4.7, jobs: 54, score: 85, reliability: 94 }
];

const grid = document.querySelector('#categoryGrid');
const selector = document.querySelector('#jobCategory');
categories.forEach(category => {
  grid.insertAdjacentHTML('beforeend', `<button class="category" data-category="${category.name}"><span class="category-icon">${category.icon}</span><b>${category.name}</b><small>${category.count}</small></button>`);
  selector.insertAdjacentHTML('beforeend', `<option value="${category.name}">${category.name}</option>`);
});

document.querySelector('#prosGrid').innerHTML = pros.map(pro => `
  <article class="pro-card">
    <span class="badge">✓ ${pro.label}</span>
    <div class="pro-header"><span class="pro-avatar" style="background:${pro.color}">${pro.emoji}</span><div><h3>${pro.name}</h3><p>${pro.trade}</p></div></div>
    <div class="pro-meta"><span class="star">★ ${pro.rating}</span><button class="contact-pro" data-name="${pro.name}">Pošalji zahtev →</button></div>
  </article>`).join('');

function rankingEntry(pro, index) {
  return `<li class="ranking-entry"><span class="ranking-place">${index + 1}</span><div><b>${pro.name}</b><small>${pro.category} · ${pro.area} · ${pro.jobs} radova</small></div><div class="ranking-score"><b><span class="ranking-star">★</span> ${pro.rating.toFixed(1).replace('.', ',')}</b><small>${pro.score}/100 · pouzdanost ${pro.reliability}%</small></div></li>`;
}
function renderRanking(category) {
  const inCategory = rankedPros.filter(pro => pro.category === category).sort((a, b) => b.score - a.score).slice(0, 3);
  document.querySelector('#categoryRankingList').innerHTML = inCategory.length ? inCategory.map(rankingEntry).join('') : '<li class="ranking-entry"><div></div><div><b>Uskoro</b><small>Prikupljamo prve ocene za ovu kategoriju.</small></div></li>';
  document.querySelectorAll('.ranking-tab').forEach(tab => tab.classList.toggle('active', tab.dataset.category === category));
}
const rankingCategories = Array.from(new Set(rankedPros.map(pro => pro.category)));
document.querySelector('#rankingTabs').innerHTML = rankingCategories.map(category => `<button class="ranking-tab" data-category="${category}">${category}</button>`).join('');
document.querySelector('#overallRankingList').innerHTML = rankedPros.slice().sort((a, b) => b.score - a.score).slice(0, 5).map(rankingEntry).join('');
document.querySelectorAll('.ranking-tab').forEach(tab => tab.addEventListener('click', () => renderRanking(tab.dataset.category)));
renderRanking('Električar');

const backdrop = document.querySelector('#modalBackdrop');
const openModal = (category = '') => {
  selector.value = category;
  backdrop.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
};
const closeModal = () => { backdrop.classList.add('hidden'); document.body.style.overflow = ''; };

['#openJobModal', '#openJobModal2', '#browseButton', '#showPros'].forEach(id => document.querySelector(id).addEventListener('click', () => openModal()));
document.querySelector('#closeModal').addEventListener('click', closeModal);
backdrop.addEventListener('click', event => { if (event.target === backdrop) closeModal(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });
document.querySelectorAll('.category').forEach(button => button.addEventListener('click', () => openModal(button.dataset.category)));
document.querySelectorAll('.contact-pro').forEach(button => button.addEventListener('click', () => { openModal(); document.querySelector('#jobDescription').value = `Želim da pošaljem zahtev majstoru ${button.dataset.name}.`; }));

function imageFilesToDataUrls(files) {
  const selected = Array.prototype.slice.call(files || []).slice(0, 3);
  if (selected.some(function (file) { return file.size > 500000; })) return Promise.reject(new Error('Svaka fotografija mora biti manja od 500 KB.'));
  return Promise.all(selected.map(function (file) { return new Promise(function (resolve, reject) { const reader = new FileReader(); reader.onload = function () { resolve(reader.result); }; reader.onerror = reject; reader.readAsDataURL(file); }); }));
}

document.querySelector('#jobForm').addEventListener('submit', function (event) {
  event.preventDefault();
  imageFilesToDataUrls(document.querySelector('#jobImages').files).then(function (images) {
    const job = { category: selector.value, location: document.querySelector('#jobLocation').value, description: document.querySelector('#jobDescription').value, images: images, createdAt: new Date().toISOString(), clientId: 'job-' + Date.now() };
    const saved = JSON.parse(localStorage.getItem('majstorOdmahJobs') || '[]');
    saved.push(job);
    localStorage.setItem('majstorOdmahJobs', JSON.stringify(saved));
    saveJobToServer(job);
    closeModal();
    document.querySelector('#jobForm').reset();
    const toast = document.querySelector('#toast');
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 4500);
  }).catch(function (error) { alert(error.message); });
});

const accountBackdrop = document.querySelector('#accountBackdrop');
const accountWelcome = document.querySelector('#accountWelcome');
const dashboard = document.querySelector('#dashboard');
const openAccount = () => {
  accountBackdrop.classList.remove('hidden');
  accountBackdrop.classList.remove('dashboard-open');
  document.body.style.overflow = 'hidden';
  const role = localStorage.getItem('majstorOdmahRole');
  if (role) { setDemoProfile(role); showDashboard(role); syncJobsFromServer(role); }
  else { accountWelcome.classList.remove('hidden'); dashboard.classList.add('hidden'); }
};
const closeAccount = () => { accountBackdrop.classList.add('hidden'); accountBackdrop.classList.remove('dashboard-open'); document.body.style.overflow = ''; };
const dateLabel = date => new Intl.DateTimeFormat('sr-RS', { day: 'numeric', month: 'short' }).format(new Date(date));

function showDashboard(role) {
  accountWelcome.classList.add('hidden');
  dashboard.classList.remove('hidden');
  const jobs = JSON.parse(localStorage.getItem('majstorOdmahJobs') || '[]');
  const isPro = role === 'pro';
  const exampleJobs = isPro ? [
    { category: 'Električar', location: 'Detelinara, Novi Sad', description: 'Zamena osigurača i provera instalacije.', createdAt: new Date().toISOString(), status: 'Novo' },
    { category: 'Vodoinstalater', location: 'Liman 3, Novi Sad', description: 'Curi voda ispod sudopere.', createdAt: new Date(Date.now() - 86400000).toISOString(), status: 'Odgovoreno' }
  ] : jobs;
  const list = exampleJobs.length ? exampleJobs.map((job, i) => `<article class="dashboard-job"><div><b>${job.category} · ${job.location}</b><p>${job.description}</p><p>${dateLabel(job.createdAt)}</p></div><span class="job-status ${i === 1 ? 'accepted' : ''}">${job.status || 'Traži majstora'}</span></article>`).join('') : `<div class="empty-jobs">Još nemaš poslatih zahteva.<br /><br /><button class="button" id="dashboardNewJob">Objavi prvi posao →</button></div>`;
  dashboard.innerHTML = `
    <div class="dashboard-header"><div><p class="eyebrow"><span></span> Moj nalog</p><h2>${isPro ? 'Poslovi u blizini' : 'Moji zahtevi'}</h2><p>${isPro ? 'Dobro jutro, Milane. Ima novih poslova za tebe.' : 'Sve što se dešava sa tvojim poslovima je ovde.'}</p></div><span class="dashboard-role">${isPro ? 'MAJSTOR' : 'KLIJENT'}</span></div>
    <div class="dashboard-stats"><div class="dashboard-stat"><b>${isPro ? '2' : jobs.length}</b><span>${isPro ? 'nova posla danas' : 'poslati zahtevi'}</span></div><div class="dashboard-stat"><b>${isPro ? '4,9' : '8'}</b><span>${isPro ? 'prosečna ocena' : 'obaveštenih majstora'}</span></div><div class="dashboard-stat"><b>${isPro ? '86' : '—'}</b><span>${isPro ? 'završenih poslova' : 'aktivnih radova'}</span></div></div>
    <h3>${isPro ? 'Preporučeni poslovi' : 'Poslednji zahtevi'}</h3><div class="job-list">${list}</div>
    <div class="dashboard-actions"><button class="button" id="dashboardPrimary">${isPro ? 'Uredi profil' : 'Objavi posao'} →</button><button class="secondary-button" id="switchRole">Promeni ulogu</button></div>`;
  document.querySelector('#dashboardPrimary').addEventListener('click', () => {
    if (isPro) alert('Sledeći ekran: profil majstora sa fotografijama radova, zonom rada i kalendarom dostupnosti.');
    else { closeAccount(); openModal(); }
  });
  const newJobButton = document.querySelector('#dashboardNewJob');
  if (newJobButton) newJobButton.addEventListener('click', () => { closeAccount(); openModal(); });
  document.querySelector('#switchRole').addEventListener('click', () => { localStorage.removeItem('majstorOdmahRole'); accountWelcome.classList.remove('hidden'); dashboard.classList.add('hidden'); });
}

document.querySelector('#loginButton').addEventListener('click', openAccount);
document.querySelector('#registerButton').addEventListener('click', openAccount);
document.querySelector('#closeAccount').addEventListener('click', closeAccount);
accountBackdrop.addEventListener('click', event => { if (event.target === accountBackdrop) closeAccount(); });
document.querySelectorAll('.role-card').forEach(button => button.addEventListener('click', () => { localStorage.setItem('majstorOdmahRole', button.dataset.role); setDemoProfile(button.dataset.role); showDashboard(button.dataset.role); syncJobsFromServer(button.dataset.role); }));

const supportBackdrop = document.querySelector('#supportBackdrop');
document.querySelector('#supportButton').addEventListener('click', () => { supportBackdrop.classList.remove('hidden'); document.body.style.overflow = 'hidden'; });
document.querySelector('#closeSupport').addEventListener('click', () => { supportBackdrop.classList.add('hidden'); document.body.style.overflow = ''; });
supportBackdrop.addEventListener('click', event => { if (event.target === supportBackdrop) { supportBackdrop.classList.add('hidden'); document.body.style.overflow = ''; } });
document.querySelector('#supportForm').addEventListener('submit', event => {
  event.preventDefault();
  fetch('/api/support', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subject: document.querySelector('#supportSubject').value, message: document.querySelector('#supportMessage').value }) })
    .then(response => { if (!response.ok) throw new Error(); return response.json(); })
    .then(() => { document.querySelector('#supportForm').reset(); supportBackdrop.classList.add('hidden'); document.body.style.overflow = ''; alert('Zahtev je primljen. Podrška će ti odgovoriti kroz aplikaciju.'); })
    .catch(() => alert('Zahtev nije poslat. Pokušaj ponovo.'));
});
