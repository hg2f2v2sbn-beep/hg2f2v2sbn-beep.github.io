/* 귀인사주 전환 개선 v1 (2026-11-17)
 * - 무료 결과의 긴 인물 해석을 접어서, 잠긴 풀이·결제 안내가 더 빨리 보이게
 * - 결제 버튼 문구를 하나로 통일 (평생사주)
 * - 결과 화면에서 하단 고정 결제바 (미결제일 때만)
 */
(function(root){
  'use strict';
  var doc=root.document;if(!doc)return;
  var LABEL='잠긴 풀이 전부 열기 · 5,900원 ›';
  var DISMISS_KEY='gf_paybar_closed';

  function buyLifetime(){
    try{
      if(typeof root.guiinPaymentCenterStart==='function'){root.guiinPaymentCenterStart('LIFETIME_SAJU');return;}
      if(typeof root.openPremiumPay==='function')root.openPremiumPay();
    }catch(_e){}
  }

  function view(){return doc.getElementById('resultView');}
  function resultActive(){var r=doc.getElementById('result');return !!(r&&r.classList.contains('active')&&r.offsetParent!==null);}
  function unpaid(v){return !!(v&&(v.querySelector('[data-gptr-buy]')||v.querySelector('.premiumPreview')||v.querySelector('[data-glf-buy="saju"]')));}

  function fold(v){
    var el=v.querySelector('.r29SajuPortrait');
    if(!el||el.getAttribute('data-gf-fold'))return;
    if(el.scrollHeight<900)return;
    el.setAttribute('data-gf-fold','1');
    el.classList.add('gfFold','gfShut');
    var b=doc.createElement('button');b.type='button';b.className='gfMore';b.textContent='이어서 더 읽기 ⌄';
    b.addEventListener('click',function(){
      var shut=el.classList.toggle('gfShut');
      b.textContent=shut?'이어서 더 읽기 ⌄':'접기 ⌃';
      if(shut)el.scrollIntoView({block:'start',behavior:'smooth'});
    });
    el.parentNode.insertBefore(b,el.nextSibling);
  }

  function unify(v){
    var list=v.querySelectorAll('[data-gptr-buy],[data-glf-buy="saju"],.premiumLock button');
    for(var i=0;i<list.length;i++){if(list[i].textContent!==LABEL)list[i].textContent=LABEL;}
    // '무료와 프리미엄' 비교 박스가 두 번 나오므로 아래쪽 하나는 숨김
    if(v.querySelector('.premiumCompare')){var fp=v.querySelector('.guiinFreePaid');if(fp)fp.style.display='none';}
  }

  var bar=null;
  function ensureBar(){
    if(bar)return bar;
    bar=doc.createElement('div');bar.id='gfPayBar';bar.setAttribute('role','region');bar.setAttribute('aria-label','평생사주 결제');
    bar.innerHTML='<div class="t"><b>평생사주 전체 풀이</b><span>잘 맞는 일·돈 들어오는 해·연애 시기까지</span></div>'
      +'<button type="button" class="go">5,900원 열기 ›</button><button type="button" class="x" aria-label="닫기">✕</button>';
    bar.querySelector('.go').addEventListener('click',buyLifetime);
    bar.querySelector('.x').addEventListener('click',function(){try{sessionStorage.setItem(DISMISS_KEY,'1');}catch(_e){}bar.classList.remove('on');});
    doc.body.appendChild(bar);
    return bar;
  }
  function dismissed(){try{return sessionStorage.getItem(DISMISS_KEY)==='1';}catch(_e){return false;}}

  function updateBar(){
    var v=view();
    var show=resultActive()&&unpaid(v)&&!dismissed()&&(root.scrollY||0)>600;
    if(show){
      // 결제 시트가 열려 있으면 감춤
      var sheet=doc.getElementById('premiumSheet');
      if(sheet&&sheet.classList.contains('on'))show=false;
    }
    if(show)ensureBar().classList.add('on');else if(bar)bar.classList.remove('on');
  }

  var pending=false;
  function apply(){
    pending=false;
    var v=view();
    if(v&&v.children.length){try{fold(v);unify(v);}catch(_e){}}
    updateBar();
  }
  function schedule(){if(pending)return;pending=true;setTimeout(apply,120);}

  function start(){
    var v=view();
    if(v&&root.MutationObserver)new MutationObserver(schedule).observe(v,{childList:true,subtree:true});
    var r=doc.getElementById('result');
    if(r&&root.MutationObserver)new MutationObserver(schedule).observe(r,{attributes:true,attributeFilter:['class']});
    var s=doc.getElementById('premiumSheet');
    if(s&&root.MutationObserver)new MutationObserver(updateBar).observe(s,{attributes:true,attributeFilter:['class']});
    root.addEventListener('scroll',function(){if(!pending)updateBar();},{passive:true});
    root.addEventListener('hashchange',schedule);
    schedule();
  }
  if(doc.readyState==='loading')doc.addEventListener('DOMContentLoaded',start,{once:true});else start();
})(typeof window!=='undefined'?window:this);

/* v2: 생년월일 입력 전에 '풀이 예시'를 먼저 보여 주는 시트
 * 예시 내용은 예시 인물(지연 1995.3.14 09:30 여 / 민준 1993.8.2 21:10 남)을
 * 귀인사주 엔진으로 실제 계산한 무료 결과에서 가져왔다. */
(function(root){
  'use strict';
  var doc=root.document;if(!doc)return;
  function it(t,b,p,g){return '<div class="it"><small>'+t+'</small><b>'+b+'</b>'+(p?'<p>'+p+'</p>':'')+(g?'<i>근거 · '+g+'</i>':'')+'</div>';}
  function lk(t,m){return '<div class="lk"><span>🔒 '+t+'</span><span>'+m+'에서 열려</span></div>';}
  var SAJU='<div class="who">예시 인물 <b>지연</b> · 1995년 3월 14일 오전 9:30 · 여성<br>귀인사주로 실제 계산한 무료 결과에서 뽑았어요.</div>'
    +it('넌 이런 사람이야','봄에 태어난 갑목이라, 방향을 먼저 세우고 그걸 현실적인 성과로 바꾸는 사람이야.','곧게 뻗어 올라가는 큰 나무 같은 기운이야. 원국에서 재성이 43%로 가장 커서 생각이 늘 "그래서 실제로 뭐가 남는데?" 쪽으로 향해.','갑목 일간 · 봄(묘월) · 재성 43%')
    +it('성격','뭘 하든 "그래서 남는 게 뭔데?"가 먼저 계산돼. 감보다 손익이 빠른 사람이야.','가까운 사람한테는 말보다 현실적으로 챙겨 주는 걸로 마음을 표현해.','일간 · 일지 재성')
    +it('장점','망설이는 사람들 앞에서 먼저 방향을 잡아 주는 추진력이 네 무기야.','한번 시작한 건 남 눈치 안 보고 끝까지 가는 뚝심까지 있어.','비겁 29% · 재성 43%')
    +it('쓴소리 한 줄','손해 안 보려다가 사람을 잃는 장면이 반복돼. 한번 정한 방향은 틀려도 안 꺾어.','','가장 큰 힘 재성 43%')
    +it('돈과 연애가 들어오는 해','돈이 제일 크게 붙는 해는 2027년, 연애운이 제일 세게 들어오는 해는 2029년. 일은 영업·세일즈 쪽이 맞아.','','앞으로 10년 세운 · 일지 · 재성·관성')
    +lk('잘 맞는 일','평생사주')+lk('지금 대운','평생사주')+lk('잘 맞는 사람','평생사주')+lk('감정 패턴','평생사주')
    +'<div class="paid"><b>평생사주 5,900원</b>에서는 일주와 십성, 나에게 맞는 일, 재물운, 연애·결혼운, 가족, 지금 대운과 앞으로까지 <b>14개 장문 해설</b>로 이어져요.</div>';
  var COMPAT='<div class="who">예시 커플 <b>지연</b>(1995.3.14 여) · <b>민준</b>(1993.8.2 남)<br>귀인사주로 실제 계산한 무료 결과에서 뽑았어요.</div>'
    +'<div class="it"><small>두 사람 궁합</small><div class="score"><b>♥ 69점</b></div><b>차이를 맞춰갈수록 좋아지는 관계야.</b>'
    +'<div class="bars"><div>연애·끌림<b>70</b></div><div>성격·대화<b>74</b></div><div>돈·생활<b>74</b></div><div>장기 조율<b>70</b></div></div></div>'
    +it('잘 맞는 부분','둘 다 변화와 성장을 중요하게 보는 편이라, 목표가 맞으면 같이 움직이는 속도가 빨라.','처음에는 서로 다른 강점이 오히려 매력으로 느껴질 수 있어.','두 사람 모두 목 기운이 가장 큼')
    +it('부딪히는 부분','둘 다 자기 방향이 분명해졌을 때가 문제야. 양보가 늦어지면 작은 의견 차이도 고집 대 고집으로 번져.','','갑목 · 을목 일간')
    +it('2026년 두 사람','민준은 바꾸고 표현하고 싶은 해라 새 계획을 자주 꺼내. 지연은 다 받아 주기보다 하나씩 골라 같이 해 봐.','','2026 병오 · 지연 식신 · 민준 상관')
    +lk('연락·거리감','프리미엄 궁합')+lk('권태·친밀감','프리미엄 궁합')+lk('돈·결혼 생활','프리미엄 궁합')+lk('2028~2035년 시기','프리미엄 궁합')
    +'<div class="paid"><b>프리미엄 궁합 7,900원</b>에서는 연락·질투·권태·친밀감·돈·결혼·가족 역할과 두 사람의 10년 시기까지 <b>12개 영역</b>으로 이어져요.</div>';
  var CTA={saju:['내 생년월일로 무료 풀이 보기 ›','saju'],compat:['우리 둘 궁합 무료로 보기 ›','match']};
  var el=null,cur='saju';
  function build(){
    if(el)return el;
    el=doc.createElement('div');el.id='gfSample';el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');el.setAttribute('aria-label','풀이 예시');
    el.innerHTML='<div class="sh"><div class="hd"><button type="button" class="x" aria-label="닫기">✕</button><h2>이런 풀이를 받아요</h2><p>무료 결과 예시예요. 잠긴 부분은 유료 풀이에서 열려요.</p></div>'
      +'<div class="tb"><button type="button" data-t="saju">평생사주 예시</button><button type="button" data-t="compat">궁합 예시</button></div>'
      +'<div class="bd"><div class="pn" data-p="saju">'+SAJU+'</div><div class="pn" data-p="compat" hidden>'+COMPAT+'</div></div>'
      +'<div class="ft"><button type="button" class="go"></button><small>무료 결과를 먼저 보고, 원할 때만 결제해요.</small></div></div>';
    el.addEventListener('click',function(e){
      if(e.target===el||e.target.closest('.x')){close();return;}
      var t=e.target.closest('[data-t]');if(t){show(t.getAttribute('data-t'));return;}
      if(e.target.closest('.go')){close();try{root.go(CTA[cur][1]);root.scrollTo(0,0);}catch(_e){}}
    });
    doc.body.appendChild(el);return el;
  }
  function show(t){
    cur=CTA[t]?t:'saju';
    el.querySelectorAll('[data-t]').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-t')===cur);});
    el.querySelectorAll('[data-p]').forEach(function(p){p.hidden=p.getAttribute('data-p')!==cur;});
    el.querySelector('.go').textContent=CTA[cur][0];
    el.querySelector('.bd').scrollTop=0;
  }
  function close(){if(el)el.classList.remove('on');doc.documentElement.style.overflow='';}
  root.gfOpenSample=function(t){build();show(t);el.classList.add('on');doc.documentElement.style.overflow='hidden';};
  doc.addEventListener('keydown',function(e){if(e.key==='Escape')close();});
})(typeof window!=='undefined'?window:this);
