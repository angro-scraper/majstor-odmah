const materialSearch = document.querySelector('#materialSearch');
const materialCards = Array.from(document.querySelectorAll('.partner-grid article'));
const materialSearchNote = document.querySelector('#materialSearchNote');
materialSearch.addEventListener('input', function (event) {
  const query = event.target.value.trim().toLocaleLowerCase('sr');
  let visible = 0;
  materialCards.forEach(function (card) { const matches = !query || card.dataset.search.toLocaleLowerCase('sr').includes(query); card.hidden = !matches; if (matches) visible += 1; });
  materialSearchNote.textContent = query ? (visible ? 'Pronađeno kategorija: ' + visible : 'Nema podudaranja — probaj npr. „pločice”, „alat” ili „dostava”.') : '';
});
