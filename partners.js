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

function partnerEsc(value) { return String(value || '').replace(/[&<>'"]/g, function (character) { return ({ '&': '&amp;', '<': '&gt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]; }); }
fetch('/api/partners').then(function (response) { return response.json().then(function (body) { if (!response.ok) throw new Error(); return body; }); }).then(function (partners) { const grid = document.querySelector('#livePartnerGrid'); grid.innerHTML = partners.length ? partners.map(function (partner) { const link = String(partner.website || '').trim(); const href = /^https?:\/\//i.test(link) ? link : ''; return '<article class="live-partner-card' + (partner.featured ? ' featured' : '') + '">' + (partner.featured ? '<span class="partner-label">ISTAKNUTO</span>' : '<span class="partner-label">PARTNER</span>') + '<small>' + partnerEsc(partner.category) + ' · ' + partnerEsc(partner.city) + '</small><h3>' + partnerEsc(partner.company) + '</h3><p>' + partnerEsc(partner.description) + '</p>' + (href ? '<a href="' + partnerEsc(href) + '" target="_blank" rel="noopener">Pogledaj ponudu →</a>' : '<a href="#prijava-partnera">Kontaktiraj partnera →</a>') + '</article>'; }).join('') : '<p class="live-partner-empty">Katalog je spreman za prve potvrđene partnere. Prijavi firmu ispod.</p>'; }).catch(function () { document.querySelector('#livePartnerGrid').innerHTML = '<p class="live-partner-empty">Katalog trenutno nije dostupan. Pokušaj ponovo uskoro.</p>'; });

fetch('/api/catalog').then(function (response) { return response.json().then(function (body) { if (!response.ok) throw new Error(); return body; }); }).then(function (items) { const grid = document.querySelector('#catalogOfferGrid'); grid.innerHTML = items.length ? items.map(function (item) { const href = /^https?:\/\//i.test(String(item.linkUrl || '').trim()) ? item.linkUrl : ''; const image = /^https?:\/\//i.test(String(item.imageUrl || '').trim()) ? '<img src="' + partnerEsc(item.imageUrl) + '" alt="' + partnerEsc(item.title) + '" loading="lazy" />' : '<div class="catalog-image-placeholder">▦</div>'; return '<article class="catalog-offer-card">' + image + '<div><span>' + partnerEsc(item.priceLabel || 'Partnerska ponuda') + '</span><h3>' + partnerEsc(item.title) + '</h3><p>' + partnerEsc(item.description || 'Detalji i dostupnost kod partnera.') + '</p>' + (href ? '<a href="' + partnerEsc(href) + '" target="_blank" rel="noopener">Pogledaj ponudu →</a>' : '<a href="#prijava-partnera">Zatraži informacije →</a>') + '</div></article>'; }).join('') : '<p class="live-partner-empty">Prve artikle i akcije partnera dodajemo uskoro.</p>'; }).catch(function () { document.querySelector('#catalogOfferGrid').innerHTML = '<p class="live-partner-empty">Katalog ponuda trenutno nije dostupan.</p>'; });
