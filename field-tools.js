/* Field navigation, accessible search and persistent preflight. */
(() => {
  const root = document.getElementById('fieldTools');
  const vi = () => document.documentElement.lang === 'vi';
  const t = (en, vn) => vi() ? vn : en;
  const normalize = text => String(text).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g,'d').toLowerCase();
  const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
  const save = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; } };
  const textOf = node => (node?.textContent || '').replace(/\s+/g,' ').trim();
  // A consistent four-part reading order above each existing preset.
  document.querySelectorAll('#homeScreen .preset-btn').forEach(button => {
    const key=button.getAttribute('onclick')?.match(/showScenario\('([^']+)'\)/)?.[1];
    const card=document.getElementById(key+'Card'); if(!card)return;
    const guide=document.createElement('details');guide.className='preset-guide';
    const summary=document.createElement('summary');summary.dataset.en='Shot workflow: goal → settings → shoot → review';summary.dataset.vi='Quy trình: mục tiêu → thông số → chụp → kiểm tra';summary.textContent=summary.dataset.en;guide.append(summary);
    const settings=textOf(card.querySelector('.quick-settings-card'));
    const goal=card.querySelector('.card-subtitle');
    [['Goal','Mục tiêu',goal?.dataset.en||textOf(goal),goal?.dataset.vi||textOf(goal)],['Starting settings','Thông số bắt đầu',settings,settings],['How to shoot','Cách thực hiện','Choose a subject and background; use the shot ideas below, take a test frame, then adjust one setting at a time.','Chọn chủ thể và nền; dùng gợi ý shot bên dưới, chụp thử rồi điều chỉnh từng thông số.'],['Common mistakes to check','Lỗi thường gặp cần kiểm tra','Subject blur, missed focus, clipped highlights and a distracting background. Inspect the test image before continuing.','Chủ thể nhòe, sai nét, cháy highlight và nền rối. Kiểm tra ảnh thử trước khi chụp tiếp.']].forEach(([en,vn,bodyEn,bodyVi])=>{const p=document.createElement('p'),b=document.createElement('b'),span=document.createElement('span');b.dataset.en=en+': ';b.dataset.vi=vn+': ';b.textContent=b.dataset.en;span.dataset.en=bodyEn;span.dataset.vi=bodyVi;span.textContent=bodyEn;p.append(b,span);guide.append(p);});
    card.querySelector('.card-header')?.after(guide);
  });
  const catalog = [];
  const add = (title, text, action, mode, node) => {
    if (!title || catalog.some(x => x.action === action)) return;
    const bilingual = node ? [...node.querySelectorAll('[data-en]')].map(n => n.dataset.en+' '+n.dataset.vi).join(' ') : '';
    catalog.push({title,text,action,mode,node,haystack:normalize(title+' '+text+' '+bilingual)});
  };
  document.querySelectorAll('#homeScreen .preset-btn').forEach(n => {
    const action = n.getAttribute('onclick');
    const key = action?.match(/showScenario\('([^']+)'\)/)?.[1];
    const card = document.getElementById(key+'Card');
    add(textOf(n.querySelector('.preset-name')),textOf(card),action,'photo',card);
  });
  document.querySelectorAll('#fieldCaseGrid .field-case-btn,#videoFieldCaseGrid .field-case-btn').forEach(n => {
    const action=n.getAttribute('onclick');
    const video=n.closest('#videoFieldCaseGrid');
    const key=action?.match(/\('([^']+)'\)/)?.[1];
    const detail=video ? window.VIDEO_FIELD_CASES[key]?.html : document.getElementById(key+'Card')?.textContent;
    const temp=document.createElement('div'); temp.innerHTML=detail||'';
    add(textOf(n.querySelector('.field-case-title')),textOf(n)+' '+(n.dataset.keywords||'')+' '+textOf(temp),action,video?'video':'photo',n);
  });
  document.querySelectorAll('[id^="videoPresetV"]').forEach(n=>add(textOf(n.querySelector('summary,.video-preset-title,h3'))||n.id,textOf(n),`openVideoPreset('${n.id}')`,'video',n));
  const sections=[['home','Photo OS','Bắt đầu chụp ảnh'],['video','Video OS','Bắt đầu quay phim'],['fieldcases','Photo Field Cases','Tình huống chụp ảnh'],['videofieldcases','Video Field Cases','Tình huống quay phim'],['quicksetup','5-minute setup','Thiết lập 5 phút'],['weather','Weather and light','Thời tiết và ánh sáng'],['memory','MR memories','Bộ nhớ MR'],['controls','Camera controls','Điều khiển máy ảnh'],['firstday','First day','Ngày đầu sử dụng'],['guide','Guide','Hướng dẫn'],['setup','Full setup','Thiết lập đầy đủ']];
  sections.forEach(([key,en,vn])=>add(en,en+' '+vn,`showScreen('${key}')`,key.startsWith('video')?'video':'photo'));

  root.innerHTML = `<div class="field-toolbar"><label class="field-search-label" for="globalSearch"></label><input id="globalSearch" type="search" autocomplete="off"><button id="clearSearch" type="button"></button><button id="checkUpdate" type="button"></button><span id="releaseLabel"></span></div>
    <details id="fieldPanel"><summary id="toolsSummary"></summary><div class="field-panel-body"><div class="field-filters">
    <label><span data-label="mode"></span><select id="modeFilter"><option value=""></option><option value="photo">Photo</option><option value="video">Video</option></select></label>
    <label><span data-label="light"></span><select id="lightFilter"><option value=""></option><option value="low"></option><option value="sun"></option><option value="soft"></option></select></label>
    <label><span data-label="subject"></span><select id="subjectFilter"><option value=""></option><option value="people"></option><option value="scene"></option><option value="detail"></option></select></label>
    <label><span data-label="purpose"></span><select id="purposeFilter"><option value=""></option><option value="motion"></option><option value="cinematic"></option><option value="setup"></option></select></label>
    <label><span data-label="lens"></span><select id="lensFilter"><option value="50">50mm F1.8 OSS · APS-C ≈ 75mm</option></select></label></div>
    <div class="field-shortcuts" id="fieldShortcuts"></div><p id="lensNote"></p>
    <details><summary id="preflightTitle"></summary><div class="preflight-columns"><fieldset><legend id="photoLegend"></legend><div id="photoPreflight"></div></fieldset><fieldset><legend id="videoLegend"></legend><div id="videoPreflight"></div></fieldset></div><p id="savedStatus" role="status"></p><button type="button" id="resetPreflight"></button></details></div></details>
    <section id="searchResults" hidden aria-label="Search results"><p id="resultCount" role="status" aria-live="polite"></p><div id="resultList"></div></section>`;
  const $ = id => document.getElementById(id);
  const photoItems=[['battery','Battery charged and spare ready','Pin đầy và có pin dự phòng'],['card','Card has space; important files backed up','Thẻ còn chỗ; đã sao lưu ảnh quan trọng'],['lens','Lens clean, cap removed, OSS checked','Ống kính sạch, bỏ nắp, kiểm tra OSS'],['exposure','Check shutter, aperture, ISO and highlights','Kiểm tra tốc độ, khẩu độ, ISO và highlight'],['focus','Choose focus mode and area for subject movement','Chọn chế độ và vùng nét theo chuyển động'],['test','Take a test photo and inspect sharpness','Chụp thử và phóng lớn kiểm tra nét']];
  const videoItems=[['battery','Battery and card space checked','Kiểm tra pin và dung lượng thẻ'],['record','Confirm recording format and frame rate','Xác nhận định dạng và tốc độ khung hình'],['exposure','Set shutter, aperture, ISO; check highlights','Đặt tốc độ, khẩu độ, ISO; kiểm tra highlight'],['focus','Confirm focus and lock white balance for the sequence','Kiểm tra nét, khóa WB cho chuỗi cảnh'],['sound','Record and listen to a short sound test','Quay và nghe thử âm thanh'],['test','Record a short clip and review motion and focus','Quay thử và xem chuyển động, độ nét']];
  let state=read('a6000-field-preflight-v1',{});
  if(!state||typeof state!=='object'||Array.isArray(state))state={};
  function renderChecklist(id,items,mode){
    $(id).replaceChildren();
    items.forEach(([key,en,vn])=>{
      const label=document.createElement('label'),box=document.createElement('input'),span=document.createElement('span');
      box.type='checkbox';box.checked=state[mode+'.'+key]===true;span.textContent=t(en,vn);
      box.addEventListener('change',()=>{state[mode+'.'+key]=box.checked;const ok=save('a6000-field-preflight-v1',state);$('savedStatus').textContent=ok?t('Saved on this device.','Đã lưu trên thiết bị này.'):t('Storage unavailable; checks last for this session.','Không lưu được; trạng thái chỉ giữ trong phiên này.');});
      label.append(box,span);$(id).append(label);
    });
  }
  const patterns={low:/night|low light|indoor|cafe|thieu sang|dem|trong nha/,sun:/sun|daylight|backlight|nang|ngoai troi/,soft:/overcast|cloudy|shade|rain|may|mua/,people:/portrait|people|walker|action|group|chan dung|nguoi/,scene:/road|street|travel|trees|landscape|duong|canh|cay/,detail:/food|cafe|aquarium|detail|fish|do an|be ca|chi tiet/,motion:/movement|moving|action|walker|motion|chuyen dong/,cinematic:/cinematic|b-roll|b roll|sequence|dien anh/,setup:/setup|memory|controls|checklist|guide|thiet lap|huong dan/};
  function navigate(action){
    const match=action?.match(/^(showScreen|showScenario|showFieldCase|showVideoFieldCase|openVideoPreset)\('([^']+)'\)/);
    if(!match)return;
    if(match[1]==='openVideoPreset')showScreen('video');
    window[match[1]](match[2]);
    $('globalSearch').value='';['mode','light','subject','purpose'].forEach(n=>$(n+'Filter').value='');renderResults();
    $('fieldPanel').open=false;
  }
  function renderResults(){
    const q=normalize($('globalSearch').value).trim();
    const filters=['mode','light','subject','purpose'].map(n=>$(n+'Filter').value);
    $('searchResults').hidden=!q&&!filters.some(Boolean);
    if($('searchResults').hidden)return;
    const words=q.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
    const hits=catalog.filter(c=>{
      const tokens=c.haystack.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
      return (!filters[0]||filters[0]===c.mode)&&words.every(w=>tokens.some(token=>token===w||(w.length>=3&&token.startsWith(w))))&&filters.slice(1).every(f=>!f||patterns[f].test(c.haystack));
    });
    $('resultCount').textContent=hits.length?t(`${hits.length} results · choose one to open`,`${hits.length} kết quả · chọn để mở`):t('No results. Clear a filter or try another word.','Không có kết quả. Bỏ bớt bộ lọc hoặc thử từ khác.');
    $('resultList').replaceChildren();
    hits.forEach(c=>{const btn=document.createElement('button');btn.type='button';const localized=textOf(c.node?.querySelector('.card-title,.field-case-title,.video-preset-title'));btn.textContent=(c.mode==='photo'?'📸 ':'🎥 ')+(localized||c.title);btn.addEventListener('click',()=>navigate(c.action));$('resultList').append(btn);});
  }
  function renderLanguage(){
    $('releaseLabel').textContent=window.A6000_RELEASE.version;
    root.querySelector('.field-search-label').textContent=t('Find a shot or guide','Tìm cảnh chụp hoặc hướng dẫn');
    $('globalSearch').placeholder=t('Try: cafe, morning, night, aquarium…','Thử: cà phê, buổi sáng, đêm, bể cá…');
    $('clearSearch').textContent=t('Clear','Xóa tìm kiếm');$('checkUpdate').textContent=t('Check update','Kiểm tra cập nhật');
    $('toolsSummary').textContent=t('Filters · field workflows · preflight','Bộ lọc · quy trình thực địa · kiểm tra trước khi chụp');
    const labels={mode:['Mode','Chế độ'],light:['Light','Ánh sáng'],subject:['Subject','Chủ thể'],purpose:['Purpose','Mục đích'],lens:['Lens','Ống kính']};
    for(const [key,value] of Object.entries(labels))root.querySelector(`[data-label="${key}"]`).textContent=t(...value);
    root.querySelectorAll('option[value=""]').forEach(n=>n.textContent=t('All','Tất cả'));
    const options={low:['Low light / indoors','Thiếu sáng / trong nhà'],sun:['Sun / outdoors','Nắng / ngoài trời'],soft:['Soft light / rain','Ánh sáng dịu / mưa'],people:['People / motion','Người / chuyển động'],scene:['Street / landscape','Đường phố / phong cảnh'],detail:['Food / details / aquarium','Đồ ăn / chi tiết / bể cá'],motion:['Freeze / follow movement','Bắt / theo chuyển động'],cinematic:['Cinematic sequence','Chuỗi cảnh điện ảnh'],setup:['Setup / learn','Thiết lập / học sử dụng']};
    for(const [key,value] of Object.entries(options))root.querySelector(`option[value="${key}"]`).textContent=t(...value);
    $('lensNote').textContent=t('This guide is for the A6000 + 50mm F1.8 OSS. All results use this lens; no lens change is required.','Hướng dẫn dành cho A6000 + 50mm F1.8 OSS. Mọi kết quả dùng ống kính này; không cần đổi lens.');
    $('preflightTitle').textContent=t('Before you shoot — saved checklists','Trước khi chụp / quay — checklist được lưu');$('photoLegend').textContent='Photo';$('videoLegend').textContent='Video';
    $('savedStatus').textContent=t('Checks are saved on this device when storage is available.','Trạng thái được lưu trên thiết bị này khi bộ nhớ khả dụng.');
    $('resetPreflight').textContent=t('Start a new session','Bắt đầu buổi chụp mới');
    renderChecklist('photoPreflight',photoItems,'photo');renderChecklist('videoPreflight',videoItems,'video');
    $('fieldShortcuts').replaceChildren();
    [['5-minute setup','Thiết lập 5 phút',"showScreen('quicksetup')"],['Outdoor photo','Ảnh ngoài trời',"showScenario('travel')"],['Moving subject','Chủ thể chuyển động',"showScenario('action')"],['Low-light photo','Ảnh thiếu sáng',"showScenario('night')"],['Cinematic video','Quay điện ảnh',"openVideoPreset('videoPresetV1')"],['Moving video','Quay chuyển động',"openVideoPreset('videoPresetV6')"],['Low-light video','Quay thiếu sáng',"openVideoPreset('videoPresetV3')"]].forEach(([en,vn,action])=>{const b=document.createElement('button');b.type='button';b.textContent=t(en,vn);b.addEventListener('click',()=>navigate(action));$('fieldShortcuts').append(b);});
    renderResults();
  }
  $('globalSearch').addEventListener('input',renderResults);
  $('globalSearch').addEventListener('keydown',e=>{if(e.key==='Escape')$('clearSearch').click();});
  root.querySelectorAll('select').forEach(n=>n.addEventListener('change',renderResults));
  $('clearSearch').addEventListener('click',()=>{$('globalSearch').value='';root.querySelectorAll('select:not(#lensFilter)').forEach(n=>n.value='');renderResults();$('globalSearch').focus();});
  $('resetPreflight').addEventListener('click',()=>{if(!confirm(t('Clear only these field preflight checks for a new session?','Xóa dấu chọn của checklist thực địa để bắt đầu buổi mới?')))return;state={};save('a6000-field-preflight-v1',state);renderLanguage();});
  const oldSetLang=window.setLang;
  window.setLang=lang=>{oldSetLang(lang);renderLanguage();};
  let lang='en';try {lang=localStorage.getItem('a6000-language')==='vi'?'vi':'en';}catch{}
  setLang(lang);
  // Preserve existing tap handlers and give their card controls keyboard access.
  document.querySelectorAll('div[onclick]').forEach(n=>{n.tabIndex=0;n.setAttribute('role','button');n.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target===n){e.preventDefault();n.click();}});});
})();
