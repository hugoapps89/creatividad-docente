(function(){
'use strict';

const KEY='creatividad_docente_planes';
const esc=v=>String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;');
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return[]}};
const write=a=>localStorage.setItem(KEY,JSON.stringify(a.slice(0,50)));
const fmt=d=>{try{return new Date(d).toLocaleDateString('es-MX',{day:'2-digit',month:'2-digit',year:'numeric'})}catch{return'—'}};
const getData=p=>p?.data||{};

function ensureStyles(){
 if(document.getElementById('planes-module-styles'))return;
 const s=document.createElement('style');s.id='planes-module-styles';s.textContent=`
 .planes-view{margin-top:22px}.planes-head{display:flex;justify-content:space-between;align-items:flex-end;gap:18px;margin-bottom:18px}.planes-head h1{margin:4px 0;font-size:29px;color:#252b50}.planes-head p{margin:0;color:#69748a;font-size:13px}.planes-actions{display:flex;gap:9px}.planes-btn{border:0;border-radius:10px;padding:11px 15px;font-weight:800}.planes-btn.primary{background:#6844d9;color:#fff}.planes-tools{display:flex;gap:10px;align-items:center;margin-bottom:16px}.planes-search{flex:1;max-width:520px;border:1px solid #e2e5ed;border-radius:10px;padding:12px 14px;background:#fff;outline:0}.planes-filter{border:1px solid #e2e5ed;border-radius:10px;padding:12px;background:#fff;color:#27304b}.planes-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:13px;margin-bottom:18px}.planes-stat{background:#fff;border:1px solid #e5e7ee;border-radius:13px;padding:16px}.planes-stat strong{display:block;font-size:24px;color:#6844d9}.planes-stat span{font-size:11px;color:#69748a}.planes-list{display:grid;gap:12px}.plane-card{background:#fff;border:1px solid #e4e6ed;border-radius:15px;padding:18px;display:flex;align-items:center;gap:15px;box-shadow:0 3px 14px rgba(30,45,80,.03)}.plane-icon{width:46px;height:46px;border-radius:12px;background:#eee9ff;color:#6844d9;display:grid;place-items:center;font-size:22px;flex:none}.plane-info{min-width:0;flex:1}.plane-info h3{margin:0 0 5px;font-size:15px;color:#25304a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.plane-info p{margin:0;color:#69748a;font-size:11px}.plane-tags{display:flex;gap:6px;margin-top:8px;flex-wrap:wrap}.plane-tag{background:#f3f1f8;color:#5f6473;border-radius:20px;padding:4px 8px;font-size:10px}.plane-menu{display:flex;gap:6px;flex-wrap:wrap}.plane-menu button{border:1px solid #e1e3eb;background:#fff;border-radius:8px;padding:8px 10px;font-size:11px;font-weight:800;color:#554c68}.plane-menu .open{background:#6844d9;color:#fff;border-color:#6844d9}.planes-empty{background:#fff;border:1px dashed #d9dce6;border-radius:15px;text-align:center;padding:42px 20px;color:#69748a}.planes-empty strong{display:block;color:#28334e;font-size:16px;margin-bottom:7px}.planes-empty button{margin-top:15px}.plane-modal{position:fixed;inset:0;background:#17203b66;display:grid;place-items:center;padding:20px;z-index:50}.plane-modal-card{width:min(760px,100%);max-height:85vh;overflow:auto;background:#fff;border-radius:18px;padding:24px;box-shadow:0 20px 60px #101a3a33}.plane-modal-head{display:flex;justify-content:space-between;gap:15px;align-items:flex-start}.plane-modal-head h2{margin:0;color:#252b50}.plane-close{border:0;background:#f1eff6;border-radius:9px;padding:8px 11px}.plane-detail{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:18px}.plane-detail div{background:#f8f8fb;border-radius:9px;padding:11px}.plane-detail b{display:block;font-size:10px;color:#69748a;margin-bottom:4px}.plane-detail span{font-size:12px;color:#28334e}.plane-detail-wide{grid-column:1/-1}.plane-pdas{padding-left:20px;font-size:12px;line-height:1.6;color:#34405b}.plane-modal-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:18px}.plane-modal-actions button{border:0;border-radius:9px;padding:10px 14px;font-weight:800}.plane-modal-actions .primary{background:#6844d9;color:#fff}
 @media(max-width:760px){.planes-head{display:block}.planes-actions{margin-top:13px}.planes-tools{display:block}.planes-search{max-width:none;width:100%;margin-bottom:8px}.planes-filter{width:100%}.planes-stats{grid-template-columns:1fr}.plane-card{align-items:flex-start;flex-wrap:wrap}.plane-info{min-width:calc(100% - 61px)}.plane-menu{width:100%;padding-left:61px}.plane-detail{grid-template-columns:1fr}}
 `;document.head.appendChild(s);
}

function createView(){
 let v=document.getElementById('planesView');
 if(v)return v;
 v=document.createElement('section');v.id='planesView';v.className='planes-view';
 const content=document.querySelector('.content');
 (content||document.body).appendChild(v);
 return v;
}
function showPlans(){
 ensureStyles();
 const v=createView();
 document.querySelectorAll('.content > *').forEach(el=>{if(el.id!=='planesView')el.style.display='none'});
 v.style.display='block';
 document.querySelectorAll('.nav a').forEach(a=>a.classList.toggle('active',a.dataset.action==='plans'));
 render();window.scrollTo({top:0,behavior:'smooth'});
}
function hidePlans(){const v=document.getElementById('planesView');if(v)v.style.display='none'}

function render(){
 const v=createView(), all=read();
 const q=(v.querySelector('#planesSearch')?.value||'').toLowerCase().trim();
 const f=v.querySelector('#planesFilter')?.value||'all';
 const filtered=all.filter(p=>{const d=getData(p), hay=[p.title,d.grade,d.field,d.project,d.content].join(' ').toLowerCase();return(!q||hay.includes(q))&&(f==='all'||String(d.grade||'')===f)});
 const grades=[...new Set(all.map(p=>getData(p).grade).filter(Boolean))];
 v.innerHTML=`<div class="page-head"><span>MI ESPACIO DOCENTE</span><div class="planes-head"><div><h1>Mis planeaciones 📚</h1><p>Administra, consulta y reutiliza tus planeaciones guardadas.</p></div><div class="planes-actions"><button class="planes-btn primary" id="newPlanBtn">＋ Nueva planeación</button></div></div></div>
 <div class="planes-tools"><input id="planesSearch" class="planes-search" placeholder="Buscar por título, grado, campo o contenido..." value="${esc(q)}"><select id="planesFilter" class="planes-filter"><option value="all">Todos los grados</option>${grades.map(g=>`<option value="${esc(g)}" ${f===g?'selected':''}>${esc(g)}</option>`).join('')}</select></div>
 <div class="planes-stats"><div class="planes-stat"><strong>${all.length}</strong><span>Planeaciones guardadas</span></div><div class="planes-stat"><strong>${grades.length}</strong><span>Grados utilizados</span></div><div class="planes-stat"><strong>${filtered.length}</strong><span>Resultados actuales</span></div></div>
 <div class="planes-list">${filtered.length?filtered.map(card).join(''):empty()}</div>`;
 v.querySelector('#planesSearch')?.addEventListener('input',()=>render());
 v.querySelector('#planesFilter')?.addEventListener('change',()=>render());
 v.querySelector('#newPlanBtn')?.addEventListener('click',()=>window.showView('nueva'));
 v.querySelectorAll('[data-plan-open]').forEach(b=>b.addEventListener('click',()=>openDetail(Number(b.dataset.planOpen))));
 v.querySelectorAll('[data-plan-duplicate]').forEach(b=>b.addEventListener('click',()=>duplicate(Number(b.dataset.planDuplicate))));
 v.querySelectorAll('[data-plan-delete]').forEach(b=>b.addEventListener('click',()=>remove(Number(b.dataset.planDelete))));
}
function card(p){const d=getData(p);return `<article class="plane-card"><div class="plane-icon">▤</div><div class="plane-info"><h3 title="${esc(p.title||'Planeación didáctica')}">${esc(p.title||'Planeación didáctica')}</h3><p>${esc(d.grade||'—')} · ${esc(d.field||'—')} · Guardada ${fmt(p.date)}</p><div class="plane-tags"><span class="plane-tag">${esc(d.phase||'Sin fase')}</span><span class="plane-tag">${esc(d.duration||'Sin duración')}</span>${d.methodology?`<span class="plane-tag">${esc(d.methodology)}</span>`:''}</div></div><div class="plane-menu"><button class="open" data-plan-open="${p.id}">Abrir</button><button data-plan-duplicate="${p.id}">Duplicar</button><button data-plan-delete="${p.id}">Eliminar</button></div></article>`}
function empty(){return `<div class="planes-empty"><strong>No hay planeaciones para mostrar</strong><span>Guarda una planeación desde el módulo “Nueva planeación” y aparecerá aquí.</span><br><button class="planes-btn primary" id="emptyNew">Crear mi primera planeación</button></div>`}
function find(id){return read().find(p=>Number(p.id)===Number(id))}
function openDetail(id){const p=find(id);if(!p)return;const d=getData(p);const modal=document.createElement('div');modal.className='plane-modal';modal.innerHTML=`<div class="plane-modal-card"><div class="plane-modal-head"><div><small style="color:#6844d9;font-weight:900;letter-spacing:1px">PLANEACIÓN GUARDADA</small><h2>${esc(p.title||'Planeación didáctica')}</h2><p style="color:#69748a;font-size:12px">${esc(d.school||'Escuela primaria')} · ${esc(d.grade)} · ${esc(d.field)}</p></div><button class="plane-close">✕</button></div><div class="plane-detail"><div><b>Fase</b><span>${esc(d.phase)||'—'}</span></div><div><b>Duración</b><span>${esc(d.duration)||'—'}</span></div><div><b>Escenario</b><span>${esc(d.scenario)||'—'}</span></div><div><b>Metodología</b><span>${esc(d.methodology)||'—'}</span></div><div class="plane-detail-wide"><b>Contenido</b><span>${esc(d.content)||'—'}</span></div><div class="plane-detail-wide"><b>Aprendizajes seleccionados</b><ul class="plane-pdas">${(d.pdas||[]).map(x=>`<li>${esc(x)}</li>`).join('')||'<li>Sin aprendizajes registrados.</li>'}</ul></div><div class="plane-detail-wide"><b>Contexto</b><span>${esc(d.context)||'—'}</span></div></div><div class="plane-modal-actions"><button class="plane-close">Cerrar</button><button class="primary" id="modalDuplicate">Duplicar y editar</button></div></div>`;
 document.body.appendChild(modal);modal.querySelectorAll('.plane-close').forEach(b=>b.onclick=()=>modal.remove());modal.addEventListener('click',e=>{if(e.target===modal)modal.remove()});modal.querySelector('#modalDuplicate').onclick=()=>{modal.remove();duplicate(id,true)};
}
function duplicate(id,edit){const p=find(id);if(!p)return;const copy=JSON.parse(JSON.stringify(p));copy.id=Date.now();copy.date=new Date().toISOString();copy.title=(copy.title||'Planeación')+' — copia';const a=read();a.unshift(copy);write(a);toast?.('Planeación duplicada.');if(edit){loadIntoPlanner(copy);return}render()}
function remove(id){const p=find(id);if(!p)return;if(!confirm(`¿Eliminar “${p.title||'esta planeación'}”? Esta acción no se puede deshacer.`))return;write(read().filter(x=>Number(x.id)!==Number(id)));toast?.('Planeación eliminada.');render()}
function loadIntoPlanner(p){const d=getData(p);const map={schoolName:d.school,schoolCct:d.cct,schoolLocality:d.locality,schoolZone:d.zone,startDate:d.start,projectName:d.project,context:d.context,duration:d.duration,scenario:d.scenario,methodology:d.methodology};Object.entries(map).forEach(([id,val])=>{const el=document.getElementById(id);if(el&&val!=null)el.value=val});if(window.showView)window.showView('nueva');setTimeout(()=>toast?.('Datos cargados. Revisa y genera nuevamente la planeación.'),250)}

const originalShow=window.showView;
window.showView=function(id){if(id==='plans'){showPlans();return}hidePlans();return originalShow?.(id)};
window.addEventListener('DOMContentLoaded',()=>{const nav=document.querySelectorAll('.nav a[data-action="plans"]');nav.forEach(a=>a.onclick=e=>{e.preventDefault();window.showView('plans')});});
})();
