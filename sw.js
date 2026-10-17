/* Схемотека: приложение открывается из кэша телефона мгновенно, новая версия скачивается в фоне и применяется при следующем открытии */
const C='schemoteka-app';
self.addEventListener('install',e=>{ self.skipWaiting(); e.waitUntil(caches.open(C).then(c=>c.addAll(['./','./manifest.json','./icon-192.png']).catch(()=>{}))); });
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{ const r=e.request; if(r.method!=='GET') return; const u=new URL(r.url); if(u.origin!==location.origin) return;
  const key=(r.mode==='navigate'||u.pathname.endsWith('/index.html'))?'./':r;
  e.respondWith(caches.open(C).then(async c=>{ const hit=await c.match(key); const net=fetch(r,{cache:'no-cache'}).then(res=>{ if(res&&res.ok) c.put(key,res.clone()); return res; }).catch(()=>hit);
    return hit||net; })); });
