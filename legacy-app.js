
let currentLang = 'en';

function setLang(lang) {
  currentLang = lang;
  document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.lang-btn').forEach((btn,i)=>btn.classList.toggle('active',i === (lang === 'vi' ? 1 : 0)));
  try {localStorage.setItem('a6000-language',lang);} catch {}
  document.documentElement.lang=lang;

  document.querySelectorAll('[data-en]').forEach(el => {
    const text = lang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-vi');
    if (text === null) return;
    if (el.tagName === 'INPUT') {
      el.placeholder = text;
    } else {
      el.innerHTML = text;
    }
  });
}

function setMainTab(tab) {
  const photoTab = document.getElementById('photoTab');
  const videoTab = document.getElementById('videoTab');
  if (photoTab) photoTab.classList.toggle('active', tab === 'photo');
  if (videoTab) videoTab.classList.toggle('active', tab === 'video');
}

function showScreen(screenName) {
  // Hide all screens
  document.getElementById('homeScreen').style.display = 'none';
  document.querySelectorAll('.scenario-card').forEach(card => card.classList.remove('active'));
  document.getElementById('memoryScreen').classList.remove('active');
  document.getElementById('setupScreen').classList.remove('active');
  document.getElementById('guideScreen').classList.remove('active');
  document.getElementById('controlsScreen').classList.remove('active');
  document.getElementById('firstdayScreen').classList.remove('active');
  document.getElementById('quicksetupScreen').classList.remove('active');
  const weatherScreen = document.getElementById('weatherScreen');
  if (weatherScreen) weatherScreen.classList.remove('active');
  const fieldCasesScreen = document.getElementById('fieldCasesScreen');
  if (fieldCasesScreen) fieldCasesScreen.classList.remove('active');
  const nightLitSubjectCard = document.getElementById('nightLitSubjectCard');
  if (nightLitSubjectCard) nightLitSubjectCard.classList.remove('active');
  const videoScreen = document.getElementById('videoScreen');
  if (videoScreen) videoScreen.classList.remove('active');
  const videoFieldCasesScreen = document.getElementById('videoFieldCasesScreen');
  if (videoFieldCasesScreen) videoFieldCasesScreen.classList.remove('active');

  // Show requested screen
  if (screenName === 'home') {
    document.getElementById('homeScreen').style.display = 'block';
    setMainTab('photo');
  } else if (screenName === 'video') {
    if (videoScreen) videoScreen.classList.add('active');
    setMainTab('video');
  } else if (screenName === 'videofieldcases') {
    if (videoFieldCasesScreen) videoFieldCasesScreen.classList.add('active');
    setMainTab('video');
  } else if (screenName === 'weather') {
    if (weatherScreen) weatherScreen.classList.add('active');
  } else if (screenName === 'fieldcases') {
    if (fieldCasesScreen) fieldCasesScreen.classList.add('active');
  } else if (screenName === 'memory') {
    document.getElementById('memoryScreen').classList.add('active');
  } else if (screenName === 'setup') {
    document.getElementById('setupScreen').classList.add('active');
  } else if (screenName === 'guide') {
    document.getElementById('guideScreen').classList.add('active');
  } else if (screenName === 'controls') {
    document.getElementById('controlsScreen').classList.add('active');
  } else if (screenName === 'firstday') {
    document.getElementById('firstdayScreen').classList.add('active');
  } else if (screenName === 'quicksetup') {
    document.getElementById('quicksetupScreen').classList.add('active');
  }

  window.scrollTo(0, 0);
}

function showScenario(scenarioName) {
  showScreen('none');
  document.getElementById('homeScreen').style.display = 'none';
  setMainTab('photo');
  document.querySelectorAll('.scenario-card').forEach(card => card.classList.remove('active'));
  document.getElementById(scenarioName + 'Card').classList.add('active');
  window.scrollTo(0, 0);
}

function showFieldCase(caseName) {
  showScreen('none');
  document.getElementById('homeScreen').style.display = 'none';
  setMainTab('photo');
  document.querySelectorAll('.scenario-card').forEach(card => card.classList.remove('active'));
  const target = document.getElementById(caseName + 'Card');
  if (target) target.classList.add('active');
  window.scrollTo(0, 0);
}

function normalizeSearchText(value) {
  return (value || '').toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function filterFieldCases(query) {
  const q = normalizeSearchText(query).trim();
  const cards = document.querySelectorAll('#fieldCaseGrid .field-case-btn');
  let visible = 0;
  cards.forEach(card => {
    const haystack = normalizeSearchText((card.dataset.keywords || '') + ' ' + (card.innerText || ''));
    const match = !q || haystack.includes(q);
    card.style.display = match ? '' : 'none';
    if (match) visible++;
  });
  const empty = document.getElementById('fieldCaseEmpty');
  if (empty) empty.style.display = visible ? 'none' : 'block';
}

function filterVideoCases(query) {
  const q = normalizeSearchText(query).trim();
  const cards = document.querySelectorAll('#videoCaseGrid .video-case-btn');
  cards.forEach(card => {
    const haystack = normalizeSearchText((card.dataset.keywords || '') + ' ' + (card.innerText || ''));
    card.style.display = (!q || haystack.includes(q)) ? '' : 'none';
  });
}

function filterVideoFieldCases(query) {
  const q = normalizeSearchText(query).trim();
  const cards = document.querySelectorAll('#videoFieldCaseGrid .field-case-btn');
  const empty = document.getElementById('videoFieldCaseEmpty');
  let visible = 0;
  cards.forEach(card => {
    const haystack = normalizeSearchText((card.dataset.keywords || '') + ' ' + (card.innerText || ''));
    const match = !q || haystack.includes(q);
    card.style.display = match ? '' : 'none';
    if (match) visible++;
  });
  if (empty) empty.style.display = visible ? 'none' : 'block';
}

function showVideoFieldCase(name) {
  showScreen('videofieldcases');
  const detail = document.getElementById('videoFieldCaseDetail');
  if (!detail) return;
  const data = window.VIDEO_FIELD_CASES;
  const d=data[name]; if(!d)return;
  detail.innerHTML='<div class="video-field-detail-card"><button class="back-btn video-field-detail-back" onclick="clearVideoFieldCase()">← <span data-en="Back to Video Field Cases" data-vi="Quay lại Thư Viện Video">Back to Video Field Cases</span></button><h3>'+d.title+'</h3>'+d.html+'</div>';
  detail.scrollIntoView({behavior:'smooth',block:'start'});
}

function clearVideoFieldCase(){ const d=document.getElementById('videoFieldCaseDetail'); if(d)d.innerHTML=''; window.scrollTo({top:0,behavior:'smooth'}); }

function openVideoPreset(id) {
  const card = document.getElementById(id);
  if (!card) return;
  const details = card.querySelector('.video-preset-details');
  if (details) details.open = true;
  card.scrollIntoView({behavior:'smooth', block:'center'});
}

function toggleVideoPreflight(element) {
  element.classList.toggle('checked');
  const states = {};
  document.querySelectorAll('#videoPreflightChecklist .video-preflight-item').forEach(item => {
    states[item.dataset.videoCheck] = item.classList.contains('checked');
  });
  try {localStorage.setItem('a6000-video-preflight', JSON.stringify(states));} catch {}
}

function loadVideoPreflight() {
  try {
    const saved = JSON.parse(localStorage.getItem('a6000-video-preflight') || '{}');
    document.querySelectorAll('#videoPreflightChecklist .video-preflight-item').forEach(item => {
      if (saved[item.dataset.videoCheck]) item.classList.add('checked');
    });
  } catch (e) {}
}

function focusVideoSection(id) {
  const target = document.getElementById(id);
  if (target) target.scrollIntoView({behavior:'smooth', block:'center'});
}

function toggleExpand(id) {
  const content = document.getElementById(id);
  const button = event.target.closest('.expand-toggle');

  if (content.classList.contains('expanded')) {
    content.classList.remove('expanded');
    button.classList.remove('expanded');
  } else {
    content.classList.add('expanded');
    button.classList.add('expanded');
  }
}

function toggleCheck(element) {
  element.classList.toggle('checked');

  // Save to localStorage
  const checklistItems = document.querySelectorAll('.checklist-item');
  const checkedStates = [];
  checklistItems.forEach((item, index) => {
    checkedStates.push(item.classList.contains('checked'));
  });
  try {localStorage.setItem('a6000-checklist', JSON.stringify(checkedStates));} catch {}
}

// Load checklist state on page load
window.addEventListener('DOMContentLoaded', function() {
  let savedStates; try {savedStates=localStorage.getItem('a6000-checklist');} catch {} 
  if (savedStates) {
    let states; try {states=JSON.parse(savedStates);} catch {return;}
    if (!Array.isArray(states)) return;
    const checklistItems = document.querySelectorAll('.checklist-item');
    checklistItems.forEach((item, index) => {
      if (states[index]) {
        item.classList.add('checked');
      }
    });
  }
});
window.addEventListener('DOMContentLoaded', loadVideoPreflight);
