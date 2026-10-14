/*
 * Ventanas propias para preguntar y avisar.
 *
 * Reemplazan a confirm() y alert() del navegador, que siempre encabezan el
 * mensaje con la dirección del sitio ("La página ...github.io dice:") y no
 * se pueden cambiar. Estas usan los colores de cada página (sus variables
 * --carta, --oro, --crema, --borde).
 *
 *   if (await preguntar('¿Seguro?', { si: 'Cambiar', no: 'Mejor no' })) { ... }
 *   avisar('No hay conexión. Intenta otra vez.');
 */
(function () {
  var estilo = document.createElement('style');
  estilo.textContent =
    '.dlg-fondo{position:fixed;inset:0;z-index:50;display:flex;align-items:center;justify-content:center;' +
    'padding:22px;background:rgba(5,6,12,.62);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);' +
    'opacity:0;transition:opacity .18s ease}' +
    '.dlg-fondo.visible{opacity:1}' +
    '.dlg-caja{width:100%;max-width:380px;background:linear-gradient(170deg,var(--carta,#251C2E),#120F18);' +
    'border:1px solid var(--borde,rgba(201,161,74,.25));border-radius:20px;padding:24px 22px 18px;' +
    'box-shadow:0 24px 60px -20px rgba(0,0,0,.9);transform:translateY(10px) scale(.98);transition:transform .2s ease}' +
    '.dlg-fondo.visible .dlg-caja{transform:none}' +
    '.dlg-adorno{color:var(--oro,#C9A14A);text-align:center;letter-spacing:.3em;font-size:12px;margin:0 0 12px}' +
    '.dlg-texto{color:var(--crema,#F4EDE2);font-size:16.5px;line-height:1.5;margin:0 0 22px;text-align:center}' +
    '.dlg-botones{display:flex;gap:10px}' +
    '.dlg-botones button{flex:1;font-family:inherit;font-size:15px;font-weight:600;border-radius:13px;' +
    'padding:14px 12px;cursor:pointer;border:0;width:auto}' +
    '.dlg-si{background:linear-gradient(135deg,var(--oro,#C9A14A),#B08A36);color:#1E1608}' +
    '.dlg-no{background:transparent;color:var(--crema-sutil,#BDB0A6);border:1px solid rgba(244,237,226,.18) !important}';
  document.head.appendChild(estilo);

  function abrir(texto, botones) {
    return new Promise(function (resolver) {
      var fondo = document.createElement('div');
      fondo.className = 'dlg-fondo';
      fondo.setAttribute('role', 'dialog');
      fondo.setAttribute('aria-modal', 'true');

      var caja = document.createElement('div');
      caja.className = 'dlg-caja';
      var adorno = document.createElement('p');
      adorno.className = 'dlg-adorno';
      adorno.textContent = '♥';
      var p = document.createElement('p');
      p.className = 'dlg-texto';
      p.textContent = texto;                       // texto plano: nunca HTML
      var fila = document.createElement('div');
      fila.className = 'dlg-botones';

      function cerrar(valor) {
        document.removeEventListener('keydown', teclas);
        fondo.classList.remove('visible');
        setTimeout(function () { fondo.remove(); }, 180);
        resolver(valor);
      }
      function teclas(e) {
        if (e.key === 'Escape') cerrar(false);
        if (e.key === 'Enter') cerrar(true);
      }

      if (botones.no) {
        var no = document.createElement('button');
        no.type = 'button'; no.className = 'dlg-no'; no.textContent = botones.no;
        no.onclick = function () { cerrar(false); };
        fila.appendChild(no);
      }
      var si = document.createElement('button');
      si.type = 'button'; si.className = 'dlg-si'; si.textContent = botones.si;
      si.onclick = function () { cerrar(true); };
      fila.appendChild(si);

      // tocar fuera de la caja = cancelar
      fondo.addEventListener('click', function (e) { if (e.target === fondo) cerrar(false); });
      document.addEventListener('keydown', teclas);

      caja.appendChild(adorno); caja.appendChild(p); caja.appendChild(fila);
      fondo.appendChild(caja);
      document.body.appendChild(fondo);
      requestAnimationFrame(function () { fondo.classList.add('visible'); si.focus(); });
    });
  }

  window.preguntar = function (texto, o) {
    o = o || {};
    return abrir(texto, { si: o.si || 'Sí', no: o.no || 'Cancelar' });
  };
  window.avisar = function (texto) {
    return abrir(texto, { si: 'Entendido' });
  };
})();
