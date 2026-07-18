var gpsMaps = {};
var defaultGpsPoint = { lat: 45.2671, lng: 19.8335, label: 'Novi Sad' };

function gpsStorageKey(role) { return role === 'pro' ? 'majstorOdmahProGps' : 'majstorOdmahCustomerGps'; }
function readGpsPoint(role) { try { return Object.assign({}, defaultGpsPoint, JSON.parse(localStorage.getItem(gpsStorageKey(role)) || '{}')); } catch (error) { return Object.assign({}, defaultGpsPoint); } }
function writeGpsPoint(role, point) { localStorage.setItem(gpsStorageKey(role), JSON.stringify(point)); }
function gpsMapMarkup(role) {
  var isPro = role === 'pro';
  if (isPro) return '<section class="gps-location-card pro gps-workspace"><div class="gps-map-column"><div class="gps-location-head"><div><b>Tvoja zona rada</b><small id="gpsLabel-pro">GPS još nije podešen</small></div><button type="button" class="gps-use-location" data-gps-role="pro">⌖ Koristi moj GPS</button></div><div class="gps-map" id="gpsMap-pro"></div><div class="gps-radius"><label>Radijus dolaska <input id="gpsRadius" type="range" min="3" max="50" value="20" /></label><b id="gpsRadiusValue">20 km</b></div></div><aside class="gps-workspace-side"><span class="gps-side-kicker">PREGLED DOSTUPNOSTI</span><h4>Zona koja radi za tebe.</h4><p>GPS tačka i radijus određuju koje zahteve vidiš prve.</p><ul><li><b>5</b><span>naselja trenutno u zoni</span></li><li><b>~8 min</b><span>prosečan odgovor</span></li><li><b>98%</b><span>pouzdanost profila</span></li></ul><div class="gps-side-note">✓ Pomeranjem markera odmah menjaš centar zone.</div></aside></section>';
  return '<section class="gps-location-card customer"><div class="gps-location-head"><div><b>Tačna lokacija projekta</b><small id="gpsLabel-customer">GPS još nije podešen</small></div><button type="button" class="gps-use-location" data-gps-role="customer">⌖ Koristi moj GPS</button></div><div class="gps-map" id="gpsMap-customer"></div><p class="gps-help">Klikni na mapu da postaviš tačnu adresu. Tačka se koristi za brže pronalaženje majstora u blizini.</p></section>';
}
function gpsLabel(role, point) { var el = document.querySelector('#gpsLabel-' + role); if (el) el.textContent = point.label || (point.lat.toFixed(5) + ', ' + point.lng.toFixed(5)); }
function createGpsMap(role) {
  var container = document.querySelector('#gpsMap-' + role);
  if (!container) return;
  if (gpsMaps[role] && gpsMaps[role].container !== container) { try { gpsMaps[role].map.remove(); } catch (error) {} delete gpsMaps[role]; }
  if (gpsMaps[role]) { setTimeout(function () { gpsMaps[role].map.invalidateSize(); }, 80); return; }
  if (!window.L) { container.innerHTML = '<p class="gps-map-error">Mapa se učitava. Osveži stranicu ako se ne prikaže.</p>'; return; }
  var point = readGpsPoint(role); var map = L.map('gpsMap-' + role, { zoomControl: false }).setView([point.lat, point.lng], 13);
  L.control.zoom({ position: 'bottomright' }).addTo(map);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap' }).addTo(map);
  var marker = L.marker([point.lat, point.lng], { draggable: true }).addTo(map);
  var circle = role === 'pro' ? L.circle([point.lat, point.lng], { radius: Number(localStorage.getItem('majstorOdmahProRadius') || 20) * 1000, color: '#23734d', fillColor: '#77b892', fillOpacity: .13 }).addTo(map) : null;
  function save(latlng, label) { var saved = { lat: latlng.lat, lng: latlng.lng, label: label || (latlng.lat.toFixed(5) + ', ' + latlng.lng.toFixed(5)) }; marker.setLatLng(latlng); if (circle) circle.setLatLng(latlng); writeGpsPoint(role, saved); gpsLabel(role, saved); }
  marker.on('dragend', function () { save(marker.getLatLng(), 'Izabrana lokacija na mapi'); });
  map.on('click', function (event) { save(event.latlng, 'Izabrana lokacija na mapi'); });
  gpsMaps[role] = { map: map, marker: marker, circle: circle, save: save, container: container };
  gpsLabel(role, point);
  setTimeout(function () { map.invalidateSize(); }, 80); setTimeout(function () { map.invalidateSize(); }, 400);
  if (role === 'pro') { var input = document.querySelector('#gpsRadius'); var value = document.querySelector('#gpsRadiusValue'); var radius = Number(localStorage.getItem('majstorOdmahProRadius') || 20); input.value = radius; value.textContent = radius + ' km'; input.addEventListener('input', function () { var next = Number(input.value); localStorage.setItem('majstorOdmahProRadius', String(next)); value.textContent = next + ' km'; circle.setRadius(next * 1000); }); }
}
function requestGps(role) {
  var button = document.querySelector('[data-gps-role="' + role + '"]'); if (!navigator.geolocation) { if (button) button.textContent = 'GPS nije podržan'; return; }
  if (button) { button.disabled = true; button.textContent = 'Lociram…'; }
  navigator.geolocation.getCurrentPosition(function (position) { var coords = { lat: position.coords.latitude, lng: position.coords.longitude }; var instance = gpsMaps[role]; if (instance) { instance.map.setView([coords.lat, coords.lng], 16); instance.save(coords, 'Trenutna GPS lokacija'); } if (button) { button.disabled = false; button.textContent = '✓ GPS postavljen'; } }, function () { if (button) { button.disabled = false; button.textContent = 'Dozvoli GPS u pregledaču'; } }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 });
}
function initGpsMaps() { ['customer', 'pro'].forEach(function (role) { createGpsMap(role); }); document.querySelectorAll('.gps-use-location').forEach(function (button) { if (button.dataset.gpsReady) return; button.dataset.gpsReady = 'true'; button.addEventListener('click', function () { requestGps(button.dataset.gpsRole); }); }); }
