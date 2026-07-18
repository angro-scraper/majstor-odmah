const materialSearch = document.querySelector('#materialSearch');
const materialCards = Array.from(document.querySelectorAll('.partner-grid article'));
const materialSearchNote = document.querySelector('#materialSearchNote');

function normalizeSearch(value) {
  return String(value || '').toLocaleLowerCase('sr').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
}

function wordStem(value) {
  return String(value || '').replace(/(ovima|evima|anje|enje|acija|acije|aciju|ama|ima|ski|ska|sko|nih|nim|nog|na|ni|ne|no|om|em|og|oj|e|a|i|u)$/i, '');
}

function wordsMatch(first, second) {
  const a = wordStem(first); const b = wordStem(second);
  return a === b || (a.length >= 5 && b.length >= 5 && (a.startsWith(b) || b.startsWith(a)));
}

function filterMaterials(value) {
  const terms = normalizeSearch(value).split(' ').filter(function (term) { return term.length > 1; });
  const requiredMatches = terms.length < 3 ? 1 : Math.ceil(terms.length * 0.6);
  let visible = 0;
  materialCards.forEach(function (card) {
    const haystack = normalizeSearch(card.dataset.search).split(' ');
    const score = terms.reduce(function (total, term) { return total + (haystack.some(function (word) { return wordsMatch(term, word); }) ? 1 : 0); }, 0);
    const matches = !terms.length || score >= requiredMatches;
    card.hidden = !matches;
    if (matches) visible += 1;
  });
  materialSearchNote.textContent = terms.length ? (visible ? 'Pronađeno kategorija: ' + visible + '. Prikazujemo najrelevantnije rezultate.' : 'Nema dovoljno bliskog podudaranja — probaj kraće, npr. „pločice”, „alat” ili „dostava”.') : '';
}

materialSearch.addEventListener('input', function (event) { filterMaterials(event.target.value); });
const presetSearch = new URLSearchParams(window.location.search).get('search');
if (presetSearch) { materialSearch.value = presetSearch; filterMaterials(presetSearch); }

document.querySelector('#partnerLeadForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const form = event.currentTarget; const status = document.querySelector('#partnerFormStatus'); const data = new FormData(form);
  const company = String(data.get('company') || '').trim();
  const details = ['Firma: ' + company, 'Kategorija: ' + data.get('category'), 'Grad: ' + data.get('city'), 'Kontakt: ' + data.get('contact'), 'E-mail: ' + data.get('email'), 'Sajt/Instagram: ' + (data.get('website') || '—'), '', 'Ponuda:', data.get('message')].join('\n');
  status.classList.remove('error'); status.textContent = 'Šaljem prijavu…';
  fetch('/api/support', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subject: 'Partner prijava — ' + company, message: details }) }).then(function (response) { return response.json().then(function (body) { if (!response.ok) throw new Error(body.error || 'Prijava trenutno nije poslata.'); return body; }); }).then(function () { form.reset(); status.textContent = 'Prijava je poslata. Javljamo se nakon administrativne provere.'; }).catch(function (error) { status.classList.add('error'); status.textContent = error.message; });
});

function partnerEsc(value) { return String(value || '').replace(/[&<>'"]/g, function (character) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]; }); }
function savedAuth() { try { return { session: JSON.parse(localStorage.getItem('majstorAuthSession') || 'null'), profile: JSON.parse(localStorage.getItem('majstorAuthProfile') || 'null') }; } catch (error) { return { session: null, profile: null }; } }
function matchesCategory(partner, category) { if (!category) return true; const wanted = normalizeSearch(category).split(' ').filter(function (word) { return word.length > 2; }); const available = normalizeSearch(partner.category).split(' '); return wanted.some(function (term) { return available.some(function (word) { return wordsMatch(term, word); }); }); }
let activePartners = []; let selectedPartnerCategory = '';

function renderPartnerRankings() {
  const eligible = activePartners.filter(function (partner) { return partner.rankingEligible; }); const overall = document.querySelector('#overallPartnerRanking'); const categorySelect = document.querySelector('#partnerRankingCategory'); const categoryList = document.querySelector('#categoryPartnerRanking');
  overall.innerHTML = eligible.length ? eligible.slice(0, 5).map(function (partner, index) { return '<li><b>' + (index + 1) + '.</b><span>' + partnerEsc(partner.company) + '<small>' + partnerEsc(partner.category) + ' · ★ ' + partner.rating.toFixed(1).replace('.', ',') + ' (' + partner.reviewCount + ')</small></span></li>'; }).join('') : '<li class="ranking-empty">Rang-lista se prikazuje nakon prve 3 potvrđene ocene.</li>';
  const categories = Array.from(new Set(eligible.map(function (partner) { return partner.category; }))).sort(function (a, b) { return a.localeCompare(b, 'sr'); }); categorySelect.innerHTML = categories.length ? categories.map(function (category) { return '<option value="' + partnerEsc(category) + '">' + partnerEsc(category) + '</option>'; }).join('') : '<option>Nema rangiranih kategorija</option>';
  function renderCategory() { const items = eligible.filter(function (partner) { return partner.category === categorySelect.value; }).slice(0, 5); categoryList.innerHTML = items.length ? items.map(function (partner, index) { return '<li><b>' + (index + 1) + '.</b><span>' + partnerEsc(partner.company) + '<small>★ ' + partner.rating.toFixed(1).replace('.', ',') + ' · ' + partner.reviewCount + ' ocene</small></span></li>'; }).join('') : '<li class="ranking-empty">Još nema dovoljno ocena za ovu kategoriju.</li>'; }
  categorySelect.disabled = !categories.length; categorySelect.onchange = renderCategory; renderCategory();
}

function renderPartnerLeader() { const leader = activePartners.find(function (partner) { return partner.rankingEligible; }); const box = document.querySelector('#partnerLeader'); if (!leader) { box.classList.add('hidden'); return; } const link = /^https?:\/\//i.test(String(leader.website || '').trim()) ? leader.website : '#aktivni-partneri'; box.classList.remove('hidden'); box.innerHTML = '<span>★ Partner sa najboljom ocenom</span><div><small>' + partnerEsc(leader.category) + ' · ' + partnerEsc(leader.city) + '</small><h2>' + partnerEsc(leader.company) + '</h2><p>★ ' + leader.rating.toFixed(1).replace('.', ',') + ' na osnovu ' + leader.reviewCount + ' ocena prijavljenih klijenata.</p></div><a href="' + partnerEsc(link) + '"' + (link !== '#aktivni-partneri' ? ' target="_blank" rel="noopener"' : '') + '>Pogledaj partnera →</a>'; }

function renderLivePartners() {
  const grid = document.querySelector('#livePartnerGrid'); const current = activePartners.filter(function (partner) { return matchesCategory(partner, selectedPartnerCategory); }); const note = document.querySelector('#activePartnerNote'); const auth = savedAuth(); note.textContent = selectedPartnerCategory ? 'Prikaz kategorije: ' + selectedPartnerCategory : 'Jasno označeni partneri platforme';
  grid.innerHTML = current.length ? current.map(function (partner) { const link = String(partner.website || '').trim(); const href = /^https?:\/\//i.test(link) ? link : ''; const rating = partner.reviewCount ? '★ ' + partner.rating.toFixed(1).replace('.', ',') + ' · ' + partner.reviewCount + ' ocena' : 'Još nema ocena'; const canReview = auth.session && auth.profile && auth.profile.role === 'customer'; const action = canReview ? '<button class="partner-rate-button" data-partner-id="' + partnerEsc(partner.id) + '">Oceni partnera</button><form class="partner-review-form hidden" data-partner-id="' + partnerEsc(partner.id) + '"><select name="rating" aria-label="Ocena"><option value="5">5 ★ Odlično</option><option value="4">4 ★ Vrlo dobro</option><option value="3">3 ★ Dobro</option><option value="2">2 ★ Slabo</option><option value="1">1 ★ Loše</option></select><textarea name="comment" maxlength="500" rows="2" placeholder="Kratak komentar (opciono)"></textarea><button type="submit">Sačuvaj ocenu</button></form>' : '<a class="partner-login-link" href="index.html">Prijavi se da oceniš</a>'; return '<article class="live-partner-card">' + (partner.rankingEligible ? '<span class="partner-label">RANGIRAN</span>' : '<span class="partner-label">PARTNER</span>') + '<small>' + partnerEsc(partner.category) + ' · ' + partnerEsc(partner.city) + '</small><h3>' + partnerEsc(partner.company) + '</h3><p>' + partnerEsc(partner.description) + '</p><b class="partner-rating">' + rating + '</b>' + (href ? '<a href="' + partnerEsc(href) + '" target="_blank" rel="noopener">Pogledaj ponudu →</a>' : '<a href="#prijava-partnera">Kontaktiraj partnera →</a>') + action + '</article>'; }).join('') : '<p class="live-partner-empty">Još nema aktivnog partnera u ovoj kategoriji. Pogledaj drugu kategoriju ili prijavi firmu ispod.</p>';
  grid.querySelectorAll('.partner-rate-button').forEach(function (button) { button.addEventListener('click', function () { grid.querySelector('.partner-review-form[data-partner-id="' + button.dataset.partnerId + '"]').classList.toggle('hidden'); }); });
  grid.querySelectorAll('.partner-review-form').forEach(function (form) { form.addEventListener('submit', async function (event) { event.preventDefault(); const authState = savedAuth(); const formData = new FormData(form); try { const response = await fetch('/api/partners/' + encodeURIComponent(form.dataset.partnerId) + '/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + authState.session.access_token }, body: JSON.stringify({ rating: Number(formData.get('rating')), comment: formData.get('comment') }) }); const body = await response.json(); if (!response.ok) throw new Error(body.error || 'Ocena nije sačuvana.'); form.innerHTML = '<p>' + partnerEsc(body.message) + '</p>'; loadPartners(); } catch (error) { form.querySelector('button').textContent = error.message; } }); });
}
function selectPartnerCategory(category) { selectedPartnerCategory = category; renderLivePartners(); document.querySelector('#aktivni-partneri').scrollIntoView({ behavior: 'smooth', block: 'start' }); }
document.querySelectorAll('.partner-grid article').forEach(function (card) { const openCategory = function () { selectPartnerCategory(card.dataset.category); }; card.addEventListener('click', openCategory); card.addEventListener('keydown', function (event) { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openCategory(); } }); });
function loadPartners() { return fetch('/api/partners').then(function (response) { return response.json().then(function (body) { if (!response.ok) throw new Error(); return body; }); }).then(function (partners) { activePartners = partners; renderPartnerLeader(); renderLivePartners(); renderPartnerRankings(); }).catch(function () { document.querySelector('#livePartnerGrid').innerHTML = '<p class="live-partner-empty">Katalog trenutno nije dostupan. Pokušaj ponovo uskoro.</p>'; }); }
loadPartners();

fetch('/api/catalog').then(function (response) { return response.json().then(function (body) { if (!response.ok) throw new Error(); return body; }); }).then(function (items) { const grid = document.querySelector('#catalogOfferGrid'); grid.innerHTML = items.length ? items.map(function (item) { const href = /^https?:\/\//i.test(String(item.linkUrl || '').trim()) ? item.linkUrl : ''; const image = /^https?:\/\//i.test(String(item.imageUrl || '').trim()) ? '<img src="' + partnerEsc(item.imageUrl) + '" alt="' + partnerEsc(item.title) + '" loading="lazy" />' : '<div class="catalog-image-placeholder">▦</div>'; return '<article class="catalog-offer-card">' + image + '<div><span>' + partnerEsc(item.priceLabel || 'Partnerska ponuda') + '</span><h3>' + partnerEsc(item.title) + '</h3><p>' + partnerEsc(item.description || 'Detalji i dostupnost kod partnera.') + '</p>' + (href ? '<a href="' + partnerEsc(href) + '" target="_blank" rel="noopener">Pogledaj ponudu →</a>' : '<a href="#prijava-partnera">Zatraži informacije →</a>') + '</div></article>'; }).join('') : '<p class="live-partner-empty">Prve artikle i akcije partnera dodajemo uskoro.</p>'; }).catch(function () { document.querySelector('#catalogOfferGrid').innerHTML = '<p class="live-partner-empty">Katalog ponuda trenutno nije dostupan.</p>'; });
