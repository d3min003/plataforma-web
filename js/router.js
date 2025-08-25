// Very small hash-based router
export const routes = {};

export function register(path, render, bind) {
  routes[path] = { render, bind };
}

export function startRouter(mount) {
  function go(){
    const hash = location.hash || '#/dashboard';
    const path = hash.split('?')[0];
  const r = routes[path] || routes['#/dashboard'];
    if (!r) return;
    mount.innerHTML = r.render();
    r.bind?.(mount);
    document.querySelectorAll('[data-link]')?.forEach(a=>{
      a.classList.toggle('active', a.getAttribute('href') === path);
    });
  }
  addEventListener('hashchange', go);
  go();
}
