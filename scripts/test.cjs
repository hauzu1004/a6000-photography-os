const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const {JSDOM}=require('jsdom');
async function ui(){
 const dom=new JSDOM(fs.readFileSync('index.html','utf8'),{url:'https://example.test/a6000-photography-os/',runScripts:'outside-only',pretendToBeVisual:true});
 const w=dom.window;w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};w.confirm=()=>true;
 w.localStorage.setItem('a6000-checklist','broken-json');
 for(const file of ['field-cases.js','legacy-app.js','release.js','field-tools.js'])w.eval(fs.readFileSync(file,'utf8'));
 w.document.dispatchEvent(new w.Event('DOMContentLoaded'));
 assert.ok(w.document.getElementById('homeScreen').contains(w.document.querySelector('.photo-os-hero')));
 w.showScreen('video');assert.equal(w.document.getElementById('homeScreen').style.display,'none');
 w.showFieldCase('morningWarmRoad');assert.ok(w.document.getElementById('morningWarmRoadCard').classList.contains('active'));assert.ok(!w.document.getElementById('videoScreen').classList.contains('active'));
 const search=w.document.getElementById('globalSearch');search.value='aquarium';search.dispatchEvent(new w.Event('input'));
 const results=[...w.document.querySelectorAll('#resultList button')];assert.ok(results.some(n=>n.textContent.includes('Aquarium')),'Search finds hidden cases');
 results.find(n=>n.textContent.startsWith('🎥')).click();assert.ok(w.document.getElementById('videoFieldCaseDetail').textContent.includes('AQUARIUM'));
 search.value='zzzz-nonexistent';search.dispatchEvent(new w.Event('input'));assert.equal(w.document.querySelectorAll('#resultList button').length,0);
 w.document.getElementById('clearSearch').click();assert.ok(w.document.getElementById('searchResults').hidden);
 const check=w.document.querySelector('#photoPreflight input');check.click();assert.equal(JSON.parse(w.localStorage.getItem('a6000-field-preflight-v1'))['photo.battery'],true);
 w.setLang('vi');assert.equal(w.document.documentElement.lang,'vi');assert.equal(w.document.querySelector('#photoPreflight input').checked,true);
 search.value='be ca';search.dispatchEvent(new w.Event('input'));assert.ok(w.document.querySelectorAll('#resultList button').length>0,'Vietnamese search without accents');
 const mode=w.document.getElementById('modeFilter');mode.value='video';mode.dispatchEvent(new w.Event('change'));assert.ok([...w.document.querySelectorAll('#resultList button')].every(n=>n.textContent.startsWith('🎥')));
 w.close();console.log('Navigation, bilingual search, filters, checklists, corrupt storage: PASS');
}
async function worker(){
 const handlers={},entries=new Map(),deleted=[],requests=[];let skipped=0,claimed=0;
 const base='https://example.test/a6000-photography-os/';
 const cache={addAll:async list=>{for(const r of list){assert.ok(r.url.startsWith(base));entries.set(r.url,{shell:true});}},match:async r=>entries.get(typeof r==='string'?r:r.url),put:async(r,res)=>entries.set(r.url,res)};
 const caches={open:async()=>cache,keys:async()=>['unrelated','a6000-os-v19.0.0'],delete:async name=>{deleted.push(name);}};
 const context={URL,Request,console,caches,fetch:async(r,opts)=>{requests.push({r,opts});return {ok:true,type:'basic',clone(){return this;}};},self:{location:{href:base+'service-worker.js'},addEventListener:(n,cb)=>handlers[n]=cb,skipWaiting:async()=>{skipped++;},clients:{claim:async()=>{claimed++;}}}};
 vm.runInNewContext(fs.readFileSync('service-worker.js','utf8'),context);
 async function lifecycle(name){let task;handlers[name]({waitUntil:p=>task=p});await task;}
 await lifecycle('install');assert.ok(entries.has(base+'field-tools.js'));assert.equal(skipped,1);
 await lifecycle('activate');assert.equal(claimed,1);assert.deepEqual(deleted,['a6000-os-v19.0.0']);
 async function get(url,method='GET',mode='cors'){let response;handlers.fetch({request:{url,method,mode},respondWith:p=>response=p});return await response;}
 for(const url of ['chrome-extension://abc/file.js','https://other.test/file','https://example.test/other/file'])assert.equal(await get(url),undefined);
 assert.equal(await get(base+'index.html','POST'),undefined);
 const n=requests.length;assert.equal((await get(base+'?search=morning','GET','navigate')).shell,true);assert.equal(requests.length,n,'Offline navigation uses cache');
 await get(base+'version.json');assert.equal(requests.at(-1).opts.cache,'no-store');
 let task;handlers.message({data:{type:'SKIP_WAITING'},waitUntil:p=>task=p});await task;assert.equal(skipped,2);
 console.log('Precache, migration, unrelated cache preservation, extension/POST guards, offline navigation, version freshness: PASS');
}
async function updateFlow(){
 const dom=new JSDOM('<button id="checkUpdate"></button><div id="updateNotice" hidden></div><span id="releaseLabel"></span>',{url:'https://example.test/app/',runScripts:'outside-only'}),w=dom.window;
 const handlers={},sent=[];const reg={active:null,waiting:{postMessage:m=>sent.push(m)},update:async()=>{},addEventListener:(n,cb)=>handlers[n]=cb};
 w.A6000_RELEASE={version:'v21.0.0'};Object.defineProperty(w,'isSecureContext',{value:true});Object.defineProperty(w.navigator,'serviceWorker',{value:{register:async()=>reg,addEventListener:()=>{}}});
 w.fetch=async()=>({ok:true,json:async()=>({version:'v21.0.1'})});
 w.eval(fs.readFileSync('pwa.js','utf8'));await new Promise(r=>setImmediate(r));
 assert.ok(w.document.getElementById('updateNotice').hidden,'First install must not show update prompt');
 assert.ok(w.document.getElementById('releaseLabel').textContent.startsWith('v21.0.0'),'Loaded version is not replaced by remote version');
 reg.active={};w.document.getElementById('checkUpdate').click();await new Promise(r=>setImmediate(r));
 assert.ok(!w.document.getElementById('updateNotice').hidden);w.document.querySelector('#updateNotice button').click();assert.equal(sent[0].type,'SKIP_WAITING');
 w.close();console.log('First installation, loaded/remote version distinction, user-controlled update: PASS');
}
ui().then(worker).then(updateFlow).catch(e=>{console.error(e);process.exitCode=1;});
