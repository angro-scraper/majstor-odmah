var gpsMaps = {};
var defaultGpsPoint = { lat: 45.2671, lng: 19.8335, label: 'Novi Sad' };

function gpsStorageKey(role) { return role === 'pro' ? 'majstorOdmahProGps' : 'majstorOdmahCustomerGps'; }
function readGpsPoint(role) { try { return Object.assign({}, defaultGpsPoint, JSON.parse(localStorage.getItem(gpsStorageKey(role)) || '{}')); } catch (error) { return Object.assign({}, defaultGpsPoint); } }
function writeGpsPoint(role, point) { localStorage.setItem(gpsStorageKey(role), JSON.stringify(point)); }
function gpsMapMarkup(role) {
  var isPro = role === 'pro';
  return '<section class="gps-location-card ' + role + '"><div class="gps-location-head"><div><b>' + (isPro ? 'Tvoja zona rada' : 'Tačna lokacija projekta') + '</b><small id="gpsLabel-' + role + '">GPS još nije podešen</small></div><button type="button" class="gps-use-location" data-gps-role="' + role + '">⌖ Koristi moj GPS</button></div><div class="gps-map" id="gpsMap-' + role + '"></div>' + (isPro ? '<div class="gps-radius"><label>Radijus dolaska <input id="gpsRadius" type="range" min="3" max="50" value="20" /></label><b id="gpsRadiusValue">20 km</b></div>' : '<p class="gps-help">Klikni na mapu da postaviš tačnu adresu. Tačka se koristi za brže pronalaženje majstora u blizini.</p>') + '</section>';
}
function gpsLabel(role, point) { var el = document.querySelector('#gpsLabel-' + role); if (el) el.textContent = point.label || (point.lat.toFixed(5) + ', ' + point.lng.toFixed(5)); }
function createGpsMap(role) {
  if (!window.L || gpsMaps[role] || !document.querySelector('#gpsMap-' + role)) return;
  var point = readGpsPoint(role); var map = L.map('gpsMap-' + role, { zoomControl: false }).setView([point.lat, point.lng], 13);
  L.control.zoom({ position: 'bottomright' }).addTo(map);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap' }).addTo(map);
  var marker = L.marker([point.lat, point.lng], { draggable: true }).addTo(map);
  var circle = role === 'pro' ? L.circle([point.lat, point.lng], { radius: Number(localStorage.getItem('majstorOdmahProRadius') || 20) * 1000, color: '#23734d', fillColor: '#77b892', fillOpacity: .13 }).addTo(map) : null;
  function save(latlng, label) { var saved = { lat: latlng.lat, lng: latlng.lng, label: label || (latlng.lat.toFixed(5) + ', ' + latlng.lng.toFixed(5)) }; marker.setLatLng(latlng); if (circle) circle.setLatLng(latlng); writeGpsPoint(role, saved); gpsLabel(role, saved); }
  marker.on('dragend', function () { save(marker.getLatLng(), 'Izabrana lokacija na mapi'); });
  map.on('click', function (event) { save(event.latlng, 'Izabrana lokacija na mapi'); });
  gpsMaps[role] = { map: map, marker: marker, circle: circle, save: save };
  gpsLabel(role, point);
  if (role === 'pro') { var input = document.querySelector('#gpsRadius'); var value = document.querySelector('#gpsRadiusValue'); var radius = Number(localStorage.getItem('majstorOdmahProRadius') || 20); input.value = radius; value.textContent = radius + ' km'; input.addEventListener('input', function () { var next = Number(input.value); localStorage.setItem('majstorOdmahProRadius', String(next)); value.textContent = next + ' km'; circle.setRadius(next * 1000); }); }
}
function requestGps(role) {
  var button = document.querySelector('[data-gps-role="' + role + '"]'); if (!navigator.geolocation) { if (button) button.textContent = 'GPS nije podržan'; return; }
  if (button) { button.disabled = true; button.textContent = 'Lociram…'; }
  navigator.geolocation.getCurrentPosition(function (position) { var coords = { lat: position.coords.latitude, lng: position.coords.longitude }; var instance = gpsMaps[role]; if (instance) { instance.map.setView([coords.lat, coords.lng], 16); instance.save(coords, 'Trenutna GPS lokacija'); } if (button) { button.disabled = false; button.textContent = '✓ GPS postavljen'; } }, function () { if (button) { button.disabled = false; button.textContent = 'Dozvoli GPS u pregledaču'; } }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 });
}
function initGpsMaps() { ['customer', 'pro'].forEach(function (role) { createGpsMap(role); }); document.querySelectorAll('.gps-use-location').forEach(function (button) { button.addEventListener('click', function () { requestGps(button.dataset.gpsRole); }); }); }
