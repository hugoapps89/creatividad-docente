(function(){
'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const dashboard=$('.content'), planner=$('#nueva');
function toast(msg){const t=$('#toast');if(!t)return;t.textContent=msg;t.style.display='block';clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.style.display='none',2800)}
window.toast=toast;
window.toggleMenu=()=>$('#sidebar')?.classList.toggle('open');
window.showView=function(id){
  if(id==='nueva'){
    dashboard?.querySelectorAll(':scope > *').forEach(el=>{if(el.id!=='nueva'&&el.tagName!=='FOOTER')el.style.display='none'});
    if(planner)planner.style.display='block';
    $$('.nav a').forEach(a=>a.classList.toggle('active',a.dataset.action==='new'));
    window.scrollTo({top:0,behavior:'smooth'});refreshCurriculum();
  }else{
    dashboard?.querySelectorAll(':scope > *').forEach(el=>{if(el.id!=='nueva'&&el.tagName!=='FOOTER')el.style.display=''});
    if(planner)planner.style.display='none';
    $$('.nav a').forEach(a=>a.classList.toggle('active',a.dataset.action===id));
    window.scrollTo({top:0,behavior:'smooth'});
  }
};
$$('.nav a').forEach(a=>a.addEventListener('click',e=>{if(a.dataset.action){e.preventDefault();showView(a.dataset.action==='new'?'nueva':a.dataset.action)}}));
if($('#today'))$('#today').textContent=new Date().toLocaleDateString('es-MX',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
$('#search')?.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.value.trim())toast('Buscando: '+e.target.value.trim())});
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();$('#search')?.focus()}});

const panels=$$('.wizard-panel'),steps=$$('.planner .step'),grade=$('#grade'),phase=$('#phase'),field=$('#field'),content=$('#content'),pda=$('#pda');
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

  const scenario=clean(get('scenario'))||'No indicado';
  const methodology=clean(get('methodology'))||'No indicada';
  const project=clean(get('projectName'))||'No indicado';

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
    '<p>La docente o el docente presenta una situación relacionada con el contenido <b>'+
    contentValue+
    '</b> y recupera los saberes previos del grupo mediante preguntas detonadoras.</p>'+
    '<ul>'+
      '<li>¿Qué sabemos sobre este tema?</li>'+
      '<li>¿Qué experiencias tenemos relacionadas con esta situación?</li>'+
      '<li>¿Qué necesitamos investigar o comprender?</li>'+
    '</ul>'+
    '<p>Se recuperan las respuestas del alumnado y se identifican los conocimientos, dudas e intereses que servirán como punto de partida.</p>';

  const desarrollo=
    '<p>El alumnado realiza actividades individuales y colaborativas orientadas a <b>'+
    enfoque+
    '</b></p>'+
    '<ol>'+
      '<li>Analizar la situación planteada y relacionarla con experiencias de su contexto.</li>'+
      '<li>Consultar información en libros de texto, materiales del aula y otras fuentes pertinentes.</li>'+
      '<li>Organizar la información mediante registros, esquemas, tablas, dibujos, textos o representaciones según corresponda.</li>'+
      '<li>Resolver las actividades propuestas utilizando diferentes estrategias.</li>'+
      '<li>Compartir procedimientos, argumentos y resultados con sus compañeras y compañeros.</li>'+
      '<li>Recibir retroalimentación y realizar ajustes a sus producciones.</li>'+
    '</ol>';

  const cierre=
    '<p>El grupo socializa los principales aprendizajes construidos durante la experiencia.</p>'+
    '<ul>'+
      '<li>Se presentan los resultados o productos elaborados.</li>'+
      '<li>Se comparan diferentes estrategias o explicaciones.</li>'+
      '<li>Se recuperan las ideas principales.</li>'+
      '<li>El alumnado explica qué aprendió y cómo lo aprendió.</li>'+
      '<li>Se identifican aspectos que requieren continuar trabajándose.</li>'+
    '</ul>';

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

      '<section class="review-section">'+
        '<h3>1. Datos generales</h3>'+
        '<div style="display:grid;gap:8px">'+
          '<div><b>Escuela:</b> '+school+'</div>'+
          '<div><b>CCT:</b> '+cct+'</div>'+
          '<div><b>Localidad:</b> '+locality+'</div>'+
          '<div><b>Zona escolar:</b> '+zone+'</div>'+
          '<div><b>Grado:</b> '+gradeValue+'</div>'+
          '<div><b>Fase:</b> '+phaseValue+'</div>'+
          '<div><b>Campo formativo:</b> '+fieldValue+'</div>'+
          '<div><b>Duración:</b> '+duration+'</div>'+
        '</div>'+
      '</section>'+

      '<section class="review-section">'+
        '<h3>2. Proyecto</h3>'+
        '<div style="display:grid;gap:8px">'+
          '<div><b>Nombre del proyecto:</b> '+project+'</div>'+
          '<div><b>Escenario:</b> '+scenario+'</div>'+
          '<div><b>Metodología:</b> '+methodology+'</div>'+
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
})();
