/* Local Favorites for quick presets and reflex-quiz presets. */
(() => {
  'use strict';
  const STORE='a6000-favorites-v1';
  const t=(en,vi)=>document.documentElement.lang==='vi'?vi:en;
  const normalize=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/&amp;/g,'&').toLowerCase();
  const esc=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const read=()=>{try{const v=JSON.parse(localStorage.getItem(STORE)||'[]');return Array.isArray(v)?v.filter(x=>x&&typeof x.id==='string'):[];}catch{return[];}};
  const write=items=>{try{localStorage.setItem(STORE,JSON.stringify(items));return true;}catch{return false;}};
  const caseNames={
    morningWarmRoad:'Morning Warm Sun — Tree-Lined Road',
    sunThroughLeaves:'Sun Through Trees — Warm Leaf Light',
    morningPeopleRoad:'Morning Walker — Human Scale',
    aquariumCase:'Aquarium / Bể Cá',
    nightLitSubject:'Night — Lit Subject / Dark Sky',
    backlitPlant:'Backlit Ornamental Plant — Leaf Glow',
    sunsetPhoto:'Sunset — Color, Silhouette & Foreground',
    weddingPhoto:'Wedding Guest — Couple, Candids & Reception',
    waterfrontCafe:'Waterfront Café — Golden Hour',
    passportPhoto:'Passport Photo — 4×6 cm',
    parkWalk:'Park Walk — All-Weather Scene Guide'
  };
  const targetHints={
    'morning-road':'QUICK SETUP',
    'sun-through-leaves':'QUICK SETUP',
    'morning-walker':'QUICK SETUP',
    'aquarium-whole':'Whole aquarium',
    'aquarium-fish':'Swimming fish',
    'aquarium-lit':'Illuminated fish',
    'a-mode-blur':'Swimming fish',
    'night-lit-subject':'QUICK SETUP',
    'night-exposure':'FIELD ADJUSTMENTS',
    'plant-glow':'PRESET 1 · LEAF GLOW',
    'plant-veins':'PRESET 2 · TRANSLUCENT VEINS',
    'plant-silhouette':'PRESET 3 · SILHOUETTE',
    'sunset-colour':'PRESET 1 · SUNSET COLORS',
    'sunset-silhouette':'PRESET 2 · SILHOUETTE',
    'blue-hour-sunset':'PRESET 4 · BLUE HOUR',
    'wedding-couple':'COUPLE PORTRAIT',
    'wedding-candid':'CANDID MOMENTS',
    'wedding-group':'FAMILY GROUP',
    'wedding-reception':'DIM RECEPTION',
    'cafe-lifestyle':'PRESET 1 · LIFESTYLE',
    'cafe-skyline':'PRESET 2 · SKYLINE',
    'coffee-detail':'PRESET 3 · COFFEE',
    'passport-photo':'QUICK SETUP',
    'park-leading':'Path & Leading Lines',
    'park-noon':'Harsh Noon Shadows',
    'park-pet':'Pet Walk',
    'park-overcast':'Overcast Soft Green',
    'park-flower':'Flower Bokeh',
    'park-puddle':'After Rain',
    'park-blue-hour':'Blue Hour Park View',
    'park-lamp':'Park Lamps',
    'park-water':'Long Exposure Water',
    'park-silhouette':'Person / Tree Silhouette',
    'park-leaves':'Leaf / Flower Texture',
    'park-group':'Friends & Family Group',
    'tripod-benefit':'Park Lamps',
    'backlight-ev':'QUICK SETUP',
    'intentional-blur':'QUICK SETUP'
  };
  const quickKeys=['cafe','portrait','street','night','food','travel','action','backlight','group'];
  const saved=()=>read();
  const has=id=>read().some(item=>item.id===id);
  const save=items=>{const ok=write(items);window.dispatchEvent(new CustomEvent('a6000:favorites-change'));return ok;};
  function refreshQuickButtons(){
    document.querySelectorAll('#homeScreen .preset-grid .preset-btn').forEach(tile=>{
      const key=(tile.getAttribute('onclick')||'').match(/showScenario\('([^']+)'\)/)?.[1];
      if(!key)return;
      const button=tile.querySelector('.quick-favorite-toggle');
      if(!button)return;
      const active=has('quick:'+key);
      button.classList.toggle('is-saved',active);
      button.textContent=active?'★':'☆';
      button.setAttribute('aria-label',active?t('Remove from Favorites','Bỏ khỏi Yêu thích'):t('Add quick preset to Favorites','Thêm preset nhanh vào Yêu thích'));
      button.title=button.getAttribute('aria-label');
    });
  }
  function updateCount(){
    const button=document.getElementById('openFavorites');
    if(button){const n=read().length;button.textContent=t('★ Favorites','★ Yêu thích')+' ('+n+')';}
  }
  function render(){
    const mount=document.getElementById('favoritesApp');
    if(!mount)return;
    const items=read();
    mount.replaceChildren();
    if(!items.length){
      const empty=document.createElement('div');empty.className='favorites-empty';
      const icon=document.createElement('div');icon.className='favorites-empty-star';icon.textContent='☆';
      const title=document.createElement('h3');title.textContent=t('Your Favorites list is empty','Danh sách Yêu thích đang trống');
      const text=document.createElement('p');text.textContent=t('During a Reflex Quiz, save a preset after the answer appears. You can also tap the star on any Quick Preset tile. Your saved items stay on this device.','Trong bài luyện tập, hãy lưu preset sau khi đáp án hiện ra. Bạn cũng có thể bấm ngôi sao trên các thẻ Preset nhanh. Danh sách được lưu trên thiết bị này.');
      const quiz=document.createElement('button');quiz.type='button';quiz.className='quiz-primary';quiz.textContent=t('OPEN REFLEX QUIZ →','MỞ LUYỆN PHẢN XẠ →');quiz.addEventListener('click',()=>window.launchReflexQuiz?.());
      const home=document.createElement('button');home.type='button';home.className='quiz-secondary';home.textContent=t('BROWSE QUICK PRESETS','XEM PRESET NHANH');home.addEventListener('click',()=>{window.showScreen?.('home');document.querySelector('.preset-grid')?.scrollIntoView({behavior:'smooth',block:'start'});});
      empty.append(icon,title,text,quiz,home);mount.append(empty);
    }else{
      const intro=document.createElement('div');intro.className='favorites-intro';
      const count=document.createElement('p');count.textContent=t('Saved presets','Preset đã lưu')+' · '+items.length;
      const note=document.createElement('p');note.textContent=t('Open any item to jump to its Quick Preset tile or the matching Field Case section.','Chọn một mục để chuyển đến đúng thẻ Preset nhanh hoặc phần tương ứng trong Field Case.');
      intro.append(count,note);mount.append(intro);
      const grid=document.createElement('div');grid.className='favorites-list';
      items.forEach(item=>{
        const card=document.createElement('article');card.className='favorite-card';
        const top=document.createElement('div');top.className='favorite-card-top';
        const badge=document.createElement('span');badge.className='favorite-kind';badge.textContent=item.kind==='quick'?t('QUICK PRESET','PRESET NHANH'):t('FIELD CASE PRESET','PRESET TRONG CASE');
        const title=document.createElement('h3');title.textContent=document.documentElement.lang==='vi'?(item.titleVi||item.titleEn):(item.titleEn||item.titleVi);
        top.append(badge,title);
        const location=document.createElement('p');location.className='favorite-location';
        location.textContent=item.kind==='quick'?t('Quick Presets · '+(item.caseNameEn||'Home'), 'Preset nhanh · '+(item.caseNameVi||'Trang chủ')):((item.caseNameEn||caseNames[item.caseId]||item.caseId)+' · '+t('Field Case Library','Thư viện tình huống'));
        card.append(top,location);
        if(item.kind==='quiz'&&(item.sceneEn||item.sceneVi)){
          const scene=document.createElement('p');scene.className='favorite-scene';scene.textContent=document.documentElement.lang==='vi'?(item.sceneVi||item.sceneEn):(item.sceneEn||item.sceneVi);card.append(scene);
        }
        const actions=document.createElement('div');actions.className='favorite-actions';
        const open=document.createElement('button');open.type='button';open.className='quiz-primary';open.textContent=t('OPEN PRESET →','MỞ PRESET →');open.addEventListener('click',()=>openItem(item));
        const remove=document.createElement('button');remove.type='button';remove.className='quiz-secondary';remove.textContent=t('Remove','Bỏ');remove.addEventListener('click',()=>{save(read().filter(x=>x.id!==item.id));render();refreshQuickButtons();});
        actions.append(open,remove);card.append(actions);grid.append(card);
      });
      mount.append(grid);
      const clear=document.createElement('button');clear.type='button';clear.className='favorites-clear-all';clear.textContent=t('Clear all Favorites','Xóa toàn bộ mục Yêu thích');
      clear.addEventListener('click',()=>{if(!window.confirm(t('Remove every saved Favorite from this device?','Xóa tất cả mục Yêu thích đã lưu trên thiết bị này?')))return;save([]);render();refreshQuickButtons();});
      mount.append(clear);
    }
    updateCount();
  }
  function jumpToHint(card,hint){
    if(!card||!hint)return false;
    const wanted=normalize(hint);
    const candidates=card.querySelectorAll('.section-card-title,.step-title,.setting-label,.section-title,.field-case-hero-title,.field-case-setup,.setting-value,.quick-settings-card');
    let match=null;
    for(const node of candidates){
      const text=normalize(node.textContent);
      if(text.includes(wanted)){match=node;break;}
    }
    if(!match)return false;
    const target=match.closest('.section-card,.setting-item,.step-card')||match;
    target.classList.add('favorite-jump-highlight');
    target.scrollIntoView({behavior:'smooth',block:'center'});
    return true;
  }
  function openItem(item){
    if(item.kind==='quick'){
      window.showScreen?.('home');
      const tile=document.getElementById('quickPreset-'+item.quickKey);
      if(tile){tile.classList.add('favorite-jump-highlight');tile.scrollIntoView({behavior:'smooth',block:'center'});tile.focus?.();}
      return;
    }
    if(window.showFieldCase)window.showFieldCase(item.caseId);
    const card=document.getElementById((item.caseId||'')+'Card');
    if(!jumpToHint(card,item.targetHint)){
      (card?.querySelector('.card-header')||card)?.scrollIntoView?.({behavior:'smooth',block:'start'});
    }
  }
  function toggleQuick(key){
    const id='quick:'+key,items=read(),found=items.some(x=>x.id===id);
    if(found)save(items.filter(x=>x.id!==id));
    else{
      const tile=document.getElementById('quickPreset-'+key);
      const name=tile?.querySelector('.preset-name');
      const en=name?.dataset.en||name?.textContent||key,vi=name?.dataset.vi||en;
      items.unshift({id,kind:'quick',quickKey:key,titleEn:en,titleVi:vi,caseNameEn:en,caseNameVi:vi,targetType:'quick'});
      save(items);
    }
    refreshQuickButtons();render();
    return !found;
  }
  function toggleQuiz(item,option){
    const id='quiz:'+item.id,items=read(),found=items.some(x=>x.id===id);
    if(found){save(items.filter(x=>x.id!==id));}
    else{
      const caseButton=[...document.querySelectorAll('#fieldCaseGrid .field-case-btn')].find(n=>(n.getAttribute('onclick')||'').includes("showFieldCase('"+item.caseId+"')"));
      const caseName=caseButton?.querySelector('.field-case-title')?.textContent?.trim()||caseNames[item.caseId]||item.caseId;
      items.unshift({id,kind:'quiz',caseId:item.caseId,titleEn:option.en,titleVi:option.vi,caseNameEn:caseName,caseNameVi:caseName,sceneEn:item.sceneE,sceneVi:item.sceneV,targetHint:targetHints[item.id]||'',targetType:'case',questionId:item.id});
      save(items);
    }
    render();refreshQuickButtons();
    return !found;
  }
  function installQuickButtons(){
    document.querySelectorAll('#homeScreen .preset-grid .preset-btn').forEach(tile=>{
      const key=(tile.getAttribute('onclick')||'').match(/showScenario\('([^']+)'\)/)?.[1];
      if(!key)return;
      tile.id='quickPreset-'+key;
      if(tile.querySelector('.quick-favorite-toggle'))return;
      const button=document.createElement('button');button.type='button';button.className='quick-favorite-toggle';
      button.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();toggleQuick(key);});
      tile.append(button);
    });
    refreshQuickButtons();
  }
  window.A6000Favorites={has,count:()=>read().length,items:saved,toggleQuick,toggleQuiz,render,openItem,refreshQuickButtons};
  window.renderA6000Favorites=render;
  window.addEventListener('a6000:favorites-change',()=>{updateCount();if(document.getElementById('favoritesScreen')?.classList.contains('active'))render();});
  window.addEventListener('a6000:language-change',()=>{refreshQuickButtons();updateCount();if(document.getElementById('favoritesScreen')?.classList.contains('active'))render();});
  installQuickButtons();
})();