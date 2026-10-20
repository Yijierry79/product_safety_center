(() => {
 'use strict';
 const header=document.querySelector('.header');
 const menu=header.querySelector('.nav_btn');
 const mobile=matchMedia('(max-width:1200px)');
 let lastY=scrollY;
 const closeMenu=(focus=false)=>{header.classList.remove('menu-open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open menu');document.body.style.overflow='';if(focus)menu.focus();};
 menu.addEventListener('click',()=>{const open=!header.classList.contains('menu-open');header.classList.toggle('menu-open',open);menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close menu':'Open menu');document.body.style.overflow=open?'hidden':'';header.classList.remove('hideHeader');});
 mobile.addEventListener('change',()=>{closeMenu();document.querySelectorAll('.submenu-open').forEach(el=>el.classList.remove('submenu-open'));});
 header.querySelectorAll('.TWnavBtn').forEach(toggle=>{
  toggle.setAttribute('role','button');toggle.tabIndex=0;toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label',`Expand ${toggle.parentElement.querySelector('a').textContent.trim()} menu`);
  const action=()=>{const item=toggle.closest('li'),open=!item.classList.contains('submenu-open');item.classList.toggle('submenu-open',open);toggle.setAttribute('aria-expanded',String(open));};
  toggle.addEventListener('click',event=>{if(mobile.matches){event.preventDefault();action();}});toggle.addEventListener('keydown',event=>{if(event.key===' '||event.key==='Enter'){event.preventDefault();action();}});
 });
 header.querySelectorAll('.logo a,.nav a').forEach(link=>link.addEventListener('click',()=>closeMenu()));
 const language=header.querySelector('.change');language.tabIndex=0;language.setAttribute('role','button');language.setAttribute('aria-label','Choose language');language.setAttribute('aria-expanded','false');
 const toggleLanguage=()=>{const open=!language.classList.contains('language-open');language.classList.toggle('language-open',open);language.setAttribute('aria-expanded',String(open));};
 language.addEventListener('click',event=>{if(!event.target.closest('a'))toggleLanguage();});language.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();toggleLanguage();}});
 document.addEventListener('keydown',event=>{
  if(event.key==='Escape'){if(header.classList.contains('menu-open'))closeMenu(true);language.classList.remove('language-open');language.setAttribute('aria-expanded','false');}
  if(event.key==='Tab'&&header.classList.contains('menu-open')){
   const focusable=[...header.querySelectorAll('a,button,[tabindex="0"]')].filter(el=>el.getClientRects().length);
   const first=focusable[0],last=focusable.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  }
 });
 addEventListener('scroll',()=>{const y=scrollY;header.classList.toggle('scrollHeader',y>50&&!mobile.matches);header.classList.toggle('hideHeader',!mobile.matches&&y>180&&y>lastY&&!header.contains(document.activeElement));lastY=y;},{passive:true});
 document.querySelectorAll('a[target="_blank"]').forEach(a=>a.rel='noopener noreferrer');
 document.querySelectorAll('.footer_mind .right a').forEach((a,i)=>a.setAttribute('aria-label',i?'Streamax on YouTube':'Streamax on LinkedIn'));
 const data=window.securityAdvisories||[],year=document.querySelector('#advisory-year'),list=document.querySelector('#advisory-list'),pagination=document.querySelector('.pagination'),status=document.querySelector('.page-status'),empty=document.querySelector('.empty-state'),clear=document.querySelector('.reset-filter');
 let current=1;
 function makeRow(item){
  const row=document.createElement('li'),details=document.createElement('details'),summary=document.createElement('summary');details.className='advisory-item';details.dataset.id=item.id;
  const title=document.createElement('span');title.className='advisory-title';title.textContent=item.title;
  const arrow=document.createElement('span');arrow.className='double-arrow';arrow.setAttribute('aria-hidden','true');
  summary.append(title,arrow);
  const body=document.createElement('div');body.className='advisory-detail';const meta=document.createElement('p');meta.className='detail-meta';meta.textContent=`${item.year} · Demonstration only`;
  const description=document.createElement('p');description.textContent='This is a placeholder for an approved security advisory. Product details, affected versions and remediation guidance will be provided here before publication.';
  body.append(meta,description);details.append(summary,body);row.append(details);return row;
 }
 function render({moveFocus=false}={}){
  const filtered=data.filter(item=>year.value==='all'||item.year===year.value),pages=Math.ceil(filtered.length/10);current=Math.max(1,Math.min(current,pages||1));
  list.replaceChildren(...filtered.slice((current-1)*10,current*10).map(makeRow));empty.hidden=filtered.length>0;pagination.hidden=pages<2;clear.hidden=year.value==='all';
  const next=pagination.querySelector('[data-page="next"]'),previous=pagination.querySelector('[data-page="previous"]');next.disabled=current>=pages;previous.disabled=current<=1;
  const numbers=pagination.querySelector('.page-numbers');numbers.replaceChildren(...Array.from({length:pages},(_,i)=>{const button=document.createElement('button');button.type='button';button.dataset.page=String(i+1);button.textContent=String(i+1);button.setAttribute('aria-label',`Page ${i+1}`);if(current===i+1)button.setAttribute('aria-current','page');return button;}));
  status.textContent=filtered.length?`Showing ${(current-1)*10+1}–${Math.min(current*10,filtered.length)} of ${filtered.length} advisories · Page ${current} of ${pages}`:'No advisories to display.';
  if(moveFocus){list.querySelector('summary')?.focus({preventScroll:true});document.querySelector('.filter-bar').scrollIntoView({behavior:'instant',block:'start'});}
 }
 year.addEventListener('change',()=>{current=1;render();});
 const reset=()=>{year.value='all';current=1;render();year.focus({preventScroll:true});};clear.addEventListener('click',reset);document.querySelector('[data-clear-year]').addEventListener('click',reset);
 pagination.addEventListener('click',event=>{const button=event.target.closest('[data-page]');if(!button||button.disabled)return;current=button.dataset.page==='next'?current+1:button.dataset.page==='previous'?current-1:Number(button.dataset.page);render({moveFocus:true});});
 list.addEventListener('toggle',event=>{if(event.target.open&&event.target.matches('details'))list.querySelectorAll('details[open]').forEach(el=>{if(el!==event.target)el.open=false;});},true);
 document.querySelector('[data-template-placeholder]')?.addEventListener('click',()=>{document.querySelector('#template-status').textContent='Report template coming soon.';});
 render();
})();
