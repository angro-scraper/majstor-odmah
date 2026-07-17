const materialSearch = document.querySelector('#materialSearch');
const materialCards = Array.from(document.querySelectorAll('.partner-grid article'));
const materialSearchNote = document.querySelector('#materialSearchNote');

function filterMaterials(value) {
  const query = String(value || '').trim().toLocaleLowerCase('sr');
  let visible = 0;
  materialCards.forEach(function (card) { const matches = !query || card.dataset.search.toLocaleLowerCase('sr').includes(query); card.hidden = !matches; if (matches) visible += 1; });
  materialSearchNote.textContent = query ? (visible ? 'Pronađeno kategorija: ' + visible : 'Nema podudaranja — probaj npr. „pločice”, „alat” ili „dostava”.') : '';
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
