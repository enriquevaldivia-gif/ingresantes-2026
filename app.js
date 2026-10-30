/* Los datos DEMO son solo para previsualizar la web; no son una fuente de producción. */
const DEMO={students:48,admissions:54,universities:11,careers:22,universityRows:[['CATÓLICA',20],['UNASAM',10],['SAN MARTÍN',7],['CAYETANO HEREDIA',6],['UPC',3],['RICARDO PALMA',3],['UPAO',1],['USIL',1],['UNT - TRUJILLO',1],['UNIVERSIDAD DEL PACÍFICO',1],['CIENTÍFICA DEL SUR',1]],careerRows:[['ING. BIOMÉDICA',10],['DERECHO',8],['MEDICINA HUMANA',6],['ARQUITECTURA',4],['ING. CIVIL',4],['ECONOMÍA',3],['ING. DE SISTEMAS',2],['ING. MINAS',2],['RADIOLOGÍA',2],['OTRAS CARRERAS',13]],sectionRows:[['QUINTO A',5],['QUINTO B',11],['QUINTO C',5],['QUINTO D',13],['QUINTO E',7],['QUINTO F',7]],updatedAt:null};
const $=id=>document.getElementById(id);let data=DEMO;const escapeHtml=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function rows(v){return Array.isArray(v)?v.filter(x=>Array.isArray(x)&&x.length>1).map(x=>[String(x[0]),Number(x[1])||0]):[]}
function render(){for(const [id,key] of [['kpiStudents','students'],['kpiAdmissions','admissions'],['kpiUniversities','universities'],['kpiCareers','careers']])$(id).textContent=Number(data[key]||0).toLocaleString('es-PE');renderUniversities();renderCareers();renderSections();renderMulti();$('updatedAt').textContent=data.updatedAt?'Última actualización: '+new Date(data.updatedAt).toLocaleString('es-PE'):''}
function renderUniversities(){
 const query=$('universitySearch').value.toLocaleLowerCase('es');
 const normalize=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleUpperCase('es').trim();
 const catalogue=window.INGRESANTES_IMAGENES||{};
 const found=rows(data.universityRows).filter(r=>r[0].toLocaleLowerCase('es').includes(query));
 $('universityCount').textContent=found.length+' universidades';
 $('universities').innerHTML=found.map(([name,n])=>{
   const key=Object.keys(catalogue).find(k=>normalize(k)===normalize(name));
   const img= (data.logos||{})[name] || (key&&catalogue[key].logo) || '';
   const fallback=escapeHtml(name.split(/\s+/).map(w=>w[0]).slice(0,2).join(''));
   const visual=img?`<img src="${escapeHtml(img)}" alt="Logo de ${escapeHtml(name)}" loading="lazy" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><span class="logo-fallback" hidden>${fallback}</span>`:`<span class="logo-fallback">${fallback}</span>`;
   return `<article class="university-card" role="button" tabindex="0" aria-label="Ver ingresantes de ${escapeHtml(name)}"><div class="logo">${visual}</div><div class="uni-details"><div class="uni-name">${escapeHtml(name)}</div><div class="uni-value" aria-label="${n} ${n===1?'ingresante':'ingresantes'}">${n} <span>${n===1?'ingresante':'ingresantes'}</span></div></div></article>`
 }).join('')||'<p>No se encontraron universidades.</p>';
}
function renderCareers(){const list=rows(data.careerRows);const max=Math.max(1,...list.map(x=>x[1]));$('careersChart').innerHTML=list.map(([name,n])=>`<div class="bar-row"><div class="bar-label">${escapeHtml(name)}</div><div class="track"><div class="fill" style="width:${100*n/max}%"></div></div><div class="bar-value">${n}</div></div>`).join('')}
function renderSections(){const list=rows(data.sectionRows);const max=Math.max(1,...list.map(x=>x[1]));$('sectionTotal').textContent=list.reduce((a,x)=>a+x[1],0)+' estudiantes';$('sectionsChart').style.gridTemplateColumns=`repeat(${Math.max(1,list.length)},1fr)`;$('sectionsChart').innerHTML=list.map(([name,n])=>`<div class="column-item"><span class="column-value">${n}</span><div class="column-bar" style="height:${Math.max(4,165*n/max)}px"></div><span class="column-label">${escapeHtml(name.replace('QUINTO ','5.º '))}</span></div>`).join('')}
function renderMulti(){
 const list=Array.isArray(data.multiStudents)?data.multiStudents:[];
 const counts=data.multiCounts||{};
 const summary=$('multiSummary'),grid=$('multiStudents');
 if(!summary||!grid)return;
 summary.innerHTML='<div class="multi-stat"><strong>'+list.length+'</strong><span>estudiantes con logros múltiples</span></div>'+Object.keys(counts).sort((a,b)=>Number(a)-Number(b)).map(n=>'<div class="multi-stat"><strong>'+counts[n]+'</strong><span>en '+n+' universidades</span></div>').join('');
 if(!Array.isArray(data.multiStudents)){grid.innerHTML='<p>Conecta los datos para consultar estos logros.</p>';return;}
 grid.innerHTML=list.length?list.map(s=>'<article class="multi-card"><div class="multi-person">'+(s.foto&&/^https:\/\//i.test(s.foto)?'<img src="'+escapeHtml(s.foto)+'" alt="Foto autorizada" loading="lazy">':'<span>🎓</span>')+'<div><h3>'+escapeHtml(s.nombre)+'</h3><p>'+escapeHtml([s.grado,s.seccion,s.sede].filter(Boolean).join(' · '))+'</p><b>'+s.universidades+' universidades</b></div></div><div class="multi-admissions">'+s.admisiones.map(a=>'<p><strong>'+escapeHtml(a.universidad)+'</strong><span>'+escapeHtml(a.carrera)+'</span></p>').join('')+'</div></article>').join(''):'<p>Por ahora no hay estudiantes con admisiones en dos o más universidades distintas.</p>';
}
function applyPayload(p){if(!p||p.ok!==true||!Array.isArray(p.universityRows)||!Array.isArray(p.careerRows)||!Array.isArray(p.sectionRows))throw Error('Respuesta incompleta');data={...p,universityRows:rows(p.universityRows),careerRows:rows(p.careerRows),sectionRows:rows(p.sectionRows)};render();$('statusDot').classList.add('live');$('status').textContent='Datos institucionales conectados · actualización periódica';$('sourceLabel').textContent='Datos de admisiones del registro institucional. Las fichas públicas corresponden a estudiantes con autorización confirmada.'}
// JSONP evita las restricciones CORS de Apps Script ContentService. Solo se transportan agregados públicos.
function loadData(){const url=(window.INGRESANTES_CONFIG||{}).API_URL;if(!url)return;const callback='ingresantesCallback_'+Date.now();const script=document.createElement('script');let finished=false;const cleanup=()=>{delete window[callback];script.remove()};window[callback]=p=>{finished=true;try{applyPayload(p)}catch(e){$('status').textContent='No se pudo validar la respuesta; se muestra la vista de referencia'}cleanup()};script.onerror=()=>{if(!finished){$('status').textContent='Conexión no disponible; se muestra la vista de referencia';cleanup()}};script.src=url+(url.includes('?')?'&':'?')+'callback='+encodeURIComponent(callback)+'&t='+Date.now();document.head.appendChild(script)}
$('universitySearch').addEventListener('input',renderUniversities);$('menu').addEventListener('click',()=>{const open=$('nav').classList.toggle('open');$('menu').setAttribute('aria-expanded',String(open))});document.querySelectorAll('#nav a').forEach(a=>a.addEventListener('click',()=>$('nav').classList.remove('open')));render();loadData();if((window.INGRESANTES_CONFIG||{}).API_URL)setInterval(loadData,Math.max(1,Number(window.INGRESANTES_CONFIG.REFRESH_MINUTES)||5)*60000);


// V6 — Fichas de ingresantes en una ventana accesible y sin alterar la cuadrícula.
const modal=$('universityModal');
const normalizeUni=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().trim();
function closeUniversity(){modal.hidden=true;document.body.classList.remove('modal-open');}
function openUniversity(name){
 const item=rows(data.universityRows).find(([n])=>normalizeUni(n)===normalizeUni(name));
 if(!item)return;
 const entries=(Array.isArray(data.publicStudents)?data.publicStudents:[])
   .filter(x=>normalizeUni(x.universidad)===normalizeUni(name));
 $('modalTitle').textContent=name;
 $('modalCount').textContent=item[1]+' '+(item[1]===1?'admisión registrada':'admisiones registradas');
 const catalogue=window.INGRESANTES_IMAGENES||{};
 const key=Object.keys(catalogue).find(k=>normalizeUni(k)===normalizeUni(name));
 const logo=(data.logos||{})[name]||(key&&catalogue[key].logo)||'';
 const logoEl=$('modalLogo');logoEl.hidden=!logo;if(logo)logoEl.src=logo;
 $('modalList').replaceChildren();
 if(!entries.length){const p=document.createElement('p');p.className='modal-empty';p.textContent='Aún no hay fichas públicas habilitadas para esta universidad. Las admisiones sí están contabilizadas.';$('modalList').append(p);}
 else entries.forEach(x=>{
  const card=document.createElement('article');card.className='student-card';
  const avatar=document.createElement('div');avatar.className='student-avatar';
  if(x.foto && /^https:\/\//i.test(x.foto)){
   const img=document.createElement('img');img.src=x.foto;img.alt='Fotografía autorizada de '+String(x.nombre||'estudiante');img.loading='lazy';img.onerror=()=>{avatar.textContent='🎓'};avatar.append(img);
  } else avatar.textContent='🎓';
  const details=document.createElement('div');details.className='student-details';
  const title=document.createElement('h3');title.textContent=x.nombre||'Estudiante';details.append(title);
  const fields=[['Carrera',x.carrera],['Grado',x.grado],['Sección',x.seccion],['Sede',x.sede]];
  fields.forEach(([label,value])=>{if(value){const el=document.createElement('p');const b=document.createElement('strong');b.textContent=label+': ';el.append(b,document.createTextNode(String(value)));details.append(el)}});
  card.append(avatar,details);$('modalList').append(card);
 });
 modal.hidden=false;document.body.classList.add('modal-open');$('modalClose').focus();
}
$('universities').addEventListener('click',e=>{const c=e.target.closest('.university-card');if(c)openUniversity(c.querySelector('.uni-name').textContent.trim())});
$('universities').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){const c=e.target.closest('.university-card');if(c){e.preventDefault();openUniversity(c.querySelector('.uni-name').textContent.trim())}}});
$('modalClose').addEventListener('click',closeUniversity);
modal.addEventListener('click',e=>{if(e.target===modal)closeUniversity()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)closeUniversity()});
