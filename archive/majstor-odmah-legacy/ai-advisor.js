const ADVICE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['summary', 'recommended_trade', 'work_scope', 'materials', 'safety_note', 'confidence'],
  properties: {
    summary: { type: 'string' },
    recommended_trade: { type: 'string' },
    work_scope: { type: 'array', items: { type: 'string' }, minItems: 1, maxItems: 5 },
    materials: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['item', 'quantity_note'],
        properties: { item: { type: 'string' }, quantity_note: { type: 'string' } }
      },
      maxItems: 8
    },
    safety_note: { type: 'string' },
    confidence: { type: 'string', enum: ['niska', 'srednja', 'visoka'] }
  }
};

function cleanImages(images) {
  return (Array.isArray(images) ? images : []).slice(0, 2).filter(function (image) {
    return typeof image === 'string' && /^data:image\/(jpeg|jpg|png|webp);base64,/i.test(image) && image.length <= 650000;
  });
}

async function analyzeProject(payload) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    const error = new Error('AI savetnik još nije konfigurisan.');
    error.status = 503;
    throw error;
  }
  const description = String(payload.description || '').trim().slice(0, 1500);
  const images = cleanImages(payload.images);
  if (!description && !images.length) {
    const error = new Error('Dodaj opis ili fotografiju radova.');
    error.status = 400;
    throw error;
  }
  const userContent = [{ type: 'input_text', text: description || 'Analiziraj prikazanu fotografiju radova.' }];
  images.forEach(function (image) { userContent.push({ type: 'input_image', image_url: image, detail: 'low' }); });
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-5.4-mini',
      input: [
        { role: 'system', content: [{ type: 'input_text', text: 'Ti si AI savetnik za kućne radove u Srbiji. Odgovaraj isključivo na srpskom latinicom. Analiziraj opis i fotografije samo kao informativan predlog: navedi verovatnu vrstu majstora, opšti obim radova i okvirnu listu materijala bez cena. Ne izmišljaj mere, kvar ili bezbednosne činjenice koje nisu vidljive. Za struju, gas, nosive konstrukcije, curenje vode ili rizik od požara naglasi da pregled mora obaviti kvalifikovan majstor. Ne daj opasna DIY uputstva.' }] },
        { role: 'user', content: userContent }
      ],
      text: { format: { type: 'json_schema', name: 'project_advice', strict: true, schema: ADVICE_SCHEMA } }
    })
  });
  const body = await response.json();
  if (!response.ok) {
    const error = new Error((body && body.error && body.error.message) || 'AI savetnik trenutno nije dostupan.');
    error.status = response.status === 429 ? 429 : 502;
    throw error;
  }
  const outputText = typeof body.output_text === 'string' ? body.output_text : (body.output || []).map(function (item) {
    return (item.content || []).map(function (content) { return content.text || ''; }).join('');
  }).join('');
  const jsonText = String(outputText || '').replace(/^\s*```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '');
  try { return JSON.parse(jsonText); } catch (error) {
    const parseError = new Error('AI savetnik nije vratio čitljiv predlog.');
    parseError.status = 502;
    throw parseError;
  }
}

module.exports = { analyzeProject: analyzeProject };
