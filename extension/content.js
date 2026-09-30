(function () {
  if (window.top !== window || !location.pathname.startsWith('/soidukid/')) return;

  const clean = (value) => (value || '').replace(/\s+/g, ' ').trim();
  const first = (selectors) => { for (const selector of selectors) { const node = document.querySelector(selector); const value = clean(node?.textContent); if (value) return value; } return ''; };
  const labelled = (labels) => {
    const text = document.body.innerText.replace(/\r/g, '');
    for (const label of labels) {
      const match = text.match(new RegExp(`^\\s*${label}\\s*:?[ \\t]+([^\\n|]{1,90})`, 'im'));
      if (match?.[1]) return clean(match[1]);
    }
    return '';
  };
  const numeric = (value) => { const match = clean(value).replace(/\s/g, '').match(/[0-9][0-9.,]*/); if (!match) return null; const result = Number(match[0].replace(/\.(?=\d{3})/g, '').replace(',', '.')); return Number.isFinite(result) ? Math.round(result) : null; };
  const yearValue = (value) => { const match = clean(value).match(/\b(?:19|20)\d{2}\b/); return match ? Number(match[0]) : null; };
  const titleData = () => {
    const title = clean(document.querySelector('h1')?.textContent || document.title).replace(/\s*[|–-].*$/, '');
    const words = title.split(' ').filter(Boolean);
    return { make: words[0] || '', model: words.slice(1, 4).join(' ') };
  };
  const extract = () => {
    const identity = titleData();
    const jsonLd = [...document.querySelectorAll('script[type="application/ld+json"]')].map((node) => { try { return JSON.parse(node.textContent || '{}'); } catch { return {}; } }).find((item) => item && (item['@type'] === 'Vehicle' || item.vehicleIdentificationNumber));
    const text = document.body.innerText;
    const listingId = location.pathname.match(/(\d{5,})/)?.[1] || new URLSearchParams(location.search).get('id');
    return {
      url: location.href, listingId, title: clean(document.querySelector('h1')?.textContent || document.title), vin: clean(labelled(['VIN-kood']) || jsonLd?.vehicleIdentificationNumber), registrationNumber: clean(labelled(['Reg. number'])),
      make: clean(jsonLd?.brand?.name || jsonLd?.brand || identity.make), model: clean(jsonLd?.model || identity.model),
      year: yearValue(labelled(['Esmane reg', 'Aasta', 'Registreerimine']) || jsonLd?.vehicleModelDate),
      engine: labelled(['Mootor']) || clean(jsonLd?.vehicleEngine?.name), transmission: labelled(['Käigukast']),
      mileageKm: numeric(labelled(['Läbisõidumõõdiku näit', 'Läbisõit', 'Läbisõit km']) || jsonLd?.mileageFromOdometer?.value),
      priceEur: numeric(labelled(['Hind', 'Müügihind']) || jsonLd?.offers?.price), location: labelled(['Asukoht', 'Linn']),
      variant: labelled(['Mudel', 'Versioon', 'Keretüüp'])
    };
  };
  const button = document.createElement('button');
  button.textContent = 'Impordi AutoTark-sse';
  button.type = 'button';
  button.style.cssText = 'position:fixed;right:24px;bottom:24px;z-index:2147483647;padding:14px 18px;border:0;border-radius:10px;background:#20252b;color:#f2b544;font:700 14px system-ui;box-shadow:0 6px 24px #0005;cursor:pointer';
  button.addEventListener('click', () => { button.disabled = true; button.textContent = 'Impordin…'; const listing = extract(); if (!listing.make || !listing.model) { button.disabled = false; button.textContent = 'Andmeid ei leitud'; setTimeout(() => { button.textContent = 'Impordi AutoTark-sse'; }, 2500); return; } const target = 'http://127.0.0.1:5173/?auto24_import=' + encodeURIComponent(JSON.stringify(listing)); window.open(target, '_blank', 'noopener'); button.textContent = 'Avatud AutoTark'; });
  document.body.appendChild(button);
})();

