(() => {
  const loadedVersion = window.A6000_RELEASE.version;
  const button = document.getElementById('checkUpdate');
  const notice = document.getElementById('updateNotice');
  const label = document.getElementById('releaseLabel');
  const t = (en,vi) => document.documentElement.lang === 'vi' ? vi : en;
  let registration, refreshRequested = false, checking = false;
  function status(text) { label.textContent = loadedVersion + ' · ' + text; }
  function offerUpdate() {
    if (!registration?.waiting || !registration.active) return;
    notice.replaceChildren();notice.hidden=false;
    const message=document.createElement('span');message.textContent=t('A new version is ready. Your saved checklists will be kept.','Có phiên bản mới. Checklist đã lưu sẽ được giữ lại.');
    const apply=document.createElement('button');apply.type='button';apply.textContent=t('Update now','Cập nhật ngay');
    apply.onclick=()=>{if(!registration.waiting)return;refreshRequested=true;apply.disabled=true;registration.waiting.postMessage({type:'SKIP_WAITING'});};
    const later=document.createElement('button');later.type='button';later.textContent=t('Later','Để sau');later.onclick=()=>{notice.hidden=true;};
    notice.append(message,apply,later);
  }
  async function check() {
    if (checking) return;
    checking=true;button.disabled=true;status(t('Checking…','Đang kiểm tra…'));
    try {
      if (!navigator.onLine) throw new Error('offline');
      await registration?.update();
      const response=await fetch(new URL('version.json',document.baseURI),{cache:'no-store'});
      if(!response.ok)throw new Error('HTTP '+response.status);
      const data=await response.json();
      if(typeof data.version!=='string')throw new Error('Invalid release metadata');
      status(data.version===loadedVersion?t('Up to date','Đã cập nhật'):t('New release: '+data.version,'Bản mới: '+data.version));
      offerUpdate();
    } catch (error) {status(navigator.onLine?t('Update check unavailable; try again','Chưa kiểm tra được; hãy thử lại'):t('Offline','Ngoại tuyến'));}
    finally {checking=false;button.disabled=false;}
  }
  button.addEventListener('click',check);
  window.addEventListener('online',check);
  window.addEventListener('offline',()=>status(t('Offline','Ngoại tuyến')));
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')check();});
  if ('serviceWorker' in navigator && window.isSecureContext) {
    navigator.serviceWorker.addEventListener('controllerchange',()=>{notice.hidden=true;if(refreshRequested)location.reload();});
    navigator.serviceWorker.register('./service-worker.js',{updateViaCache:'none'}).then(reg=>{
      registration=reg;offerUpdate();
      reg.addEventListener('updatefound',()=>{const worker=reg.installing;worker?.addEventListener('statechange',()=>{if(worker.state==='installed')offerUpdate();});});
      check();
    }).catch(error=>{status(t('Offline setup unavailable','Chưa thiết lập được ngoại tuyến'));console.warn('[A6000] Service worker registration failed:',error);});
  } else {status(t('Offline mode requires HTTPS or localhost','Ngoại tuyến cần HTTPS hoặc localhost'));}
})();
