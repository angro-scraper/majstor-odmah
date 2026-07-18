"""MVP release gate: only approved MVP product surfaces are visible."""

from __future__ import annotations

from superapp_v5 import render_superapp_page as render_v5


def render_superapp_page(language: str = "SR", initial_tab: str = "home", initial_module: str = "") -> str:
    page = render_v5(language, initial_tab, initial_module)
    script = r'''<script>
const mvpFeatureFor={"Save Food":"save_food","Food":"save_food","Deals":"deals","Services":"services","Jobs":"jobs","Business":"business","Money":"money","Auto":"auto","Health":"health","Tickets":"tickets","Balkan Local":"local"};
function mvpVisible(label,features){const key=mvpFeatureFor[label];return key?features[key]===true:true}
function applyMvpFeatures(features){document.querySelectorAll('.feature').forEach(card=>{const label=card.querySelector('strong')?.textContent;if(!mvpVisible(label,features))card.style.display='none'});document.querySelectorAll('.explore-card').forEach(card=>{const label=card.querySelector('b')?.textContent;if(!mvpVisible(label,features))card.style.display='none'});document.querySelectorAll('.dash-card').forEach(card=>{const label=card.querySelector('b')?.textContent;if(!mvpVisible(label,features))card.style.display='none'});document.querySelectorAll('[data-module-toggle]').forEach(button=>{const key=button.dataset.moduleToggle;if(features[key]===false)button.closest('.module-order')?.remove()})}
async function loadMvpFeatureFlags(){try{const response=await fetch('/api/platform/features'),payload=await response.json();if(response.ok)applyMvpFeatures(payload.features||{})}catch(e){}}
loadMvpFeatureFlags();
</script>'''
    return page.replace("</body>", script + "</body>", 1)
