const fs=require('fs');
const version=process.argv[2],note=process.argv.slice(3).join(' ');
if(!/^v\d+\.\d+\.\d+$/.test(version||'')||!note)throw Error('Usage: npm run release -- v21.0.1 "Release note"');
const metadata=JSON.parse(fs.readFileSync('version.json','utf8'));
const compare=(a,b)=>{const x=a.slice(1).split('.').map(Number),y=b.slice(1).split('.').map(Number);for(let i=0;i<3;i++)if(x[i]!==y[i])return x[i]-y[i];return 0;};
if(compare(version,metadata.version)<=0)throw Error('Use a version newer than '+metadata.version);
metadata.version=version;metadata.buildDate=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Ho_Chi_Minh',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());metadata.changelog.unshift(note);
fs.writeFileSync('version.json',JSON.stringify(metadata,null,2)+'\n');
fs.writeFileSync('release.js',`window.A6000_RELEASE = ${JSON.stringify({version,date:metadata.buildDate})};\n`);
fs.writeFileSync('service-worker.js',fs.readFileSync('service-worker.js','utf8').replace(/const APP_VERSION = '[^']+';/,`const APP_VERSION = '${version}';`));
for(const file of ['package.json','package-lock.json']){const data=JSON.parse(fs.readFileSync(file,'utf8'));data.version=version.slice(1);if(data.packages?.[''])data.packages[''].version=version.slice(1);fs.writeFileSync(file,JSON.stringify(data,null,2)+'\n');}
console.log('Prepared '+version+'. Run npm test && npm run build, review, then commit all release files together.');
