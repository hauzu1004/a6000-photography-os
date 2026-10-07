const fs=require('fs'),path=require('path');
require('./validate.cjs');
const assets=['index.html','app.css','field-tools.css','legacy-app.js','field-cases.js','field-tools.js','pwa.js','release.js','manifest.json','service-worker.js','version.json','icon-192.png','icon-512.png','icon.svg'];
fs.mkdirSync('dist',{recursive:true});
for(const file of assets)fs.copyFileSync(file,path.join('dist',file));
fs.writeFileSync('dist/.nojekyll','');
console.log('Staged '+assets.length+' production files in dist/');
