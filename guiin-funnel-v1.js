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
