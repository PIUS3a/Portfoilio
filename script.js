// ══════════════════════════════════════
// SHADER / STARFIELD
// ══════════════════════════════════════
const canvas = document.getElementById('shader');
const ctx    = canvas.getContext('2d');
let stars    = [];
let mouse    = { x: 0, y: 0 };

function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }

function initStars() {
  stars = [];
  for (let i = 0; i < 200; i++) {
    stars.push({ x: Math.random()*canvas.width, y: Math.random()*canvas.height, r: Math.random()*1.5+0.2, speed: Math.random()*0.15+0.02, opacity: Math.random()*0.7+0.2, flicker: Math.random()*0.007, gold: Math.random()<0.1, ox:0, oy:0 });
  }
}

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const aurora = ctx.createLinearGradient(0,0,canvas.width,0);
  aurora.addColorStop(0,'rgba(74,222,128,0.00)'); aurora.addColorStop(0.3,'rgba(74,222,128,0.03)');
  aurora.addColorStop(0.7,'rgba(251,191,36,0.03)'); aurora.addColorStop(1,'rgba(74,222,128,0.00)');
  ctx.fillStyle = aurora; ctx.fillRect(0,0,canvas.width,180);
  stars.forEach(s => {
    s.opacity += s.flicker;
    if (s.opacity>.92||s.opacity<.1) s.flicker*=-1;
    const dx=(mouse.x-canvas.width/2)*0.003, dy=(mouse.y-canvas.height/2)*0.003;
    s.ox+=(dx-s.ox)*0.05*s.r; s.oy+=(dy-s.oy)*0.05*s.r;
    ctx.beginPath(); ctx.arc(s.x+s.ox,s.y+s.oy,s.r,0,Math.PI*2);
    ctx.fillStyle=s.gold?`rgba(251,191,36,${s.opacity})`:`rgba(180,230,190,${s.opacity})`;
    ctx.fill();
    if (s.r>1.1) { ctx.beginPath(); ctx.arc(s.x+s.ox,s.y+s.oy,s.r*2.5,0,Math.PI*2); ctx.fillStyle=s.gold?`rgba(251,191,36,${s.opacity*0.15})`:`rgba(74,222,128,${s.opacity*0.1})`; ctx.fill(); }
    s.y-=s.speed;
    if (s.y<-2) { s.y=canvas.height+2; s.x=Math.random()*canvas.width; }
  });
  requestAnimationFrame(drawStars);
}
resize(); initStars(); drawStars();
window.addEventListener('resize',()=>{resize();initStars();});
window.addEventListener('mousemove',e=>{mouse.x=e.clientX;mouse.y=e.clientY;});

// ══════════════════════════════════════
// PROGRESS BAR
// ══════════════════════════════════════
const progressBar = document.getElementById('progress-bar');
window.addEventListener('scroll',()=>{
  const pct=(window.scrollY/(document.documentElement.scrollHeight-window.innerHeight))*100;
  progressBar.style.width=pct+'%';
});

// ══════════════════════════════════════
// NAVBAR
// ══════════════════════════════════════
const navbar = document.getElementById('navbar');
window.addEventListener('scroll',()=>navbar.classList.toggle('scrolled',window.scrollY>60));

// ══════════════════════════════════════
// MOBILE SIDEBAR
// ══════════════════════════════════════
const hamburger      = document.getElementById('hamburger');
const sidebar        = document.getElementById('sidebar');
const sidebarClose   = document.getElementById('sidebarClose');
const sidebarOverlay = document.getElementById('sidebarOverlay');

function openSidebar(){sidebar.classList.add('open');sidebarOverlay.classList.add('show');document.body.style.overflow='hidden';}
function closeSidebar(){sidebar.classList.remove('open');sidebarOverlay.classList.remove('show');document.body.style.overflow='';}

hamburger.addEventListener('click',openSidebar);
sidebarClose.addEventListener('click',closeSidebar);
sidebarOverlay.addEventListener('click',closeSidebar);
document.querySelectorAll('.s-link').forEach(l=>l.addEventListener('click',closeSidebar));

// ══════════════════════════════════════
// TYPEWRITER
// ══════════════════════════════════════
const roles=['Python Developer','Data Analyst','AI Engineer','ML Enthusiast'];
let roleIndex=0,charIndex=0,isDeleting=false;
const roleEl=document.getElementById('roleText');

function typeRole(){
  const current=roles[roleIndex];
  charIndex+=isDeleting?-1:1;
  roleEl.textContent=current.substring(0,charIndex);
  let speed=isDeleting?55:100;
  if(!isDeleting&&charIndex===current.length){speed=1800;isDeleting=true;}
  else if(isDeleting&&charIndex===0){isDeleting=false;roleIndex=(roleIndex+1)%roles.length;speed=400;}
  setTimeout(typeRole,speed);
}
setTimeout(typeRole,1200);

// ══════════════════════════════════════
// SCROLL REVEAL
// ══════════════════════════════════════
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting) entry.target.classList.add('visible');
  });
},{threshold:0.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

// ══════════════════════════════════════
// PROFICIENCY BARS — animate on scroll
// ══════════════════════════════════════
const profObserver = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.querySelectorAll('.prof-fill').forEach((bar,i)=>{
        const target=bar.dataset.w;
        setTimeout(()=>{ bar.style.width=target+'%'; },i*120);
      });
      profObserver.unobserve(entry.target);
    }
  });
},{threshold:0.3});
document.querySelectorAll('.proficiency-wrap').forEach(el=>profObserver.observe(el));

// ══════════════════════════════════════
// SKILL STAGGER
// ══════════════════════════════════════
const skillObs = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.querySelectorAll('.skill-item').forEach((item,i)=>{
        item.style.opacity='0'; item.style.transform='translateY(14px)';
        item.style.transition=`opacity .4s ${i*0.07}s, transform .4s ${i*0.07}s`;
        setTimeout(()=>{item.style.opacity='1';item.style.transform='translateY(0)';},100);
      });
    }
  });
},{threshold:0.2});
document.querySelectorAll('.skill-category').forEach(el=>skillObs.observe(el));

// ══════════════════════════════════════
// ACTIVE NAV
// ══════════════════════════════════════
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll',()=>{
  let current='';
  sections.forEach(sec=>{if(window.scrollY>=sec.offsetTop-120)current=sec.getAttribute('id');});
  navAnchors.forEach(a=>{a.classList.remove('active');if(a.getAttribute('href')==='#'+current)a.classList.add('active');});
});

// ══════════════════════════════════════
// BACK TO TOP
// ══════════════════════════════════════
const backBtn = document.getElementById('back-top');
window.addEventListener('scroll',()=>backBtn.classList.toggle('show',window.scrollY>400));
backBtn.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

// ══════════════════════════════════════
// PROJECT MODAL DATA
// ══════════════════════════════════════
const projectData = {
  movie: {
    title: 'Movie Recommendation System',
    img: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80',
    tags: ['Python','NLP','TF-IDF','Streamlit','Scikit-learn','TMDB API','Google Colab'],
    overview: `A content-based movie recommendation engine built on the TMDB 5000 dataset. The system processes movie metadata — genres, cast, crew, keywords and overviews — and applies NLP techniques to generate intelligent, similarity-based recommendations in real time. Preprocessing and model training performed on Google Colab.`,
    features: [
      'TF-IDF vectorization on combined movie metadata for feature extraction',
      'Cosine similarity matrix to compute pairwise movie relevance scores',
      'NLTK-based lemmatization and stopword removal for cleaner NLP pipeline',
      'Interactive Streamlit single-page app with dynamic movie suggestions',
      'Top-5 similar movie suggestions ranked by similarity score',
      'Google Colab used for data preprocessing, feature engineering and model training'
    ],
    github: 'https://github.com/PIUS3a', demo: null
  },
  messenger: {
    title: 'Secure AI Messenger',
    img: 'https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=800&q=80',
    tags: ['Python','Flask','Socket.IO','WebSocket','SQLite','Gemini API','OTP Auth','Dark UI'],
    overview: `A full-stack, real-time AI chat application built with Flask and Socket.IO. Features a secure email OTP login system, persistent message storage in SQLite, and Gemini AI integration for intelligent conversational responses — all running locally without sharing user data online.`,
    features: [
      'Real-time bidirectional messaging via Flask-SocketIO and WebSocket protocol',
      'Email OTP authentication using SMTP — no third-party auth services needed',
      'Google Gemini API integration for contextual AI replies within chat',
      'SQLite database for persistent user accounts and full message history',
      'Clean dark-mode responsive interface built with HTML/CSS/JS',
      'Session-based secure login flow with OTP expiry handling'
    ],
    github: 'https://github.com/PIUS3a', demo: null
  },
  pdf: {
    title: 'AI-Powered PDF Summarizer',
    img: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=800&q=80',
    tags: ['Python','LangChain','Gemini API','Streamlit','PyPDF2','GenAI'],
    overview: `An AI-powered document assistant that allows users to upload any PDF and receive instant, concise summaries generated by Google Gemini via LangChain document chains. Designed to save time for students, professionals and researchers dealing with large documents.`,
    features: [
      'PDF text extraction and chunking via PyPDF2 and LangChain document loaders',
      'Google Gemini API integration for high-quality natural language summaries',
      'LangChain summarize chain for structured document processing',
      'Streamlit UI for drag-and-drop PDF upload and instant output display',
      'Handles multi-page PDFs with token-aware chunking strategy',
      'Deployed as a local web app — no data sent to external servers'
    ],
    github: 'https://github.com/PIUS3a', demo: null
  },
  expense: {
    title: 'Expense Tracker & Analyzer',
    img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
    tags: ['Python','Streamlit','Pandas','Plotly','Data Analytics','CSV'],
    overview: `A personal finance analytics tool that transforms raw expense data into actionable visual insights. Built with Python and Streamlit, it lets users track spending across categories, identify patterns, and view monthly breakdowns through interactive Plotly charts.`,
    features: [
      'CSV-based expense ingestion with automatic date parsing and category mapping',
      'Interactive Plotly bar, pie and line charts for multi-dimensional spend analysis',
      'Monthly and category-level summaries with percentage breakdowns',
      'Filter by date range, category or amount threshold dynamically',
      'Pandas-powered aggregations for running totals and trend detection',
      'Export filtered data as cleaned CSV for further reporting'
    ],
    github: 'https://github.com/PIUS3a', demo: null
  },
  game: {
    title: '2D Survival Game — PyGame',
    img: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&q=80',
    tags: ['Python','Pygame','OOP','AI Logic','Collision Physics','Game Dev'],
    overview: `A top-down 2D survival game built entirely in Python using the Pygame library. The player navigates a procedurally-arranged level, avoids smart enemies with basic AI pathfinding, collects power-ups, and tries to survive as long as possible. Demonstrates strong OOP and game loop design patterns.`,
    features: [
      'Game loop architecture with fixed delta-time for consistent physics',
      'Enemy AI using simple state-machine: patrol → chase → attack logic',
      'Tile-based collision detection with axis-aligned bounding boxes (AABB)',
      'Score system with difficulty scaling — enemy speed increases over time',
      'Sprite-based rendering with animated player and enemy characters',
      'Sound effects, health bar UI and level progression system'
    ],
    github: 'https://github.com/PIUS3a', demo: null
  },
  tcs: {
    title: 'TCS NQT Preparation — 2025',
    img: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80',
    tags: ['DSA','Aptitude','Python','SQL','Verbal','Reasoning','Problem Solving'],
    overview: `Structured, self-driven preparation for the TCS National Qualifier Test (NQT) 2025. Covers all five NQT sections: Numerical Ability, Verbal Ability, Reasoning Ability, Programming Logic, and Advanced Coding. Tracking progress with mock tests, topic-wise practice and daily Python/DSA problem solving.`,
    features: [
      'Numerical Ability: percentages, ratios, time-work, profit-loss, series',
      'Verbal Ability: reading comprehension, grammar, sentence correction, vocabulary',
      'Reasoning: logical, verbal and non-verbal reasoning with pattern recognition',
      'Programming Logic: flowcharts, pseudocode, basic algorithm tracing',
      'Coding Section: Python DSA — arrays, strings, sorting, searching, recursion',
      'Advanced Coding: data structures (linked lists, trees, graphs) with time complexity focus'
    ],
    github: '#', demo: null
  }
};

// ══════════════════════════════════════
// MODAL LOGIC
// ══════════════════════════════════════
const modal         = document.getElementById('projectModal');
const modalContent  = document.getElementById('modalContent');
const modalClose    = document.getElementById('modalClose');
const modalBackdrop = document.getElementById('modalBackdrop');

function openModal(key){
  const p=projectData[key];
  if(!p) return;
  const demoBtn=p.demo
    ?`<a href="${p.demo}" target="_blank" class="modal-btn-secondary">Live Demo ↗</a>`
    :`<span style="font-family:var(--pixel);font-size:.52rem;color:var(--muted);letter-spacing:.06em;padding:.9rem 1.8rem;border:1px solid var(--border);border-radius:4px;">Demo Coming Soon</span>`;
  modalContent.innerHTML=`
    <img class="modal-hero-img" src="${p.img}" alt="${p.title}"/>
    <div class="modal-tag-row">${p.tags.map(t=>`<span>${t}</span>`).join('')}</div>
    <h2 class="modal-title">${p.title}</h2>
    <p class="modal-section-label">// overview</p>
    <p class="modal-desc">${p.overview}</p>
    <p class="modal-section-label">// key_features</p>
    <ul class="modal-features">${p.features.map(f=>`<li>${f}</li>`).join('')}</ul>
    <div class="modal-btns">
      <a href="${p.github}" target="_blank" class="modal-btn-primary">View on GitHub ↗</a>
      ${demoBtn}
    </div>`;
  modal.classList.add('open');
  document.body.style.overflow='hidden';
}

function closeModal(){
  modal.classList.remove('open');
  document.body.style.overflow='';
}

// Event delegation — works through tilt transforms
document.body.addEventListener('click',e=>{
  const btn=e.target.closest('.details-btn');
  if(btn){e.stopPropagation();openModal(btn.dataset.project);}
});

modalClose.addEventListener('click',closeModal);
modalBackdrop.addEventListener('click',closeModal);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});

// ══════════════════════════════════════
// PROJECT CARD TILT
// ══════════════════════════════════════
document.querySelectorAll('.project-card').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    if(e.target.closest('.details-btn,.project-link,.project-actions')) return;
    const rect=card.getBoundingClientRect();
    const rotateX=((e.clientY-rect.top-rect.height/2)/rect.height*2)*-6;
    const rotateY=((e.clientX-rect.left-rect.width/2)/rect.width*2)*6;
    card.style.transform=`perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave',()=>{card.style.transform='';card.style.transition='transform .4s ease';});
});
