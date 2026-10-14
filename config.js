/*
 * Liga de la API de Apps Script (la que termina en /exec).
 * Es la única cosa que hay que cambiar si algún día se crea un despliegue
 * nuevo. Publicar una "versión nueva" del mismo despliegue NO la cambia.
 */
window.RETOS_CONFIG = {
  API: 'https://script.google.com/macros/s/AKfycbypaH6V6G7Jm5eCKINYbGv-Yumln_D8fPJ9Yo8J5tLpQlIjpP0qp7tj6srQhllurv9ajw/exec'
};

/*
 * Llamada a la API. Se manda como text/plain a propósito: así el navegador
 * no hace la consulta previa de CORS, que Apps Script no sabe contestar.
 */
window.llamarApi = async function (cuerpo) {
  const r = await fetch(window.RETOS_CONFIG.API, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(cuerpo),
    redirect: 'follow'
  });
  if (!r.ok) throw new Error('El servidor respondió ' + r.status);
  return r.json();
};
