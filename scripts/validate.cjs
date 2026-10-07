const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const {JSDOM}=require('jsdom');
const html=fs.readFileSync('index.html','utf8');
const dom=new JSDOM(html),doc=dom.window.document;
const version=JSON.parse(fs.readFileSync('version.json','utf8')).version;
assert.match(version,/^v\d+\.\d+\.\d+$/);
const scope={window:{}};vm.runInNewContext(fs.readFileSync('release.js','utf8'),scope);
assert.equal(scope.window.A6000_RELEASE.version,version);
assert.ok(fs.readFileSync('service-worker.js','utf8').includes(`const APP_VERSION = '${version}'`));
assert.equal(JSON.parse(fs.readFileSync('package.json','utf8')).version,version.slice(1));
for(const file of fs.readdirSync('.').filter(f=>f.endsWith('.js')))new vm.Script(fs.readFileSync(file,'utf8'),{filename:file});
for(const n of doc.querySelectorAll('script[src],link[href],img[src]')){
 const value=n.getAttribute('src')||n.getAttribute('href');
 if(/^https?:/.test(value))continue;
 assert.ok(!value.startsWith('/'),'Root absolute asset: '+value);
 assert.ok(fs.existsSync(value),'Missing asset: '+value);
}
const manifest=JSON.parse(fs.readFileSync('manifest.json','utf8'));
assert.equal(manifest.start_url,'./');assert.equal(manifest.scope,'./');
for(const icon of manifest.icons)assert.ok(fs.existsSync(icon.src));
const ids=[...doc.querySelectorAll('[id]')].map(n=>n.id);assert.equal(new Set(ids).size,ids.length,'Duplicate IDs');
assert.equal(doc.querySelector('.photo-os-hero').closest('[id]')?.id,'homeScreen');
assert.ok(!doc.getElementById('homeScreen').contains(doc.getElementById('videoScreen')));
console.log('Release, syntax, assets, manifest, IDs and screen boundaries: PASS');
