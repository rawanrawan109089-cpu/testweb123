(function(){
  const overlay=document.getElementById('lightbox');
  const stage=overlay.querySelector('.light-stage');
  const title=overlay.querySelector('.light-title');
  const count=overlay.querySelector('.light-count');
  const caption=overlay.querySelector('.light-caption');
  const closeBtn=overlay.querySelector('.light-close');
  const prevBtn=overlay.querySelector('.light-arrow.prev');
  const nextBtn=overlay.querySelector('.light-arrow.next');
  let items=[]; let index=0;
  function collect(box){
    const nodes=[...box.querySelectorAll('.gallery-media')];
    const seen=new Set();
    return nodes.map(el=>{
      const source=el.tagName.toLowerCase()==='video' ? (el.currentSrc || (el.querySelector('source')&&el.querySelector('source').src) || el.src) : (el.currentSrc || el.src);
      return {type:el.tagName.toLowerCase(),src:source,caption:el.dataset.caption||el.alt||''};
    }).filter(item=>{ if(!item.src || seen.has(item.src)) return false; seen.add(item.src); return true; });
  }
  function projectTitle(box){ const h=box.querySelector('h3'); return h?h.textContent.trim():'معاينة العمل'; }
  function render(){
    if(!items.length) return;
    const item=items[index]; stage.innerHTML=''; let el;
    if(item.type==='video'){ el=document.createElement('video'); el.src=item.src; el.controls=true; el.playsInline=true; el.preload='metadata'; }
    else{ el=document.createElement('img'); el.src=item.src; el.alt=item.caption||'معاينة'; }
    stage.appendChild(el);
    caption.textContent=item.caption||'';
    count.textContent=String(index+1).padStart(2,'0')+' / '+String(items.length).padStart(2,'0');
  }
  function open(box,start){
    items=collect(box); if(!items.length) return;
    const src=start ? (start.currentSrc || start.src || (start.querySelector&&start.querySelector('source')&&start.querySelector('source').src) || '') : '';
    const found=src?items.findIndex(i=>i.src===src):-1;
    index=found>=0?found:0; title.textContent=projectTitle(box); render(); overlay.classList.toggle('hide-next', box.matches('[data-hide-next="true"]')); overlay.classList.toggle('flex-travel', box.matches('[data-flex-slider="true"]')); overlay.classList.toggle('hide-arrows', box.matches('[data-hide-arrows="true"]')); overlay.classList.toggle('fit-visual', box.matches('[data-fit-viewer="true"]')); overlay.classList.add('open'); overlay.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden';
  }
  function close(){ overlay.classList.remove('open'); overlay.classList.remove('hide-next'); overlay.classList.remove('flex-travel'); overlay.classList.remove('hide-arrows'); overlay.classList.remove('fit-visual'); overlay.setAttribute('aria-hidden','true'); document.body.style.overflow=''; stage.innerHTML=''; }
  function go(d){ if(!items.length) return; index=(index+d+items.length)%items.length; render(); }
  document.querySelectorAll('[data-case]').forEach(box=>{
    box.querySelectorAll('[data-open-media]').forEach(el=>{ el.addEventListener('click',e=>{ const media=e.target.closest('.gallery-media') || el.querySelector('.gallery-media'); open(box,media); }); });
    box.querySelectorAll('[data-open-case]').forEach(btn=>btn.addEventListener('click',()=>open(box)));
  });
  closeBtn.addEventListener('click',close); prevBtn.addEventListener('click',()=>go(-1)); nextBtn.addEventListener('click',()=>go(1)); overlay.addEventListener('click',e=>{ if(e.target===overlay) close(); });
  document.addEventListener('keydown',e=>{ if(!overlay.classList.contains('open')) return; if(e.key==='Escape') close(); if(e.key==='ArrowRight') go(-1); if(e.key==='ArrowLeft') go(1); });
})();

(function(){
  const overlay = document.getElementById('lightbox');
  if(!overlay) return;

  const stage = overlay.querySelector('.light-stage');
  const title = overlay.querySelector('.light-title');
  const count = overlay.querySelector('.light-count');
  const caption = overlay.querySelector('.light-caption');
  const closeBtn = overlay.querySelector('.light-close');
  const prevBtn = overlay.querySelector('.light-arrow.prev');
  const nextBtn = overlay.querySelector('.light-arrow.next');

  let groupedItems = [];
    document.body.classList.remove('first-section-gallery-open');
  let groupedIndex = 0;
  let groupedActive = false;

  function collectGroup(group){
    const nodes = [...group.querySelectorAll('[data-group-media]')];
    return nodes
      .sort((a,b) => Number(a.dataset.order || 0) - Number(b.dataset.order || 0))
      .map(el => ({
        src: el.currentSrc || el.src || '',
        caption: el.dataset.caption || el.alt || ''
      }))
      .filter(item => item.src);
  }

  function renderGroup(){
    if(!groupedActive || !groupedItems.length) return;
    const item = groupedItems[groupedIndex];

    stage.innerHTML = '';
    const img = document.createElement('img');
    img.src = item.src;
    img.alt = item.caption || 'معاينة';
    stage.appendChild(img);

    title.textContent = groupedItems.title || 'معاينة العمل';
    caption.textContent = item.caption || '';
    count.textContent =
      String(groupedIndex + 1).padStart(2,'0') +
      ' / ' +
      String(groupedItems.length).padStart(2,'0');
  }

  function openGroup(group, startIndex = 0){
    groupedItems = collectGroup(group);
    groupedItems.title = group.dataset.title || 'معاينة العمل';
    if(!groupedItems.length) return;

    groupedIndex = Math.max(0, Math.min(startIndex, groupedItems.length - 1));
    groupedActive = true;

    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    document.body.classList.add('first-section-gallery-open');

    renderGroup();
  }

  function closeGroup(){
    if(!groupedActive) return;
    groupedActive = false;
    groupedItems = [];
    document.body.classList.remove('first-section-gallery-open');
  }

  function moveGroup(direction){
    if(!groupedActive || !groupedItems.length) return;
    groupedIndex = (groupedIndex + direction + groupedItems.length) % groupedItems.length;
    renderGroup();
  }

  // فتح المجموعة فقط، بدون تداخل مع جاليري الموقع الأصلي
  document.addEventListener('click', function(e){
    const opener = e.target.closest('[data-gallery-open]');
    if(!opener) return;

    const group = opener.closest('[data-gallery-group]');
    if(!group) return;

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    openGroup(group, 0);
  }, true);

  prevBtn && prevBtn.addEventListener('click', function(e){
    if(!groupedActive) return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    moveGroup(-1);
  }, true);

  nextBtn && nextBtn.addEventListener('click', function(e){
    if(!groupedActive) return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    moveGroup(1);
  }, true);

  closeBtn && closeBtn.addEventListener('click', function(){
    closeGroup();
  }, true);

  overlay.addEventListener('click', function(e){
    if(e.target === overlay) closeGroup();
  }, true);

  document.addEventListener('keydown', function(e){
    if(!groupedActive) return;
    if(e.key === 'Escape') closeGroup();
    if(e.key === 'ArrowRight') moveGroup(-1);
    if(e.key === 'ArrowLeft') moveGroup(1);
  }, true);
})();

(function(){
  document.querySelectorAll('[data-business-card-compact="true"]').forEach(function(card){
    const images = Array.from(card.querySelectorAll('.business-card-mini-img'));
    images.forEach(function(img, index){
      img.classList.toggle('active', index === 0);
    });
  });

  const viewer = document.getElementById('section4ImageViewer');
  if(!viewer) return;

  const img = viewer.querySelector('img');
  const closeBtn = viewer.querySelector('.section4-viewer-close');
  const prevBtn = viewer.querySelector('.section4-viewer-prev');
  const nextBtn = viewer.querySelector('.section4-viewer-next');
  const caption = viewer.querySelector('.section4-viewer-caption span');

  let currentItems = [];
  let currentIndex = 0;

  function normalizeItems(card){
    return Array.from(card.querySelectorAll('img')).map(function(node){
      return {
        src: node.currentSrc || node.src,
        alt: node.dataset.fullCaption || node.alt || ''
      };
    }).filter(function(item){
      return !!item.src;
    });
  }

  function render(){
    const item = currentItems[currentIndex] || { src:'', alt:'' };
    img.src = item.src || '';
    img.alt = item.alt || '';
    if(caption){
      caption.textContent = item.alt || '';
    }
    const hasMultiple = currentItems.length > 1;
    viewer.classList.toggle('is-single', !hasMultiple);
    if(prevBtn) prevBtn.disabled = !hasMultiple;
    if(nextBtn) nextBtn.disabled = !hasMultiple;
  }

  function openViewer(items, startIndex){
    currentItems = items || [];
    currentIndex = startIndex || 0;
    render();
    viewer.classList.add('open');
    viewer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeViewer(){
    viewer.classList.remove('open');
    viewer.setAttribute('aria-hidden', 'true');
    img.removeAttribute('src');
    img.alt = '';
    if(caption) caption.textContent = '';
    currentItems = [];
    currentIndex = 0;
    document.body.style.overflow = '';
  }

  function move(step){
    if(currentItems.length < 2) return;
    currentIndex = (currentIndex + step + currentItems.length) % currentItems.length;
    render();
  }

  document.addEventListener('click', function(e){
    const externalLink = e.target.closest('article[data-section4-viewer="true"] a');
    if(externalLink){
      e.stopPropagation();
      return;
    }

    const card = e.target.closest('article[data-section4-viewer="true"] .product-card');
    if(!card) return;

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    const items = normalizeItems(card);
    if(!items.length) return;

    const imageNodes = Array.from(card.querySelectorAll('img'));
    const clickedImage = e.target.closest('img');
    let startIndex = 0;
    if(clickedImage){
      const imageIndex = imageNodes.indexOf(clickedImage);
      if(imageIndex > -1) startIndex = imageIndex;
    }

    openViewer(items, startIndex);
  }, true);

  if(closeBtn){
    closeBtn.addEventListener('click', function(e){
      e.preventDefault();
      e.stopPropagation();
      closeViewer();
    });
  }

  if(prevBtn){
    prevBtn.addEventListener('click', function(e){
      e.preventDefault();
      e.stopPropagation();
      move(-1);
    });
  }

  if(nextBtn){
    nextBtn.addEventListener('click', function(e){
      e.preventDefault();
      e.stopPropagation();
      move(1);
    });
  }

  viewer.addEventListener('click', function(e){
    if(e.target === viewer) closeViewer();
  });

  document.addEventListener('keydown', function(e){
    if(!viewer.classList.contains('open')) return;
    if(e.key === 'Escape') closeViewer();
    if(e.key === 'ArrowRight') move(1);
    if(e.key === 'ArrowLeft') move(-1);
  });
})();
