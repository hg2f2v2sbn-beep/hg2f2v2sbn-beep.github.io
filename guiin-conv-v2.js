/* 귀인사주 결과 화면 → 평생사주 결제 전환 보완 v2
 * 1) 첫 화면(만세력 카드 위)에 "내 사주에서 미리 찾은 것" 요약 + 결제 버튼
 * 2) 잠긴 항목의 "평생사주에서 열려"를 무엇을 알려 주는지 구체적으로 바꾸고, 누르면 결제로 연결
 * 3) 결제 버튼 아래에 안심 문구
 * 미결제 화면에서만 동작하고, 결제가 확인되면 1)은 사라짐. */
(function(root){
  'use strict';
  var doc=root.document;if(!doc)return;
  var UNPAID='[data-gptr-buy],.premiumPreview,[data-glf-buy="saju"]';
  var BTNS='[data-gptr-buy],[data-glf-buy="saju"],.premiumLock button';
  var LOCK={
    '잘 맞는 일':'맞는 직업 이름까지 콕 집어 알려 줘요',
    '지금 대운':'지금 10년이 어떤 시기인지, 언제 바뀌는지',
    '잘 맞는 사람':'어떤 사람을 만나야 편하고 잘 풀리는지',
    '감정 패턴':'지치고 우울해질 때 왜 그런지, 푸는 법',
    '이럴 때 답답해':'내가 유독 답답해지는 순간과 이유'
  };
  var TRUST='결제하면 바로 열려요 · 한 번 결제로 이 사주는 계속 다시 볼 수 있어요';

  function T(n){try{root.__guiinTrack&&root.__guiinTrack.once('screen',n);}catch(_e){}}
  function buy(src,compat){
    T(src);
    try{
      if(typeof root.guiinPaymentCenterStart==='function'){root.guiinPaymentCenterStart(compat?'PREMIUM_COMPAT':'LIFETIME_SAJU');return;}
      var f=compat?root.openCompatPay:root.openPremiumPay;if(typeof f==='function')f();
    }catch(_e){}
  }
  function nameOf(){
    try{if(typeof root.currentName==='function'){var n=root.currentName();if(n)return String(n);}}catch(_e){}
    return '';
  }

  function fromIlju(){
    try{var o=JSON.parse(sessionStorage.getItem('gwi_from_ilju')||'null');if(o&&/^[가-힣]{2}$/.test(o.day||'')){var cd='';try{cd=String((typeof chart!=='undefined'&&chart&&chart.pillars&&chart.pillars.day&&chart.pillars.day.ko)||'');}catch(_e){}if(cd&&cd!==o.day)return null;return {day:o.day,topic:String(o.topic||'').slice(0,30)};}}catch(_e){}
    return null;
  }
  function hook(v){
    var old=v.querySelector(':scope > .gcvHook');
    var peek=v.querySelector('.glfCard .glfPeek'),IL0=fromIlju();
    if(!peek&&!IL0){if(old)old.remove();return;}
    if(old)return;
    var anchor=v.querySelector(':scope > .manseSnapshot');if(!anchor)return;
    var rows=peek?peek.querySelectorAll('.glfPeekRow'):[];if(!rows.length&&!IL0)return;
    var box=doc.createElement('section');box.className='gcvHook';
    var nm=nameOf(),IL=fromIlju();
    if(IL){
      box.classList.add('gcvIlju');
      var k=doc.createElement('p');k.className='gcvK';k.textContent='📌 '+IL.day+'일주'+(IL.topic?' · '+IL.topic:'')+' 보고 오셨죠?';box.appendChild(k);
      var hh=doc.createElement('b');hh.className='gcvH';hh.textContent='게시물에서 본 건 내 사주 중 딱 2글자예요';box.appendChild(hh);
      var ex=doc.createElement('p');ex.className='gcvX';ex.textContent='같은 '+IL.day+'일주라도 나머지 글자에 따라 연애가 풀리는 해, 돈이 붙는 해가 사람마다 달라요. '+(rows.length?(nm?nm+'님':'내')+' 사주 전체로 계산해 보니:':'평생사주에서는 '+(nm?nm+'님':'내')+' 사주 전체로 그 시기를 연도까지 짚어 드려요.');box.appendChild(ex);
    }else{
      var h=doc.createElement('b');h.className='gcvT';h.textContent='🔍 '+(nm?nm+'님 ':'내 ')+'사주에서 미리 찾은 것';box.appendChild(h);
    }
    for(var i=0;i<rows.length&&i<2;i++){
      var c=rows[i].cloneNode(true);c.className='gcvRow';
      var em=c.querySelector('em');if(em)em.remove();
      box.appendChild(c);
    }
    if(rows.length){var s=doc.createElement('p');s.className='gcvS';s.textContent='그게 정확히 언제인지, 그때 뭘 하면 좋은지는 평생사주에서 알려 줘요.';box.appendChild(s);}
    var b=doc.createElement('button');b.type='button';b.className='gcvGo';b.textContent=rows.length?'언제인지 전부 열기 · 5,900원 ›':'내 시기 전부 열기 · 5,900원 ›';
    b.addEventListener('click',function(){buy(IL?'rilju_buy':'rtop_buy');});
    box.appendChild(b);
    anchor.parentNode.insertBefore(box,anchor);
    T(IL?'rilju_show':'rtop_show');
  }

  function locks(v){
    var li=v.querySelectorAll('.gptrCard li.lock');
    for(var i=0;i<li.length;i++){
      var x=li[i];if(x.getAttribute('data-gcv'))continue;
      var k=(x.querySelector('b')||{}).textContent||'';
      var p=x.querySelector('p');
      if(p&&LOCK[k.trim()])p.textContent='🔒 '+LOCK[k.trim()];
      x.setAttribute('data-gcv','1');x.setAttribute('role','button');x.tabIndex=0;
      x.addEventListener('click',function(){buy('rlock_buy');});
      x.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();buy('rlock_buy');}});
    }
  }

  function trust(v){
    var bs=v.querySelectorAll(BTNS);
    for(var i=0;i<bs.length;i++){
      var b=bs[i],n=b.nextElementSibling;
      if(n&&n.classList.contains('gcvTrust'))continue;
      var p=doc.createElement('p');p.className='gcvTrust';p.textContent=TRUST;
      b.insertAdjacentElement('afterend',p);
    }
  }

  /* 만세력 표를 펼친 사람에게: 이 글자들이 언제 움직이는지로 연결 */
  function manse(v){
    var m=v.querySelector(':scope > .manseSnapshot'),btn=v.querySelector(':scope > .gMsBtn'),old=v.querySelector(':scope > .gcvManse');
    var open=m&&btn&&m.dataset.gms==='1'&&!m.classList.contains('gMsFold');
    if(!open){if(old)old.remove();return;}
    if(old)return;
    var box=doc.createElement('section');box.className='gcvManse';
    box.innerHTML='<b class="gcvMT">📜 이 글자들이 언제 움직이는지 궁금하다면</b><p class="gcvMS"></p><button type="button" class="gcvGo"></button>';
    box.querySelector('.gcvMS').textContent='만세력은 내 사주의 재료예요. 지금 대운과 올해·내년 세운이 이 글자들과 만나서 언제 돈이 붙고 언제 연애가 풀리는지는 평생사주에서 연도별로 풀어 드려요.';
    var g=box.querySelector('.gcvGo');g.textContent='내 대운·세운 풀이 열기 · 5,900원 ›';
    g.addEventListener('click',function(){buy('rmanse_buy');});
    btn.insertAdjacentElement('afterend',box);T('rmanse_show');
  }

  /* 궁합 결과: 점수 바로 아래에 두 사람 사주에서 찾은 것 + 7,900원 */
  var C_UNPAID='.premiumPreview,[data-glf-buy="compat"]',C_BTNS='[data-glf-buy="compat"],.premiumLock button';
  var C_TRUST='결제하면 바로 열려요 · 한 번 결제로 이 궁합은 계속 다시 볼 수 있어요';
  function compatHook(v){
    var old=v.querySelector(':scope > .gcvHook');
    var peek=v.querySelector('.glfCard .glfPeek');
    if(!peek){if(old)old.remove();return;}
    if(old)return;
    var anchor=v.querySelector(':scope > .matchHero');if(!anchor)return;
    var rows=peek.querySelectorAll('.glfPeekRow');if(!rows.length)return;
    var box=doc.createElement('section');box.className='gcvHook gcvPair';
    var h=doc.createElement('b');h.className='gcvT';h.textContent='💞 두 사람 사주에서 미리 찾은 것';box.appendChild(h);
    for(var i=0;i<rows.length&&i<2;i++){var c=rows[i].cloneNode(true);c.className='gcvRow';var em=c.querySelector('em');if(em)em.remove();box.appendChild(c);}
    var s=doc.createElement('p');s.className='gcvS';s.textContent='점수보다 중요한 건 시기예요. 둘이 언제 가까워지고 언제 부딪히는지, 그때 어떻게 하면 좋은지는 프리미엄 궁합에서 알려 줘요.';box.appendChild(s);
    var b=doc.createElement('button');b.type='button';b.className='gcvGo';b.textContent='두 사람 시기 전부 열기 · 7,900원 ›';
    b.addEventListener('click',function(){buy('ctop_buy',true);});box.appendChild(b);
    anchor.insertAdjacentElement('afterend',box);T('ctop_show');
  }
  function compatTrust(v){
    var bs=v.querySelectorAll(C_BTNS);
    for(var i=0;i<bs.length;i++){var b=bs[i],n=b.nextElementSibling;if(n&&n.classList.contains('gcvTrust'))continue;
      var p=doc.createElement('p');p.className='gcvTrust';p.textContent=C_TRUST;b.insertAdjacentElement('afterend',p);}
  }
  function applyCompat(){
    var v=doc.getElementById('matchView');if(!v)return;
    if(!v.querySelector(C_UNPAID)){var o=v.querySelector(':scope > .gcvHook');if(o)o.remove();return;}
    try{compatHook(v);}catch(_e){}
    try{compatTrust(v);}catch(_e){}
  }

  /* 무료 맛보기: 유료 해설 14개 중 '나에게 맞는 일'을 실제 내 명식으로 한 편 통째로 보여 주고,
   * 이 깊이로 돈·연애 시기까지 열리는 걸 결제로 연결한다. 시기(연·월)는 여기서 보여 주지 않는다. */
  var SAMPLE_SHOW=4;
  function sample(v){
    var card=v.querySelector(':scope > .glfCard');
    var old=v.querySelector(':scope > .gcvSample');
    if(!card||!card.querySelector('[data-glf-buy="saju"]')){if(old)old.remove();return;}
    if(old)return;
    var A=root.GuiinAnswers,c=null;try{c=(typeof chart!=='undefined')?chart:null;}catch(_e){}
    if(!A||!c)return;
    var rows;try{rows=A.build(c)||[];}catch(_e){return;}
    var w=null;for(var i=0;i<rows.length;i++)if(rows[i].id==='ans-work'){w=rows[i];break;}
    if(!w)return;
    var ps=(w.paragraphs||[]).map(function(x){return String(x||'').trim();}).filter(Boolean)
      .filter(function(x){return !/^결론부터 말하면/.test(x);});
    if(ps.length<2)return;
    var nm=nameOf();
    var box=doc.createElement('section');box.className='gcvSample';
    var k=doc.createElement('p');k.className='gcvSK';k.textContent='🎁 평생사주 14개 이야기 중 1편 무료로 열어 드려요';box.appendChild(k);
    var h=doc.createElement('h3');h.className='gcvSH';h.textContent=(nm?nm+'님에게':'나에게')+' 맞는 일';box.appendChild(h);
    if(w.answer){var a=doc.createElement('p');a.className='gcvSA';a.textContent=String(w.answer);box.appendChild(a);}
    var body=doc.createElement('div');body.className='gcvSB';
    ps.forEach(function(x,j){var p=doc.createElement('p');p.textContent=x;if(j>=SAMPLE_SHOW)p.hidden=true;body.appendChild(p);});
    box.appendChild(body);
    if(ps.length>SAMPLE_SHOW){
      var more=doc.createElement('button');more.type='button';more.className='gcvSM';more.textContent='계속 읽기 ▾ ('+(ps.length-SAMPLE_SHOW)+'문단 더)';
      more.addEventListener('click',function(){var hs=body.querySelectorAll('p[hidden]');for(var j=0;j<hs.length;j++)hs[j].hidden=false;more.remove();T('rsample_more');});
      box.appendChild(more);
    }
    var nx=doc.createElement('div');nx.className='gcvSN';
    nx.innerHTML='<b>이런 깊이로 나머지 13편이 이어져요</b><span>💰 돈이 붙는 해와 달</span><span>💞 연애·결혼운이 들어오는 해</span><span>🧭 지금 대운과 앞으로 10년</span><span>🤝 곁에 두면 좋은 사람</span>';
    box.appendChild(nx);
    var b=doc.createElement('button');b.type='button';b.className='gcvGo';b.textContent='나머지 13편 전부 열기 · 5,900원 ›';
    b.addEventListener('click',function(){buy('rsample_buy');});box.appendChild(b);
    var tr=doc.createElement('p');tr.className='gcvTrust';tr.textContent=TRUST;box.appendChild(tr);
    card.parentNode.insertBefore(box,card);
    T('rsample_show');
  }

  /* 평생사주 결제창: 내 사주에서 찾은 것을 결제창 위에 다시 보여 주고,
   * 동의 체크 없이 흐린 결제 버튼을 누르면 동의 칸을 짚어 준다. (11/25 결제창 연 8명 중 7명 이탈) */
  function sheetMine(){
    var sh=doc.getElementById('premiumSheet');if(!sh)return;
    var old=sh.querySelector('.gcvMine');if(old)old.remove();
    var rv=doc.getElementById('resultView');if(!rv)return;
    var peek=rv.querySelector('.glfCard .glfPeek');if(!peek)return;
    var rows=peek.querySelectorAll('.glfPeekRow');if(!rows.length)return;
    var price=sh.querySelector('.price');if(!price)return;
    var nm=nameOf();
    var box=doc.createElement('div');box.className='gcvMine';
    var h=doc.createElement('b');h.className='gcvMineT';h.textContent='📌 '+(nm?nm+'님':'내')+' 사주에서 이미 찾은 것';box.appendChild(h);
    for(var i=0;i<rows.length&&i<2;i++){var c=rows[i].cloneNode(true);c.className='gcvMineR';var em=c.querySelector('em');if(em)em.remove();box.appendChild(c);}
    var s=doc.createElement('p');s.className='gcvMineS';s.textContent='결제하면 그게 정확히 몇 년 몇 월인지, 그때 뭘 하면 좋은지 바로 열려요.';box.appendChild(s);
    price.insertAdjacentElement('afterend',box);
    T('psheet_mine');
  }
  function nudgeConsent(){
    var c=doc.getElementById('premiumPayConsent');if(!c||c.checked)return;
    var lab=c.closest('label');if(!lab)return;
    lab.classList.remove('gcvNudge');void lab.offsetWidth;lab.classList.add('gcvNudge');
    try{lab.scrollIntoView({block:'center',behavior:'smooth'});}catch(_e){}
    T('psheet_noconsent_tap');
  }
  function sheetStart(){
    var sh=doc.getElementById('premiumSheet');if(!sh||sh.getAttribute('data-gcv'))return;
    sh.setAttribute('data-gcv','1');
    var was=sh.classList.contains('on');
    if(root.MutationObserver)new MutationObserver(function(){var on=sh.classList.contains('on');if(on&&!was)sheetMine();was=on;}).observe(sh,{attributes:true,attributeFilter:['class']});
    /* 흐린(disabled) 버튼은 클릭이 안 잡혀서, CSS로 클릭을 통과시킨 뒤 버튼 자리를 눌렀는지 본다 */
    sh.addEventListener('click',function(e){
      var b=doc.getElementById('premiumPayBtn');if(!b||!b.disabled)return;
      var r=b.getBoundingClientRect();
      if(e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom)nudgeConsent();
    });
    doc.addEventListener('change',function(e){if(e.target&&e.target.id==='premiumPayConsent'&&e.target.checked)T('psheet_consent');},true);
  }

  var busy=false;
  function apply(){
    busy=false;
    try{applyCompat();}catch(_e){}
    var v=doc.getElementById('resultView');if(!v)return;
    if(!v.querySelector(UNPAID)){
      var o=v.querySelector(':scope > .gcvHook');if(o)o.remove();
      return;
    }
    try{hook(v);}catch(_e){}
    try{locks(v);}catch(_e){}
    try{trust(v);}catch(_e){}
    try{manse(v);}catch(_e){}
    try{sample(v);}catch(_e){}
  }
  function schedule(){if(busy)return;busy=true;setTimeout(apply,150);}
  function start(){
    try{sheetStart();}catch(_e){}
    var v=doc.getElementById('resultView');
    if(v&&root.MutationObserver)new MutationObserver(schedule).observe(v,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
    var mv=doc.getElementById('matchView');
    if(mv&&root.MutationObserver)new MutationObserver(schedule).observe(mv,{childList:true,subtree:true});
    schedule();
  }
  if(doc.readyState==='loading')doc.addEventListener('DOMContentLoaded',start,{once:true});else start();
})(typeof window!=='undefined'?window:this);
