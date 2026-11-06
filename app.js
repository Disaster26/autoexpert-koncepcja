(function(){
  // menu mobilne
  var burger=document.querySelector('.burger'),menu=document.getElementById('menu-mob');
  function zamknij(){burger.setAttribute('aria-expanded','false');burger.setAttribute('aria-label','Otwórz menu');menu.hidden=true}
  burger.addEventListener('click',function(){
    var o=burger.getAttribute('aria-expanded')==='true';
    if(o){zamknij()}else{burger.setAttribute('aria-expanded','true');burger.setAttribute('aria-label','Zamknij menu');menu.hidden=false}
  });
  menu.addEventListener('click',function(e){if(e.target.closest('a'))zamknij()});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!menu.hidden)zamknij()});
  window.addEventListener('resize',function(){if(innerWidth>1100&&!menu.hidden)zamknij()});

  // karuzele w kartach: palec, mysz, strzałki, klawiatura
  var strz='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.4"/></svg>';
  document.querySelectorAll('[data-car]').forEach(function(car){
    var tr=car.querySelector('.car-track'),imgs=tr.querySelectorAll('img'),n=imgs.length;
    if(n<2)return;
    var prev=document.createElement('button'),next=document.createElement('button');
    prev.className='car-btn car-prev';next.className='car-btn car-next';
    prev.type=next.type='button';prev.setAttribute('aria-label','Poprzednie zdjęcie');next.setAttribute('aria-label','Następne zdjęcie');
    prev.innerHTML=strz.replace('M9 5l7 7-7 7','M15 5l-7 7 7 7');next.innerHTML=strz;
    var dots=document.createElement('div');dots.className='car-dots';
    for(var i=0;i<n;i++)dots.appendChild(document.createElement('i'));
    var cnt=document.createElement('span');cnt.className='car-n';
    car.append(prev,next,dots,cnt);
    function idx(){return Math.round(tr.scrollLeft/tr.clientWidth)}
    function upd(){var k=idx();dots.querySelectorAll('i').forEach(function(d,j){d.classList.toggle('on',j===k)});cnt.textContent=(k+1)+' / '+n;prev.disabled=k<=0;next.disabled=k>=n-1}
    function go(k){k=Math.max(0,Math.min(n-1,k));tr.scrollTo({left:k*tr.clientWidth,behavior:'smooth'})}
    prev.addEventListener('click',function(){go(idx()-1)});
    next.addEventListener('click',function(){go(idx()+1)});
    tr.addEventListener('scroll',function(){requestAnimationFrame(upd)},{passive:true});
    tr.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){e.preventDefault();go(idx()+1)}if(e.key==='ArrowLeft'){e.preventDefault();go(idx()-1)}});
    // przeciąganie myszą
    var down=false,sx=0,sl=0,moved=false;
    tr.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;down=true;moved=false;sx=e.clientX;sl=tr.scrollLeft;tr.classList.add('drag');tr.setPointerCapture(e.pointerId)});
    tr.addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-sx;if(Math.abs(dx)>4)moved=true;tr.scrollLeft=sl-dx});
    function up(e){if(!down)return;down=false;tr.classList.remove('drag');var dx=e.clientX-sx;var k=Math.round(sl/tr.clientWidth)+(dx<-40?1:dx>40?-1:0);go(k)}
    tr.addEventListener('pointerup',up);tr.addEventListener('pointercancel',up);
    tr.addEventListener('click',function(e){if(moved){e.preventDefault();e.stopPropagation()}},true);
    upd();
  });

  // linki "zapytaj o termin" ustawiają temat formularza
  var sel=document.getElementById('temat');
  document.querySelectorAll('[data-temat]').forEach(function(a){
    a.addEventListener('click',function(){var t=a.getAttribute('data-temat');for(var i=0;i<sel.options.length;i++){if(sel.options[i].text===t){sel.selectedIndex=i;break}}});
  });

  // formularz pokazowy (bez wysyłki)
  var f=document.getElementById('form'),msg=document.getElementById('form-msg');
  f.addEventListener('submit',function(e){
    e.preventDefault();
    if(!f.checkValidity()){msg.className='form-msg err';msg.textContent='Uzupełnij imię, telefon i zaznacz zgodę.';return}
    msg.className='form-msg ok';msg.textContent='Dziękujemy! To wersja pokazowa - na gotowej stronie wiadomość trafi prosto do warsztatu.';
  });

  // dolny pasek po przewinięciu za przycisk w hero
  var mob=document.getElementById('mob'),cta=document.getElementById('hero-cta');
  if('IntersectionObserver' in window&&cta){
    new IntersectionObserver(function(en){var e=en[0];mob.classList.toggle('widac',!e.isIntersecting&&e.boundingClientRect.top<0)}).observe(cta);
  }
})();
