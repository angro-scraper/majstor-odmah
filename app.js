const categories = [
  { name: 'Vodoinstalater', icon: '🔧', count: '42 dostupna' },
  { name: 'Električar', icon: '⚡', count: '31 dostupan' },
  { name: 'Keramičar', icon: '▦', count: '18 dostupno' },
  { name: 'Moler', icon: '◒', count: '26 dostupno' },
  { name: 'Bravar', icon: '🔑', count: '11 dostupno' },
  { name: 'Stolar', icon: '▤', count: '23 dostupna' }
];

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
  document.body.style.overflow = 'hidden';
  const role = localStorage.getItem('majstorOdmahRole');
  if (role) { showDashboard(role); syncJobsFromServer(role); }
  else { accountWelcome.classList.remove('hidden'); dashboard.classList.add('hidden'); }
};
const closeAccount = () => { accountBackdrop.classList.add('hidden'); document.body.style.overflow = ''; };
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
document.querySelectorAll('.role-card').forEach(button => button.addEventListener('click', () => { localStorage.setItem('majstorOdmahRole', button.dataset.role); showDashboard(button.dataset.role); }));

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
