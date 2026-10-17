(() => {
  // Self-heal the update UI if an older cached index.html does not contain it.
  let toolsBar = document.querySelector('.release-tools');
  if (!document.getElementById('checkUpdate')) {
    if (!toolsBar) {
      toolsBar = document.createElement('div');
      toolsBar.className = 'release-tools';
      toolsBar.setAttribute('aria-live', 'polite');
      const nav = document.querySelector('.main-tabs');
      if (nav?.parentNode) nav.parentNode.insertBefore(toolsBar, nav);
      else document.body.prepend(toolsBar);
    }
    if (!document.getElementById('releaseLabel')) {
      const releaseLabel = document.createElement('span');
      releaseLabel.id = 'releaseLabel';
      releaseLabel.className = 'release-label';
      releaseLabel.textContent = 'A6000 OS · ' + (window.A6000_RELEASE?.version || 'update');
      toolsBar.appendChild(releaseLabel);
    }
    const updateButton = document.createElement('button');
    updateButton.id = 'checkUpdate';
    updateButton.className = 'release-update-btn';
    updateButton.type = 'button';
    updateButton.textContent = document.documentElement.lang === 'vi' ? 'Kiểm tra cập nhật' : 'Check Update';
    updateButton.setAttribute('data-en', 'Check Update');
    updateButton.setAttribute('data-vi', 'Kiểm tra cập nhật');
    toolsBar.appendChild(updateButton);
  }
  if (!document.getElementById('updateNotice')) {
    const updateNotice = document.createElement('div');
    updateNotice.id = 'updateNotice';
    updateNotice.className = 'update-notice';
    updateNotice.hidden = true;
    updateNotice.setAttribute('role', 'status');
    const nav = document.querySelector('.main-tabs');
    if (nav?.parentNode) nav.parentNode.insertBefore(updateNotice, nav);
    else document.body.prepend(updateNotice);
  }

  const loadedVersion = window.A6000_RELEASE?.version || 'unknown';
  const button = document.getElementById('checkUpdate');
  const notice = document.getElementById('updateNotice');
  const label = document.getElementById('releaseLabel');
  const t = (en,vi) => document.documentElement.lang === 'vi' ? vi : en;
  let registration, refreshRequested = false, checking = false;
  function status(text) { if (label) label.textContent = loadedVersion + ' · ' + text; }
  function offerUpdate() {
    if (!notice || !registration?.waiting || !registration.active) return;
    notice.replaceChildren();notice.hidden=false;
    const message=document.createElement('span');message.textContent=t('A new version is ready. Your saved checklists will be kept.','Có phiên bản mới. Checklist đã lưu sẽ được giữ lại.');
    const apply=document.createElement('button');apply.type='button';apply.textContent=t('Update now','Cập nhật ngay');
    apply.onclick=()=>{if(!registration.waiting)return;refreshRequested=true;apply.disabled=true;registration.waiting.postMessage({type:'SKIP_WAITING'});};
    const later=document.createElement('button');later.type='button';later.textContent=t('Later','Để sau');later.onclick=()=>{notice.hidden=true;};
    notice.append(message,apply,later);
  }
  async function check() {
    if (checking) return;
    checking=true;if(button)button.disabled=true;status(t('Checking…','Đang kiểm tra…'));
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
    finally {checking=false;if(button)button.disabled=false;}
  }
  if (button) button.addEventListener('click',check);
  window.addEventListener('online',check);
  window.addEventListener('offline',()=>status(t('Offline','Ngoại tuyến')));
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')check();});
  if ('serviceWorker' in navigator && window.isSecureContext) {
    navigator.serviceWorker.addEventListener('controllerchange',()=>{if(notice)notice.hidden=true;if(refreshRequested)location.reload();});
    navigator.serviceWorker.register('./service-worker.js',{updateViaCache:'none'}).then(reg=>{
      registration=reg;offerUpdate();
      reg.addEventListener('updatefound',()=>{const worker=reg.installing;worker?.addEventListener('statechange',()=>{if(worker.state==='installed')offerUpdate();});});
      check();
    }).catch(error=>{status(t('Offline setup unavailable','Chưa thiết lập được ngoại tuyến'));console.warn('[A6000] Service worker registration failed:',error);});
  } else {status(t('Offline mode requires HTTPS or localhost','Ngoại tuyến cần HTTPS hoặc localhost'));}
})();
