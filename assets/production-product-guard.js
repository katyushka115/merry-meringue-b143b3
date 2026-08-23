/* Keep the static production bouquet catalog authoritative if the legacy inline Supabase request finishes later. */
(()=>{
  const P=[
    ['Летнее настроение','Нежная гортензия и пионы',6500,'products/e4c020f0-bfab-4a1d-86a8-32024b389918.jpeg',4],
    ['Белая нежность','Нежный весенний букет',4800,'products/d1f21237-9960-451b-be4f-e605e369dc12.jpeg',2],
    ['Букет нежных роз','Красивый букет белых роз',5500,'products/e496cdb9-a106-4308-8572-f6ca621416a6.jpeg',1],
    ['Нежность в деталях','Букет из нежных лилий с яркой гортензией',6300,'products/1f7ad4bc-0680-4a98-a55b-0db7740e0505.jpeg',3]
  ];
  const render=()=>{const g=document.getElementById('product-grid');if(!g)return;const first=g.querySelector('h3')?.textContent||'';if(first===P[0][0]&&g.querySelectorAll('.product').length===4)return;g.innerHTML=P.map((p,i)=>`<article class="product visible"><div class="product-image"><span class="product-number">${String(i+1).padStart(2,'0')}</span><img src="/media/product/${p[3]}" alt="${p[0]}" loading="eager" decoding="async" onerror="this.onerror=null;this.src='/media/collection-${(i%3)+1}.jpg'"></div><div class="product-info"><div><h3>${p[0]}</h3><p>${p[1]}</p><p><strong>${p[2].toLocaleString('ru-RU')} ₽</strong></p></div><button class="order-button" type="button" data-product-id="${p[4]}" data-product-name="${p[0]}" data-product-price="${p[2]}">Заказать</button></div></article>`).join('')};
  const start=()=>{render();const g=document.getElementById('product-grid');if(g){new MutationObserver(()=>render()).observe(g,{childList:true});}let n=0;const timer=setInterval(()=>{render();if(++n>=60)clearInterval(timer)},1000)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
