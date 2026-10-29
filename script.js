let data = graphExportData;
function normalizeBooks(source) { return source.books.map((b, i) => ({
  id: i + 1, sourceId: b.id, isbn: b.isbn, title: b.title, author: b.author,
  year: b.year, publisher: b.publisher, category: b.category, color: ['#e9dff8','#f7e2e9','#f5e2d2','#dcece7','#e8e5cc','#dce8f5'][i%6],
  cover: ['#8973b7','#bd7896','#b96d51','#648f84','#87885a','#5d80ae'][i%6],
  description: `ข้อมูลหนังสือจากกราฟ Neo4j${b.isbn ? ` (ISBN: ${b.isbn})` : ''}. รายละเอียดเพิ่มเติมขึ้นอยู่กับข้อมูลที่มีใน Dataset`, language: 'ไม่ระบุ'
})); }
let books = normalizeBooks(data);
const pages = [...document.querySelectorAll('.page')];
const navLinks = document.getElementById('navLinks');
const mobileMenu = document.getElementById('mobileMenu');
let searchTerm = '', selectedYear = '', selectedAuthor = '', sortMode = 'title';
function goToPage(pageId) { const target=document.getElementById(pageId); if(!target)return; pages.forEach(p=>p.classList.toggle('active',p.id===pageId)); document.querySelectorAll('[data-page]').forEach(a=>a.classList.toggle('active',a.dataset.page===pageId)); navLinks?.classList.remove('open'); window.scrollTo({top:0,behavior:'smooth'}); if(pageId==='graph')renderGraph('fullGraph'); }
function escapeHTML(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function coverMarkup(b){let t=b.title.length>27?b.title.slice(0,25)+'…':b.title;const coverUrl=b.isbn?`https://covers.openlibrary.org/b/isbn/${encodeURIComponent(b.isbn)}-M.jpg?default=false`:'';return `<div class="book-cover" style="--cover:${b.color};--cover2:${b.cover}">${coverUrl?`<img class="real-cover" loading="lazy" src="${coverUrl}" alt="ปกหนังสือ ${escapeHTML(b.title)}" onload="this.parentElement.classList.add('has-image')" onerror="this.remove()">`:''}<div class="cover-inner"><strong>${escapeHTML(t)}</strong><small>BOOKVERSE</small></div></div>`;}
function bookCard(b){return `<article class="book-card" tabindex="0" role="button" data-book-id="${b.id}">${coverMarkup(b)}<div class="book-card-body"><h3>${escapeHTML(b.title)}</h3><p class="book-author">${escapeHTML(b.author)}</p><div class="book-meta"><span>${escapeHTML(b.year||'ไม่ระบุปี')}</span><span class="category-pill">${escapeHTML(b.isbn||'ไม่มี ISBN')}</span></div></div></article>`;}
function bindBookCards(root=document){root.querySelectorAll('[data-book-id]').forEach(el=>{const open=()=>showBook(Number(el.dataset.bookId));el.addEventListener('click',open);el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});});}
function renderFeatured(){const t=document.getElementById('featuredBooks');if(!t)return;t.innerHTML=books.slice(0,4).map(bookCard).join('');bindBookCards(t);}
function filteredBooks(){const term=searchTerm.trim().toLocaleLowerCase();let r=books.filter(b=>(!term||[b.title,b.author,b.publisher,b.isbn].some(v=>String(v||'').toLocaleLowerCase().includes(term)))&&(!selectedYear||String(b.year)===selectedYear)&&(!selectedAuthor||b.author===selectedAuthor));return r.sort((a,b)=>sortMode==='year-desc'?Number(b.year||0)-Number(a.year||0):sortMode==='year-asc'?Number(a.year||0)-Number(b.year||0):sortMode==='author'?a.author.localeCompare(b.author):a.title.localeCompare(b.title));}
function renderBooks(){const t=document.getElementById('allBooks');if(!t)return;const r=filteredBooks();t.innerHTML=r.map(bookCard).join('');bindBookCards(t);document.getElementById('resultCount').textContent=`พบหนังสือ ${r.length} รายการ จากข้อมูล Book nodes ที่ส่งออกจาก Neo4j`;document.getElementById('emptyState').hidden=!!r.length;}
function populateYears(){const s=document.getElementById('yearSelect');if(s){const years=[...new Set(books.map(b=>b.year).filter(Boolean))].sort((a,b)=>Number(b)-Number(a));years.forEach(y=>{const o=document.createElement('option');o.value=y;o.textContent=y;s.appendChild(o);});}const a=document.getElementById('authorSelect');if(a){const authors=[...new Set(books.map(b=>b.author).filter(v=>v&&v!=='ไม่ระบุผู้แต่ง'))].sort((x,y)=>x.localeCompare(y));authors.forEach(name=>{const o=document.createElement('option');o.value=name;o.textContent=name;a.appendChild(o);});}const statBooks=document.getElementById('statBooks');if(statBooks)statBooks.textContent=books.length.toLocaleString()+' รายการ';const statAuthors=document.getElementById('statAuthors');if(statAuthors)statAuthors.textContent=(data.stats?.authorNodes??new Set(books.map(b=>b.author)).size).toLocaleString()+' คน';const statLinks=document.getElementById('statLinks');if(statLinks)statLinks.textContent=(data.stats?.bookNodes??books.length).toLocaleString()+' เส้น';}
function showBook(id){const b=books.find(x=>x.id===id);if(!b)return;const detailCoverUrl=b.isbn?`https://covers.openlibrary.org/b/isbn/${encodeURIComponent(b.isbn)}-L.jpg?default=false`:'';document.getElementById('bookDetail').innerHTML=`<div class="detail-layout"><div class="detail-cover" style="--cover:${b.color};--cover2:${b.cover}">${detailCoverUrl?`<img class="real-cover" src="${detailCoverUrl}" alt="ปกหนังสือ ${escapeHTML(b.title)}" onload="this.parentElement.classList.add('has-image')" onerror="this.remove()">`:''}<div class="cover-inner"><strong>${escapeHTML(b.title)}</strong><small>BOOKVERSE</small></div></div><div class="detail-copy"><span class="eyebrow">BOOK NODE DETAILS</span><h1>${escapeHTML(b.title)}</h1><div class="detail-author">${escapeHTML(b.author)}</div><p>${escapeHTML(b.description)}</p><div class="detail-facts"><div class="fact"><small>ISBN</small><strong>${escapeHTML(b.isbn||'ไม่ระบุ')}</strong></div><div class="fact"><small>ปีที่พิมพ์</small><strong>${escapeHTML(b.year||'ไม่ระบุ')}</strong></div><div class="fact"><small>สำนักพิมพ์</small><strong>${escapeHTML(b.publisher)}</strong></div><div class="fact"><small>Node ID</small><strong style="overflow-wrap:anywhere">${escapeHTML(b.sourceId)}</strong></div></div><div class="detail-actions"><button class="primary-button" id="seeBookGraph">ดูใน Knowledge Graph ↗</button><button class="outline-button" id="backToList">กลับไปค้นหาหนังสือ</button></div></div></div>`;goToPage('details');document.getElementById('seeBookGraph').addEventListener('click',()=>{goToPage('graph');showGraphInfo('book',b.id);});document.getElementById('backToList').addEventListener('click',()=>goToPage('explore'));}
function graphNodesForDisplay(){
  // Build circular graph from the actual Bloom-export books, authors and relationships.
  const sourceBooks = data.books || [];
  const sourceAuthors = data.authors || [];
  const rels = (data.relationships || []).filter(e => e.type === 'Auther' || e.type === 'author');
  const authorById = new Map(sourceAuthors.map(a => [String(a.id), a]));
  const bookBySourceId = new Map(sourceBooks.map(b => [String(b.id), b]));
  const edges = rels.filter(e => bookBySourceId.has(String(e.from)) && authorById.has(String(e.to))).slice(0, 12);
  const usedBookIds = new Set(edges.map(e => String(e.from)));
  const usedAuthorIds = new Set(edges.map(e => String(e.to)));
  const nodes = [];
  const cx = 400, cy = 250;
  const booksOnRing = [...usedBookIds].map(id => {
    const b = bookBySourceId.get(id);
    const normalized = books.find(x => String(x.sourceId) === id);
    return {id, type:'book', label:b.title || 'ไม่ระบุชื่อ', fullLabel:b.title || 'ไม่ระบุชื่อ', bookId:normalized?.id};
  });
  const authorsOnRing = [...usedAuthorIds].map(id => {
    const a = authorById.get(id);
    return {id, type:'author', label:a.name || 'ไม่ระบุผู้แต่ง', fullLabel:a.name || 'ไม่ระบุผู้แต่ง'};
  });
  const placeOnRing = (list, radius, phase=0) => list.forEach((n,i) => {
    const angle = (Math.PI*2*i/Math.max(list.length,1))-Math.PI/2+phase;
    n.x = cx + Math.cos(angle)*radius; n.y = cy + Math.sin(angle)*radius;
  });
  placeOnRing(booksOnRing, 190, 0);
  placeOnRing(authorsOnRing, 92, Math.PI/Math.max(authorsOnRing.length,1));
  nodes.push(...booksOnRing, ...authorsOnRing);
  return {nodes, edges:edges.map(e=>({from:String(e.from),to:String(e.to)}))};
}
function renderGraph(svgId){
  const svg=document.getElementById(svgId); if(!svg)return;
  const {nodes,edges}=graphNodesForDisplay();
  if(!nodes.length){svg.innerHTML='<text x="400" y="250" text-anchor="middle" fill="#75668d">ไม่พบความสัมพันธ์ Book–Author ในไฟล์ข้อมูล</text>';return;}
  const byId=Object.fromEntries(nodes.map(n=>[n.id,n]));
  const edgeMarkup=edges.map(e=>{const a=byId[e.from],b=byId[e.to];return a&&b?`<line class="graph-edge" x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}"/>`:'';}).join('');
  const guide=`<circle class="graph-ring graph-ring-outer" cx="400" cy="250" r="190"/><circle class="graph-ring graph-ring-inner" cx="400" cy="250" r="92"/><circle class="graph-core" cx="400" cy="250" r="43"/><text class="graph-core-title" x="400" y="246">BOOK</text><text class="graph-core-subtitle" x="400" y="263">VERSE</text>`;
  const nodeMarkup=nodes.map(n=>{
    const isBook=n.type==='book',fill=isBook?'#8974c7':'#d78bab',r=isBook?15:12;
    const label=(n.label||'').length>17?(n.label||'').slice(0,16)+'…':(n.label||'');
    const labelY=n.y+(isBook?27:23);
    return `<g class="graph-node ${isBook?'book-node':'author-node'}" tabindex="0" role="button" data-node-id="${escapeHTML(n.id)}" aria-label="${escapeHTML(n.label)}"><circle class="node-halo" cx="${n.x}" cy="${n.y}" r="${r+5}"/><circle class="node-dot" cx="${n.x}" cy="${n.y}" r="${r}" fill="${fill}"/><text x="${n.x}" y="${labelY}">${escapeHTML(label)}</text></g>`;
  }).join('');
  svg.innerHTML=`<g class="graph-guides">${guide}</g><g class="graph-links">${edgeMarkup}</g>${nodeMarkup}`;
  svg.querySelectorAll('.graph-node').forEach(el=>{const activate=()=>{const n=nodes.find(x=>x.id===el.dataset.nodeId);if(n.type==='book'){showGraphInfo('book',n.bookId,n);}else showGraphInfo('author',null,n);};el.addEventListener('click',activate);el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();activate();}});});
}
function showGraphInfo(type,bookId,node){const info=document.getElementById('graphInfo');if(!info)return;if(type==='book'){const b=books.find(x=>x.id===bookId);if(!b)return;info.innerHTML=`<span class="info-icon">▣</span><h3>${escapeHTML(b.title)}</h3><p><strong>ผู้แต่ง:</strong> ${escapeHTML(b.author)}</p><p><strong>ISBN:</strong> ${escapeHTML(b.isbn||'ไม่ระบุ')}</p><p>รายละเอียดจาก Book node ในไฟล์ส่งออก</p><button class="text-button" id="graphBookDetail">ดูรายละเอียดหนังสือ →</button>`;document.getElementById('graphBookDetail').addEventListener('click',()=>showBook(b.id));}else{const name=node?.fullLabel||node?.label||'ผู้แต่ง';const related=books.filter(b=>b.author===name);info.innerHTML=`<span class="info-icon">✎</span><h3>${escapeHTML(name)}</h3><p>ประเภทโหนด: ผู้แต่ง (Auther)</p><p>หนังสือที่เชื่อมโยงในข้อมูลที่นำเข้า: ${related.length} รายการ</p><ul>${related.slice(0,8).map(b=>`<li>${escapeHTML(b.title)}</li>`).join('')||'<li>ดูข้อมูลผู้แต่งจากความสัมพันธ์ที่แสดงในกราฟ</li>'}</ul>`;}}
function runSearch(value){searchTerm=value;document.getElementById('exploreSearchInput').value=value;goToPage('explore');renderBooks();}
document.querySelectorAll('[data-page]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();goToPage(a.dataset.page);}));document.querySelectorAll('[data-go-graph]').forEach(b=>b.addEventListener('click',()=>goToPage('graph')));
document.getElementById('heroSearch').addEventListener('submit',e=>{e.preventDefault();runSearch(document.getElementById('heroSearchInput').value);});document.getElementById('exploreSearch').addEventListener('submit',e=>{e.preventDefault();searchTerm=document.getElementById('exploreSearchInput').value;renderBooks();});document.getElementById('yearSelect').addEventListener('change',e=>{selectedYear=e.target.value;renderBooks();});document.getElementById('authorSelect').addEventListener('change',e=>{selectedAuthor=e.target.value;renderBooks();});document.getElementById('sortSelect').addEventListener('change',e=>{sortMode=e.target.value;renderBooks();});document.getElementById('clearFilters').addEventListener('click',()=>{searchTerm='';selectedYear='';selectedAuthor='';sortMode='title';document.getElementById('authorSelect').value='';document.getElementById('exploreSearchInput').value='';document.getElementById('heroSearchInput').value='';document.getElementById('yearSelect').value='';document.getElementById('sortSelect').value='title';renderBooks();});document.getElementById('backToExplore').addEventListener('click',()=>goToPage('explore'));mobileMenu.addEventListener('click',()=>navLinks.classList.toggle('open'));
// Update the page's status and show the true exported graph counts.
const notice=document.querySelector('.graph-notice');if(notice)notice.innerHTML=`<strong>ข้อมูลจาก Neo4j Bloom export:</strong> พบ Book nodes ${data.stats.bookNodes} รายการ, Auther nodes ${data.stats.authorNodes} รายการ และ DemoUser nodes ${data.stats.demoUserNodes} รายการ กราฟที่แสดงเป็นส่วนหนึ่งของความสัมพันธ์จริงเพื่อให้อ่านได้ชัดเจน; รายการหนังสือค้นหาได้จากข้อมูล Book nodes ทั้งหมด`;
const about=document.querySelector('.project-status');if(about)about.innerHTML=`<strong>สถานะ:</strong> เว็บไซต์อ่านข้อมูลจากไฟล์ส่งออก Neo4j Bloom ที่นายให้มาแล้ว โดยใช้ข้อมูล Book และความสัมพันธ์ Book–Auther ที่มีอยู่ในไฟล์ ไม่ใช่ข้อมูลตัวอย่างชุดเดิม`;
populateYears();renderFeatured();renderBooks();renderGraph('fullGraph');


// ถ้าเปิดผ่าน server.js จะลองดึงข้อมูลสดจาก Neo4j API; ถ้าเชื่อมต่อไม่ได้จะใช้ไฟล์ export ที่แนบมา
async function loadLiveNeo4jData() {
  const status = document.getElementById('connectionStatus');
  try {
    const response = await fetch('/api/graph-data', { headers: { 'Accept': 'application/json' } });
    if (!response.ok) throw new Error('API ไม่พร้อมใช้งาน');
    const liveData = await response.json();
    if (!liveData || !Array.isArray(liveData.books) || !liveData.books.length) throw new Error('ไม่พบข้อมูลหนังสือใน Neo4j');
    data = liveData;
    books = normalizeBooks(data);
    const oldYears = document.getElementById('yearSelect');
    oldYears.innerHTML = '<option value="">ทุกปี</option>';
    populateYears(); renderFeatured(); renderBooks(); renderGraph('fullGraph');
    if (status) { status.textContent = `เชื่อมต่อ Neo4j สำเร็จ · หนังสือ ${books.length} รายการ`; status.className = 'connection-status connected'; }
    const notice = document.querySelector('.graph-notice');
    if (notice) notice.innerHTML = `<strong>เชื่อมต่อฐานข้อมูล Neo4j โดยตรง:</strong> กำลังแสดงข้อมูลสด ${books.length} รายการ และความสัมพันธ์ที่อ่านได้จากฐานข้อมูล`;
  } catch (error) {
    if (status) { status.textContent = `โหมดไฟล์สำรอง · ใช้ข้อมูล Export ${books.length.toLocaleString()} รายการ`; status.className = 'connection-status'; }
    console.info('BookVerse ใช้ข้อมูล export สำรอง:', error.message);
  }
}
loadLiveNeo4jData();
