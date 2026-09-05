(function(){
'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const dashboard=$('.content'), planner=$('#nueva');
function toast(msg){const t=$('#toast');if(!t)return;t.textContent=msg;t.style.display='block';clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.style.display='none',2800)}
window.toast=toast;
window.toggleMenu=()=>$('#sidebar')?.classList.toggle('open');
window.showView=function(id){

  const homeHeading=document.querySelector('.heading');
  const homeGrid=document.querySelector('.grid-top');
  const homeLower=document.querySelector('.lower');

  const planner=document.getElementById('nueva');
  const planes=document.getElementById('planes');

  // ==========================================
  // MIS PLANEACIONES
  // ==========================================
  // ==========================================
  // PROYECTOS
  // ==========================================

  if(id==='projects'){

    // Ocultar completamente el inicio
    if(homeHeading) homeHeading.style.display='none';
    if(homeGrid) homeGrid.style.display='none';
    if(homeLower) homeLower.style.display='none';

    // Ocultar Nueva planeación
    if(planner){
      planner.style.display='none';
    }

    // Ocultar Mis planeaciones
    if(planes){
      planes.style.display='none';
    }

    // Mostrar PROYECTOS
    const projects=document.getElementById('projects');

    if(projects){
      projects.style.display='block';
      projects.style.visibility='visible';
      projects.style.opacity='1';

      window.scrollTo({
        top:0,
        left:0,
        behavior:'instant'
      });
    }

    // Activar solamente "Proyectos"
    document.querySelectorAll('.nav a').forEach(a=>{
      a.classList.toggle(
        'active',
        a.dataset.action==='projects'
      );
    });

    return;
  }


  if(id==='planes'){

    // Ocultar completamente el inicio
    if(homeHeading) homeHeading.style.display='none';
    if(homeGrid) homeGrid.style.display='none';
    if(homeLower) homeLower.style.display='none';

    // Ocultar Nueva planeación
    if(planner){
      planner.style.display='none';
    }

    // Mostrar MIS PLANEACIONES
    if(planes){

      planes.style.display='block';
      planes.style.visibility='visible';
      planes.style.opacity='1';

      // Llevar la pantalla al inicio
      window.scrollTo({
        top:0,
        left:0,
        behavior:'instant'
      });
    }

    // Activar solamente "Mis planeaciones"
    document.querySelectorAll('.nav a').forEach(a=>{
      a.classList.toggle(
        'active',
        a.dataset.action==='plans'
      );
    });

    // Cargar inmediatamente las planeaciones guardadas
    if(typeof window.renderSavedPlans==='function'){
      window.renderSavedPlans();
    }

    return;
  }


  // ==========================================
  // NUEVA PLANEACIÓN
  // ==========================================

  if(id==='nueva'){

  // ==========================================
  // NUEVA PLANEACIÓN / ABRIR EXISTENTE
  // ==========================================

  if(!window.__openingSavedPlan){

    editingPlanId=null;
    schoolLogoData='';

    const form=document.getElementById('planningForm');

    if(form){
      form.reset();
    }

    const review=document.getElementById('review');

    if(review){
      review.innerHTML='';
    }

    if(typeof showStep==='function'){
      showStep(0);
    }

  }
    if(homeHeading) homeHeading.style.display='none';
    if(homeGrid) homeGrid.style.display='none';
    if(homeLower) homeLower.style.display='none';

    if(planes) planes.style.display='none';

    if(planner){
      planner.style.display='block';
      planner.style.visibility='visible';
      planner.style.opacity='1';
    }

    document.querySelectorAll('.nav a').forEach(a=>{
      a.classList.toggle(
        'active',
        a.dataset.action==='new'
      );
    });

    window.scrollTo({
      top:0,
      left:0,
      behavior:'instant'
    });

    if(typeof refreshCurriculum==='function'){
      refreshCurriculum();
    }
window.__openingSavedPlan=false;
    return;
  }


  // ==========================================
// INICIO
// ==========================================

if(id==='home'){

  if(planner) planner.style.display='none';
  if(planes) planes.style.display='none';

  if(homeHeading) homeHeading.style.display='';
  if(homeGrid) homeGrid.style.display='';
  if(homeLower) homeLower.style.display='';

  document.querySelectorAll('.nav a').forEach(a=>{
    a.classList.toggle(
      'active',
      a.dataset.action==='home'
    );
  });

  window.scrollTo({
    top:0,
    left:0,
    behavior:'instant'
  });

  return;
}

// ==========================================
// OTRAS VISTAS
// ==========================================

if(planner) planner.style.display='none';
if(planes) planes.style.display='none';

if(homeHeading) homeHeading.style.display='none';
if(homeGrid) homeGrid.style.display='none';
if(homeLower) homeLower.style.display='none';

document.querySelectorAll('.nav a').forEach(a=>{
  a.classList.toggle(
    'active',
    a.dataset.action===id
  );
});

window.scrollTo({
  top:0,
  left:0,
  behavior:'instant'
});

};

$$('.nav a').forEach(a=>{

  a.addEventListener('click',function(e){

    const action=this.dataset.action;

    if(!action)return;

    e.preventDefault();
    e.stopPropagation();

    if(action==='new'){
      window.showView('nueva');
      return;
    }

    if(action==='plans'){
      window.showView('planes');
      return;
    }

    if(action==='home'){
      window.showView('home');
      return;
    }

    window.showView(action);

  });

});
if($('#today'))$('#today').textContent=new Date().toLocaleDateString('es-MX',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
$('#search')?.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.value.trim())toast('Buscando: '+e.target.value.trim())});
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();$('#search')?.focus()}});

const panels=$$('.wizard-panel'),steps=$$('.planner .step'),grade=$('#grade'),phase=$('#phase'),field=$('#field'),content=$('#content'),pda=$('#pda');
let schoolLogoData='';
let editingPlanId=null;

const schoolLogoInput=$('#schoolLogo');

schoolLogoInput?.addEventListener('change',e=>{
  const file=e.target.files?.[0];

  if(!file){
    schoolLogoData='';
    return;
  }

  if(!file.type.startsWith('image/')){
    toast('Selecciona una imagen válida.');
    e.target.value='';
    schoolLogoData='';
    return;
  }

  const reader=new FileReader();

  reader.onload=()=>{
    schoolLogoData=reader.result;
  };

  reader.readAsDataURL(file);
});
const phaseByGrade={1:3,2:3,3:4,4:4,5:5,6:5};
function clean(s){return String(s??'').replace(/[\u00ad\u200b\u200c\u200d]/g,'').replace(/([A-Za-zÁÉÍÓÚÜÑáéíóúüñ])-\s*(?=[A-Za-zÁÉÍÓÚÜÑáéíóúüñ])/g,'$1').replace(/([A-Za-zÁÉÍÓÚÜÑáéíóúüñ])\s*[-–—]\s*(?=[A-Za-zÁÉÍÓÚÜÑáéíóúüñ])/g,'$1').replace(/\r?\n+/g,' ').replace(/\s+/g,' ').trim()}
function dataFor(ph){
  const key='PLANEAnEM_FASE_'+ph;
  const d=window[key];
  if(d && d['FASE '+ph]) return d['FASE '+ph];
  return null;
}
function gradeNum(){return Number((grade?.value.match(/\d+/)||['1'])[0])}
function currentData(){return dataFor(phaseByGrade[gradeNum()]||3)}
function itemsFor(){const g=gradeNum(),data=currentData();return data?.[field?.value]?.grades?.[g]||[]}
function populateFields(data){
  if(!field||!data)return;
  const fields=Object.keys(data);
  const old=field.value;
  field.innerHTML='';
  fields.forEach(name=>{const o=document.createElement('option');o.value=name;o.textContent=name;field.appendChild(o)});
  if(fields.includes(old))field.value=old;
  else if(fields.length)field.value=fields[0];
}
function splitPdas(raw){
  let t=clean(raw);
  if(!t) return [];

  // La base curricular contiene palabras partidas por saltos de línea del documento
  // (ej. "fragmen- tos"). Las unimos antes de separar los aprendizajes.
  t=t.replace(/([A-Za-zÁÉÍÓÚÜÑáéíóúüñ])-+\s+(?=[A-Za-zÁÉÍÓÚÜÑáéíóúüñ])/g,'$1');
  t=t.replace(/\s+/g,' ').trim();

  // Cada oración termina en ., ! o ?. No exigimos mayúscula después del punto:
  // así evitamos unir "textos completos." con "Lee en voz alta..." cuando la
  // fuente original trae el salto/espaciado de manera irregular.
  const parts=t.match(/[^.!?]+(?:[.!?]+|$)/g)
    ?.map(s=>s.trim())
    .filter(Boolean) || [];

  return parts.length ? parts : [t];
}
function renderPdas(item){
  if(!pda)return;
  pda.innerHTML='';
  const texts=splitPdas(item?.pda);
  if(!texts.length){
    pda.innerHTML='<div class="pda-empty">Selecciona un contenido para consultar sus aprendizajes.</div>';
    return;
  }
  texts.forEach((text,i)=>{
    const label=document.createElement('label');
    label.className='pda-choice';
    const input=document.createElement('input');
    input.type='checkbox'; input.name='pdas'; input.value=text; input.checked=true;
    input.setAttribute('aria-label','Seleccionar aprendizaje');
    const body=document.createElement('span');
    body.className='pda-text'; body.textContent=text;
    // Cada elemento queda separado visualmente. No se muestra la palabra "PDA" dentro del recuadro.
    label.append(input,body);
    pda.appendChild(label);
  });
  const meta=document.createElement('div');
  meta.className='curriculum-meta';
  meta.textContent=texts.length===1 ? '1 aprendizaje asociado al contenido seleccionado' : `${texts.length} aprendizajes asociados al contenido seleccionado`;
  pda.appendChild(meta);
}
function fillContents(){
  if(!content)return;
  const arr=itemsFor();
  content.innerHTML='';
  if(!arr.length){content.innerHTML='<option value="">No hay contenidos disponibles para este grado y campo formativo</option>';renderPdas(null);updateCurriculumCount(0);return;}
  arr.forEach((it,i)=>{const o=document.createElement('option');o.value=String(i);o.textContent=clean(it.content);content.appendChild(o)});
  content.selectedIndex=0;
  renderPdas(arr[0]);
  updateCurriculumCount(arr.length);
}
function updateCurriculumCount(n){
  let badge=$('#contentCount');
  if(!badge&&content?.parentElement){badge=document.createElement('span');badge.id='contentCount';badge.className='curriculum-count';content.parentElement.appendChild(badge)}
  if(badge)badge.textContent=n?`${n} contenidos disponibles`:'';
}
function refreshCurriculum(){
  if(!grade||!phase||!field||!content)return;
  const ph=phaseByGrade[gradeNum()]||3;
  phase.value='Fase '+ph;phase.disabled=true;
  const data=dataFor(ph);
  if(!data){
    console.error('Base curricular no encontrada', {fase:ph, claves:Object.keys(window).filter(k=>k.indexOf('PLANEAnEM_FASE_')===0)});
    content.innerHTML='<option value="">No se pudo cargar la base curricular</option>';
    renderPdas(null);
    return;
  }
  populateFields(data);
  fillContents();
}
function showStep(i){i=Math.max(0,Math.min(3,i));panels.forEach((p,j)=>p.classList.toggle('active',j===i));steps.forEach((s,j)=>{s.classList.toggle('active',j===i);s.classList.toggle('done',j<i)});if(i===3)buildReview()}
function saveCurrentPlan(){

  const get=id=>$('#'+id)?.value||'';

  const item=itemsFor()[Number(content?.value)];

  const plan={
  id:editingPlanId || Date.now(),

  createdAt:editingPlanId
    ? (getSavedPlans().find(p=>p.id===editingPlanId)?.createdAt || new Date().toISOString())
    : new Date().toISOString(),

    school:{
      name:clean(get('schoolName')),
      cct:clean(get('schoolCct')),
      locality:clean(get('schoolLocality')),
      zone:clean(get('schoolZone')),
      logo:schoolLogoData||''
    },

    academic:{
      grade:clean(get('grade')),
      phase:clean(get('phase')),
      field:clean(get('field')),
      duration:clean(get('duration'))
    },

    project:{
  name:clean(get('projectName')),
  temporalidad:clean(get('temporalidad')),
  startDate:clean(get('startDate')),
  scenario:clean(get('scenario')),
  methodology:clean(get('methodology'))
},

    axes:$$('.axes-box input[type="checkbox"]:checked')
      .map(x=>x.value)
      .filter(Boolean),

    content:{
      content:clean(item?.content||''),
      pdas:$$('#pda input:checked')
        .map(x=>x.value)
        .filter(Boolean)
    },

    context:get('context').trim()
  };

  const plans=JSON.parse(
    localStorage.getItem('creatividad_docente_planes')||'[]'
  );

  if(editingPlanId){

  const index=plans.findIndex(p=>p.id===editingPlanId);

  if(index>=0){
    plans[index]=plan;
  }else{
    plans.unshift(plan);
  }

}else{

  plans.unshift(plan);

}

localStorage.setItem(
  'creatividad_docente_planes',
  JSON.stringify(plans)
);

  toast('✓ Planeación guardada correctamente.');

  return plan;
}

window.saveCurrentPlan=saveCurrentPlan;
function getSavedPlans(){

  try{

    return JSON.parse(
      localStorage.getItem('creatividad_docente_planes')||'[]'
    );

  }catch(error){

    console.error('No se pudieron leer las planeaciones guardadas.',error);
    return [];

  }
}


function renderSavedPlans(){

  const container=$('#plansContainer');

  if(!container)return;

  const plans=getSavedPlans();

  if(!plans.length){

    container.innerHTML=`
      <div class="empty-plans">
        <div class="empty-plans-icon">📚</div>
        <h3>Aún no tienes planeaciones guardadas</h3>
        <p>
          Cuando guardes una planeación aparecerá aquí para que puedas
          consultarla y administrarla.
        </p>
        <button
          type="button"
          class="new-plan-button"
          onclick="showView('nueva')"
        >
          ＋ Crear mi primera planeación
        </button>
      </div>
    `;

    return;
  }

  const search=clean($('#plansSearch')?.value||'').toLowerCase();

  const filtered=plans.filter(plan=>{

    const text=[
      plan.project?.name,
      plan.school?.name,
      plan.academic?.grade,
      plan.academic?.field,
      plan.project?.scenario,
      plan.project?.methodology
    ].join(' ').toLowerCase();

    return text.includes(search);

  });

  if(!filtered.length){

    container.innerHTML=`
      <div class="empty-plans">
        <div class="empty-plans-icon">🔎</div>
        <h3>No encontramos planeaciones</h3>
        <p>Prueba con otro término de búsqueda.</p>
      </div>
    `;

    return;
  }

  container.innerHTML=filtered.map((plan,index)=>{

    const date=plan.createdAt
      ? new Date(plan.createdAt).toLocaleDateString('es-MX',{
          day:'2-digit',
          month:'2-digit',
          year:'numeric'
        })
      : 'Sin fecha';

    const project=plan.project?.name||'Proyecto sin nombre';
    const school=plan.school?.name||'Escuela no indicada';
    const grade=plan.academic?.grade||'Grado no indicado';
    const field=plan.academic?.field||'Campo no indicado';
    const temporalidad=plan.project?.temporalidad||'Temporalidad no indicada';

    return `
      <article class="saved-plan-card">

        <div class="saved-plan-icon">
          📘
        </div>

        <div class="saved-plan-content">

          <div class="saved-plan-top">
            <span class="saved-plan-date">
              Guardada el ${date}
            </span>
          </div>

          <h3>${project}</h3>

          <p class="saved-plan-school">
            🏫 ${school}
          </p>

          <div class="saved-plan-meta">
            <span>🎓 ${grade}</span>
            <span>📚 ${field}</span>
            <span>📅 ${temporalidad}</span>
          </div>

        </div>

        <div class="saved-plan-actions">

          <button
            type="button"
            onclick="openSavedPlan(${plan.id})"
            title="Abrir planeación"
          >
            👁 Abrir
          </button>

          <button
            type="button"
            onclick="deleteSavedPlan(${plan.id})"
            class="delete-plan"
            title="Eliminar planeación"
          >
            🗑
          </button>

        </div>

      </article>
    `;

  }).join('');
}


window.renderSavedPlans=renderSavedPlans;
$('#plansSearch')?.addEventListener('input',renderSavedPlans);
function deleteSavedPlan(id){

  const plans=getSavedPlans();

  const plan=plans.find(p=>p.id===id);

  if(!plan)return;
  const name=plan.project?.name||'esta planeación';

  if(!confirm(`¿Deseas eliminar "${name}"?`))return;

  const updated=plans.filter(p=>p.id!==id);

  localStorage.setItem(
    'creatividad_docente_planes',
    JSON.stringify(updated)
  );

  renderSavedPlans();

  toast('Planeación eliminada.');

}

window.deleteSavedPlan=deleteSavedPlan;
function openSavedPlan(id){

  const plans=getSavedPlans();
  const plan=plans.find(p=>p.id===id);

  if(!plan)return;

  editingPlanId=plan.id;
  schoolLogoData=plan.school?.logo||'';

  const set=(id,value)=>{
    const el=$('#'+id);
    if(el)el.value=value??'';
  };

  // =========================
  // DATOS DE LA ESCUELA
  // =========================

  set('schoolName',plan.school?.name);
  set('schoolCct',plan.school?.cct);
  set('schoolLocality',plan.school?.locality);
  set('schoolZone',plan.school?.zone);

  // =========================
  // DATOS ACADÉMICOS
  // =========================

  set('grade',plan.academic?.grade);
  set('phase',plan.academic?.phase);
  set('field',plan.academic?.field);
  set('duration',plan.academic?.duration);

  // =========================
  // DATOS DEL PROYECTO
  // =========================

  set('projectName',plan.project?.name);
set('temporalidad',plan.project?.temporalidad);
set('startDate',plan.project?.startDate);
set('scenario',plan.project?.scenario);
set('methodology',plan.project?.methodology);

  // =========================
  // CONTEXTO
  // =========================

  set('context',plan.context);
// =========================
// EJES ARTICULADORES
// =========================

$$('.axes-box input[type="checkbox"]').forEach(input=>{
  input.checked=(plan.axes||[]).includes(input.value);
});
  // =========================
  // ABRIR NUEVA PLANEACIÓN
  // =========================
window.__openingSavedPlan=true;
  showView('nueva');
  showStep(1);

  // Esperamos a que se actualice el currículo
  setTimeout(()=>{

    const item=itemsFor();
    const savedContent=plan.content?.content||'';

    const foundIndex=item.findIndex(
      x=>clean(x.content)===clean(savedContent)
    );

    if(foundIndex>=0){

      content.value=String(foundIndex);

      renderPdas(item[foundIndex]);

      setTimeout(()=>{

        const savedPdas=plan.content?.pdas||[];

        $$('#pda input').forEach(input=>{
          input.checked=savedPdas.includes(input.value);
        });

      },50);

    }

  },100);

  toast('Planeación cargada.');

}

window.openSavedPlan=openSavedPlan;
function buildReview(){
  const get=id=>$('#'+id)?.value||'';

  const school=clean(get('schoolName'))||'—';
  const cct=clean(get('schoolCct'))||'—';
  const locality=clean(get('schoolLocality'))||'—';
  const zone=clean(get('schoolZone'))||'—';
  const gradeValue=clean(get('grade'))||'—';
  const phaseValue=clean(get('phase'))||'—';
  const fieldValue=clean(get('field'))||'—';
  const duration=clean(get('duration'))||'—';
const startDateRaw=get('startDate');
const startDate=startDateRaw
  ? new Date(startDateRaw+'T00:00:00').toLocaleDateString('es-MX',{
      day:'2-digit',
      month:'long',
      year:'numeric'
    })
  : '—';
  const scenario=clean(get('scenario'))||'No indicado';
  const methodology=clean(get('methodology'))||'No indicada';
  const project=clean(get('projectName'))||'No indicado';
const temporalidad=clean(get('temporalidad'))||'No indicada';
const logoHtml=schoolLogoData
  ? '<div style="text-align:center;margin-bottom:18px;">'+
      '<img src="'+schoolLogoData+'" alt="Logo de la escuela" style="max-width:120px;max-height:120px;object-fit:contain;border-radius:8px;">'+
    '</div>'
  : '';
  const context=get('context').trim();

  const item=itemsFor()[Number(content?.value)];
  const contentValue=clean(item?.content||'')||'—';

  const pdas=$$('#pda input:checked')
    .map(x=>x.value)
    .filter(Boolean);

  const axes=$$('.axes-box input[type="checkbox"]:checked')
    .map(x=>x.value)
    .filter(Boolean);

  /*
   * ---------------------------------------------------------
   * GENERADOR DIDÁCTICO
   * ---------------------------------------------------------
   */

  const textoBase=(contentValue+' '+pdas.join(' ')+' '+context).toLowerCase();

  let enfoque='';

  if(
    textoBase.includes('matemát') ||
    textoBase.includes('número') ||
    textoBase.includes('fracción') ||
    textoBase.includes('multiplic') ||
    textoBase.includes('división') ||
    textoBase.includes('medida')
  ){
    enfoque=
      'resolver situaciones problemáticas, explicar procedimientos, comparar estrategias y justificar las respuestas obtenidas.';
  }
  else if(
    textoBase.includes('lectura') ||
    textoBase.includes('texto') ||
    textoBase.includes('escritura') ||
    textoBase.includes('lengua') ||
    textoBase.includes('cuento') ||
    textoBase.includes('narr')
  ){
    enfoque=
      'comprender, analizar, producir y comunicar información mediante diferentes tipos de textos y situaciones comunicativas.';
  }
  else if(
    textoBase.includes('ciencia') ||
    textoBase.includes('seres vivos') ||
    textoBase.includes('cuerpo') ||
    textoBase.includes('ambiente') ||
    textoBase.includes('ecosistema') ||
    textoBase.includes('natur')
  ){
    enfoque=
      'observar, formular preguntas, analizar información, explicar fenómenos y construir conclusiones a partir de evidencias.';
  }
  else if(
    textoBase.includes('historia') ||
    textoBase.includes('comunidad') ||
    textoBase.includes('cultura') ||
    textoBase.includes('sociedad') ||
    textoBase.includes('territorio')
  ){
    enfoque=
      'analizar situaciones de su entorno, recuperar conocimientos de la comunidad, comparar perspectivas y construir explicaciones.';
  }
  else{
    enfoque=
      'explorar el contenido, recuperar saberes previos, analizar información, construir explicaciones y aplicar los aprendizajes en situaciones significativas.';
  }

  const inicio=
  '<div class="didactic-stage">'+
    '<div class="stage-header">'+
      '<span class="stage-icon">🚀</span>'+
      '<div>'+
        '<h4>Inicio</h4>'+
        '<small>Activación de saberes previos y presentación de la situación</small>'+
      '</div>'+
    '</div>'+

    '<div class="stage-grid">'+

      '<div class="stage-card">'+
        '<span class="stage-card-icon">🎯</span>'+
        '<div>'+
          '<strong>Propósito</strong>'+
          '<p>Recuperar los saberes previos del alumnado y despertar su interés por el contenido.</p>'+
        '</div>'+
      '</div>'+

      '<div class="stage-card">'+
        '<span class="stage-card-icon">👩‍🏫</span>'+
        '<div>'+
          '<strong>Intervención docente</strong>'+
          '<p>La docente o el docente presenta una situación relacionada con <b>'+contentValue+'</b> y plantea preguntas detonadoras.</p>'+
        '</div>'+
      '</div>'+

      '<div class="stage-card">'+
        '<span class="stage-card-icon">👥</span>'+
        '<div>'+
          '<strong>Participación del alumnado</strong>'+
          '<p>Las y los estudiantes comparten lo que saben, expresan experiencias relacionadas con el tema e identifican dudas e intereses.</p>'+
        '</div>'+
      '</div>'+

      '<div class="stage-card">'+
        '<span class="stage-card-icon">💬</span>'+
        '<div>'+
          '<strong>Preguntas detonadoras</strong>'+
          '<ul>'+
            '<li>¿Qué sabemos sobre este tema?</li>'+
            '<li>¿Qué experiencias tenemos relacionadas con esta situación?</li>'+
            '<li>¿Qué necesitamos investigar o comprender?</li>'+
          '</ul>'+
        '</div>'+
      '</div>'+

    '</div>'+
  '</div>';


const desarrollo=
  '<div class="didactic-stage">'+
    '<div class="stage-header">'+
      '<span class="stage-icon">🔎</span>'+
      '<div>'+
        '<h4>Desarrollo</h4>'+
        '<small>Construcción, aplicación y socialización de los aprendizajes</small>'+
      '</div>'+
    '</div>'+

    '<div class="activity-list">'+

      '<div class="activity-item">'+
        '<div class="activity-number">1</div>'+
        '<div>'+
          '<strong>Exploración de la situación</strong>'+
          '<p>Analizar la situación planteada y relacionarla con experiencias del contexto del alumnado.</p>'+
        '</div>'+
      '</div>'+

      '<div class="activity-item">'+
        '<div class="activity-number">2</div>'+
        '<div>'+
          '<strong>Investigación y consulta</strong>'+
          '<p>Consultar información en libros de texto, materiales del aula y otras fuentes pertinentes.</p>'+
        '</div>'+
      '</div>'+

      '<div class="activity-item">'+
        '<div class="activity-number">3</div>'+
        '<div>'+
          '<strong>Organización de la información</strong>'+
          '<p>Registrar y organizar información mediante esquemas, tablas, dibujos, textos o representaciones según corresponda.</p>'+
        '</div>'+
      '</div>'+

      '<div class="activity-item">'+
        '<div class="activity-number">4</div>'+
        '<div>'+
          '<strong>Aplicación de los aprendizajes</strong>'+
          '<p>Resolver las actividades propuestas utilizando diferentes estrategias para '+enfoque+'</p>'+
        '</div>'+
      '</div>'+

      '<div class="activity-item">'+
        '<div class="activity-number">5</div>'+
        '<div>'+
          '<strong>Trabajo colaborativo</strong>'+
          '<p>Compartir procedimientos, argumentos y resultados con sus compañeras y compañeros.</p>'+
        '</div>'+
      '</div>'+

      '<div class="activity-item">'+
        '<div class="activity-number">6</div>'+
        '<div>'+
          '<strong>Retroalimentación</strong>'+
          '<p>Recibir retroalimentación, revisar las producciones y realizar los ajustes necesarios.</p>'+
        '</div>'+
      '</div>'+

    '</div>'+
  '</div>';


const cierre=
  '<div class="didactic-stage">'+
    '<div class="stage-header">'+
      '<span class="stage-icon">🏁</span>'+
      '<div>'+
        '<h4>Cierre</h4>'+
        '<small>Socialización, reflexión y consolidación de los aprendizajes</small>'+
      '</div>'+
    '</div>'+

    '<div class="stage-grid">'+

      '<div class="stage-card">'+
        '<span class="stage-card-icon">📢</span>'+
        '<div>'+
          '<strong>Socialización</strong>'+
          '<p>Las y los estudiantes presentan los resultados o productos elaborados.</p>'+
        '</div>'+
      '</div>'+

      '<div class="stage-card">'+
        '<span class="stage-card-icon">🔄</span>'+
        '<div>'+
          '<strong>Comparación</strong>'+
          '<p>Se comparan diferentes estrategias, procedimientos o explicaciones.</p>'+
        '</div>'+
      '</div>'+

      '<div class="stage-card">'+
        '<span class="stage-card-icon">🧠</span>'+
        '<div>'+
          '<strong>Metacognición</strong>'+
          '<p>El alumnado explica qué aprendió, cómo lo aprendió y qué dificultades enfrentó.</p>'+
        '</div>'+
      '</div>'+

      '<div class="stage-card">'+
        '<span class="stage-card-icon">🔄</span>'+
        '<div>'+
          '<strong>Continuidad</strong>'+
          '<p>Se identifican los aspectos que requieren continuar trabajándose y fortalecerse.</p>'+
        '</div>'+
      '</div>'+

    '</div>'+
  '</div>';

  const producto=
    'Producto o evidencia relacionado con el contenido y los PDA seleccionados, elaborado a partir de las actividades desarrolladas por el alumnado.';

  const evaluacion=
    '<ul>'+
      '<li><b>Comprensión:</b> identifica y explica los aprendizajes relacionados con el contenido.</li>'+
      '<li><b>Aplicación:</b> utiliza sus conocimientos para resolver las actividades propuestas.</li>'+
      '<li><b>Argumentación:</b> explica sus procedimientos, ideas o conclusiones.</li>'+
      '<li><b>Participación:</b> interviene de manera activa y respetuosa.</li>'+
      '<li><b>Colaboración:</b> trabaja con otras personas y considera diferentes puntos de vista.</li>'+
      '<li><b>Reflexión:</b> reconoce sus avances y aspectos que necesita fortalecer.</li>'+
    '</ul>';

  const preguntas=
    '<ul>'+
      '<li>¿Qué aprendí?</li>'+
      '<li>¿Cómo resolví o comprendí la situación?</li>'+
      '<li>¿Qué estrategia me funcionó mejor?</li>'+
      '<li>¿Qué dificultad tuve y cómo la solucioné?</li>'+
      '<li>¿Dónde puedo aplicar lo aprendido?</li>'+
    '</ul>';

  const axesHtml=axes.length
    ? axes.map(x=>'<li>'+clean(x)+'</li>').join('')
    : '<li>No se seleccionaron ejes articuladores.</li>';

  const pdasHtml=pdas.length
    ? pdas.map(x=>'<li>'+clean(x)+'</li>').join('')
    : '<li>No se seleccionaron PDA.</li>';

  const safeContext=context
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');

  const html=
  '<div class="generated-plan" style="display:grid;gap:22px;margin-top:20px">'+

      logoHtml+

      '<section class="review-section">'+
        '<h3>1. Datos generales</h3>'+
        '<div style="display:grid;gap:8px">'+
          '<div><b>Escuela:</b> '+school+'</div>'+
'<div><b>CCT:</b> '+cct+'</div>'+
'<div><b>Localidad:</b> '+locality+'</div>'+
'<div><b>Zona escolar:</b> '+zone+'</div>'+
'<div><b>Fecha de inicio:</b> '+(
  get('startDate')
    ? new Date(get('startDate')+'T00:00:00').toLocaleDateString('es-MX',{
        day:'2-digit',
        month:'2-digit',
        year:'numeric'
      })
    : 'dd/mm/aaaa'
)+'</div>'+
          '<div><b>Grado:</b> '+gradeValue+'</div>'+
          '<div><b>Fase:</b> '+phaseValue+'</div>'+
          '<div><b>Campo formativo:</b> '+fieldValue+'</div>'+
          '<div><b>Duración:</b> '+duration+'</div>'+
        '</div>'+
      '</section>'+

'<section class="review-section project-section">'+
  '<h3>2. Proyecto</h3>'+
  '<div class="project-info-grid">'+

    '<div class="project-info-card">'+
      '<span class="project-label">📌 Nombre del proyecto</span>'+
      '<strong>'+project+'</strong>'+
    '</div>'+

    '<div class="project-info-card">'+
      '<span class="project-label">📅 Temporalidad</span>'+
      '<strong>'+temporalidad+'</strong>'+
    '</div>'+

    '<div class="project-info-card">'+
      '<span class="project-label">📍 Escenario</span>'+
      '<strong>'+scenario+'</strong>'+
    '</div>'+

    '<div class="project-info-card">'+
      '<span class="project-label">🧩 Metodología</span>'+
      '<strong>'+methodology+'</strong>'+
    '</div>'+

  '</div>'+
'</section>'+

      '<section class="review-section">'+
        '<h3>3. Ejes articuladores</h3>'+
        '<ul style="margin:10px 0 0 20px;padding:0;line-height:1.7">'+
          axesHtml+
        '</ul>'+
      '</section>'+

      '<section class="review-section">'+
        '<h3>4. Contenido y PDA</h3>'+
        '<div style="display:grid;gap:10px">'+
          '<div><b>Contenido:</b></div>'+
          '<div>'+contentValue+'</div>'+
          '<div><b>PDA seleccionados:</b></div>'+
          '<ol style="margin:0 0 0 20px;padding:0;line-height:1.7">'+
            pdasHtml+
          '</ol>'+
        '</div>'+
      '</section>'+

      '<section class="review-section">'+
        '<h3>5. Contexto y necesidades del grupo</h3>'+
        '<div style="white-space:pre-wrap;line-height:1.7;padding:16px;border-radius:10px;background:#f7f8fc">'+
          (safeContext||'—')+
        '</div>'+
      '</section>'+

      '<section class="review-section">'+
        '<h3>6. Planeación didáctica</h3>'+

        '<div style="display:grid;gap:18px">'+

          '<div>'+
            '<h4>Propósito de aprendizaje</h4>'+
            '<p>Favorecer que las y los estudiantes desarrollen los aprendizajes relacionados con el contenido seleccionado y los PDA, mediante experiencias significativas vinculadas con su contexto.</p>'+
          '</div>'+

          '<div>'+
            '<h4>Inicio</h4>'+
            inicio+
          '</div>'+

          '<div>'+
            '<h4>Desarrollo</h4>'+
            desarrollo+
          '</div>'+

          '<div>'+
            '<h4>Cierre</h4>'+
            cierre+
          '</div>'+

          '<div>'+
            '<h4>Producto o evidencia</h4>'+
            '<p>'+producto+'</p>'+
          '</div>'+

        '</div>'+
      '</section>'+

      '<section class="review-section">'+
        '<h3>7. Recursos y materiales</h3>'+
        '<ul>'+
          '<li>Libros de texto y materiales disponibles en el aula.</li>'+
          '<li>Cuaderno del alumnado.</li>'+
          '<li>Hojas, cartulinas o materiales de producción.</li>'+
          '<li>Materiales concretos relacionados con las actividades.</li>'+
          '<li>Recursos digitales cuando sean pertinentes.</li>'+
          '<li>Fuentes de información disponibles en la escuela y comunidad.</li>'+
        '</ul>'+
      '</section>'+

      '<section class="review-section">'+
        '<h3>8. Evaluación formativa</h3>'+
        '<p>Durante el desarrollo de las actividades se observará el proceso de aprendizaje y se proporcionará retroalimentación oportuna.</p>'+
        evaluacion+
      '</section>'+

      '<section class="review-section">'+
  '<h3>9. Preguntas para la reflexión</h3>'+
  preguntas+
'</section>'+

'<div class="plan-actions">'+
  '<button type="button" class="plan-save-btn" onclick="saveCurrentPlan()">'+
    '💾 Guardar planeación'+
  '</button>'+
  '<button type="button" class="plan-print-btn" onclick="window.print()">'+
    '🖨️ Imprimir'+
  '</button>'+
'</div>'+

'</div>';

  if($('#review'))$('#review').innerHTML=html;
}
steps.forEach(s=>s.addEventListener('click',()=>showStep(Number(s.dataset.step))));
$$('[data-next]').forEach(b=>b.addEventListener('click',()=>showStep(Number(b.dataset.next))));
$$('[data-prev]').forEach(b=>b.addEventListener('click',()=>showStep(Number(b.dataset.prev))));
grade?.addEventListener('change',refreshCurriculum);
field?.addEventListener('change',fillContents);
content?.addEventListener('change',()=>renderPdas(itemsFor()[Number(content.value)]));
$('#planningForm')?.addEventListener('submit',e=>{e.preventDefault();buildReview();toast('¡Planeación generada! Revisa el contenido y PDA seleccionados.')});
refreshCurriculum();showStep(0);
window.mostrarMisPlaneaciones=function(){

  console.log('PRUEBA MIS PLANEACIONES');

  const planes=document.getElementById('planes');
  const nueva=document.getElementById('nueva');
  const contenido=document.querySelector('.content');
  const heading=document.querySelector('.heading');
  const grid=document.querySelector('.grid-top');
  const lower=document.querySelector('.lower');

  console.log({
    planes,
    nueva,
    contenido,
    heading,
    grid,
    lower
  });

  if(heading) heading.style.display='none';
  if(grid) grid.style.display='none';
  if(lower) lower.style.display='none';
  if(nueva) nueva.style.display='none';

  if(planes){
    planes.style.display='block';
    planes.style.visibility='visible';
    planes.style.opacity='1';
  }

  if(typeof renderSavedPlans==='function'){
    renderSavedPlans();
  }

};
})();
