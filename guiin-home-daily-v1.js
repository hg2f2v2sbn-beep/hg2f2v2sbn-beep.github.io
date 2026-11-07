/* 귀인사주 홈: 오늘의 한 줄(무료) · 매일 무료 상담 안내 · 메뉴판 · 실제 이용 숫자/후기
 * 숫자와 후기는 서버에서 받은 실제 값만 보여 준다. 값이 없으면 그 칸을 숨긴다.
 * 끄려면 window.GUIIN_HOME_DAILY_OFF = true
 */
(function(root){
'use strict';
var LINES={
  '비견':['내 페이스를 지키는 날. 남과 비교하지 말고 어제의 나만 이기면 돼.','같은 편이 힘이 되는 날. 혼자 끙끙대기보다 한 사람에게 털어놔 봐.','고집이 단단해지는 날. 결정은 좋지만 말투는 한 번 부드럽게.'],
  '겁재':['돈과 기운이 새기 쉬운 날. 충동 결제는 하루만 미뤄 봐.','경쟁심이 올라오는 날. 이기려는 힘을 내 일에 쓰면 성과가 나.','누가 내 몫을 넘보는 느낌이 들 수 있어. 선을 분명하게, 목소리는 차분하게.'],
  '식신':['말과 손끝이 풀리는 날. 미뤄 둔 걸 하나 만들어 끝내 봐.','맛있는 걸 먹고 기분을 챙기면 운이 같이 올라와.','여유가 실력이 되는 날. 서두르지 않아도 결과가 따라와.'],
  '상관':['표현력이 날카로워지는 날. 좋은 아이디어가 나오지만 말은 한 박자 늦게.','규칙이 답답하게 느껴지는 날. 바꾸고 싶은 건 메모해 두고 내일 말해.','재능이 튀는 날. 보여 줄 기회가 있으면 망설이지 마.'],
  '편재':['기회가 여기저기서 들어오는 날. 다 잡지 말고 제일 확실한 하나만.','사람과 돈이 같이 움직이는 날. 약속은 가볍게라도 지키면 다음이 열려.','감이 좋은 날이지만 큰돈은 숫자로 한 번 더 확인하고.'],
  '정재':['꼼꼼함이 돈이 되는 날. 영수증·고정지출 한 번 정리해 봐.','성실하게 쌓은 게 인정받는 날. 작은 약속을 지켜.','안정이 운인 날. 새 판보다 하던 걸 마무리하는 게 이득이야.'],
  '편관':['압박이 들어오는 날. 할 일을 세 개로 줄이면 버틸 만해.','책임이 커지는 날. 혼자 다 떠안지 말고 도움을 요청해도 돼.','긴장감이 집중력으로 바뀌는 날. 중요한 일은 오전에 끝내.'],
  '정관':['정리와 원칙이 통하는 날. 공식적인 일, 서류, 약속에 좋아.','신뢰를 얻는 날. 평소보다 조금만 더 단정하게.','윗사람·조직과 결이 맞는 날. 하고 싶은 말은 근거와 함께.'],
  '편인':['생각이 깊어지는 날. 혼자 있는 시간이 오히려 답을 줘.','촉이 예민한 날. 불안은 메모로 꺼내 두면 가벼워져.','배우고 싶은 게 생기는 날. 짧게라도 시작해 봐.'],
  '정인':['도움을 받는 날. 받은 호의는 고맙다고 꼭 말해 줘.','공부·자격·문서에 좋은 날. 미뤄 둔 신청을 해 봐.','마음이 차분해지는 날. 쉬는 것도 오늘의 할 일이야.']
};
var EL_COLOR={'목':['초록','연두'],'화':['빨강','코랄'],'토':['베이지','황토색'],'금':['흰색','은색'],'수':['검정','네이비']};
var STATS=null,STATS_AT=0;
function getChart(){try{return typeof chart!=='undefined'&&chart&&chart.pillars?chart:null;}catch(_){return null;}}
function kstToday(){var d=new Date(Date.now()+9*3600000);return {y:d.getUTCFullYear(),m:d.getUTCMonth()+1,d:d.getUTCDate()};}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function today(c){
  try{
    var G=root.GuiinSaju;if(!G||typeof G.flowForDate!=='function'||!c.dayMaster)return null;
    var t=kstToday(),f=G.flowForDate(t.y,t.m,t.d,c.dayMaster.stem);
    var god=f.gods&&f.gods.day,p=f.pillars&&f.pillars.day;if(!god||!LINES[god])return null;
    var seed=(t.y*372+t.m*31+t.d)+String(c.dayMaster.stem).charCodeAt(0);
    var line=LINES[god][seed%LINES[god].length];
    var el=p?(p.stemEl||p.el||null):null,colors=el&&EL_COLOR[el]?EL_COLOR[el]:null;
    return {god:god,ganji:p?(p.ko||''):'',line:line,color:colors?colors[seed%2]:null,date:t.m+'월 '+t.d+'일'};
  }catch(_){return null;}
}
function loadStats(){
  if(Date.now()-STATS_AT<600000)return;STATS_AT=Date.now();
  try{
    if(typeof root.guiinApi!=='function')return;
    root.guiinApi('/api/public/stats',{method:'GET',headers:{'Accept':'application/json'}}).then(function(r){return r.ok?r.json():null;}).then(function(d){if(d&&d.ok){STATS=d;render(true);}}).catch(function(){});
  }catch(_){}
}
var CSS='.ghdWrap{display:grid;gap:12px;margin:12px 0}'+
'.ghdCard{border-radius:18px;padding:16px;background:#fff;border:1px solid #ece3d3}'+
'.ghdCard .ghdMini{font-size:12px;font-weight:700;color:#8a6a3c;margin-bottom:6px}'+
'.ghdToday .ghdLine{font-size:17px;font-weight:800;line-height:1.5;color:#2b2318;margin:0 0 8px;word-break:keep-all}'+
'.ghdToday .ghdMeta{font-size:12.5px;color:#7b6e5e;margin-bottom:10px}'+
'.ghdRow{display:flex;gap:8px;flex-wrap:wrap}'+
'.ghdRow button{flex:1 1 140px;border:0;border-radius:12px;padding:11px 12px;font-weight:800;font-size:14px;cursor:pointer}'+
'.ghdRow .pri{background:#2f7a43;color:#fff}.ghdRow .sec{background:#f4efe6;color:#4a3f31}'+
'.ghdFree{display:flex;align-items:center;gap:10px;background:linear-gradient(135deg,#fff6e6,#f1fbf2)}'+
'.ghdFree b{font-size:15px}.ghdFree span{display:block;font-size:12.5px;color:#6b5d4b;margin-top:2px}'+
'.ghdFree .ghdTicket{flex:0 0 auto;font-size:26px}'+
'.ghdMenu{display:grid;grid-template-columns:1fr 1fr;gap:8px}'+
'.ghdItem{border-radius:14px;padding:12px;background:#faf6ee;border:1px solid #efe5d4;cursor:pointer;text-align:left;font:inherit;color:inherit}'+
'.ghdItem b{display:block;font-size:14.5px;margin-bottom:3px}.ghdItem small{display:block;font-size:12px;color:#7b6e5e;line-height:1.4;min-height:2.8em}'+
'.ghdItem em{display:inline-block;margin-top:6px;font-style:normal;font-weight:800;font-size:13px;color:#2f7a43}'+
'.ghdItem em.free{color:#c0562e}'+
'.ghdCount{text-align:center}.ghdCount b{display:block;font-size:28px;letter-spacing:-.5px}.ghdCount span{font-size:12.5px;color:#7b6e5e}'+
'.ghdRev{display:flex;gap:8px;overflow-x:auto;padding-bottom:4px}.ghdRev div{flex:0 0 78%;border:1px solid #efe5d4;border-radius:14px;padding:12px;font-size:13.5px;line-height:1.55;background:#fffdf8}.ghdRev i{display:block;font-style:normal;color:#e0a100;margin-bottom:4px}';
function ensureCss(){var d=root.document;if(d.getElementById('ghdCss'))return;var s=d.createElement('style');s.id='ghdCss';s.textContent=CSS;d.head.appendChild(s);}
function html(){
  var c=getChart(),t=c?today(c):null,daily=!!(STATS&&STATS.dailyFreeChat);
  var out='';
  out+='<div class="ghdCard ghdToday"><div class="ghdMini">오늘의 한 줄 · 무료</div>';
  if(t){
    out+='<p class="ghdLine">'+esc(t.line)+'</p><div class="ghdMeta">'+esc(t.date)+' '+esc(t.ganji)+'일 · 나에게 '+esc(t.god)+'의 날'+(t.color?' · 오늘의 색 '+esc(t.color):'')+'</div>'
      +'<div class="ghdRow"><button type="button" class="pri" data-ghd="today">오늘 운세 자세히 ›</button><button type="button" class="sec" data-ghd="ask">이걸로 AI에게 물어보기</button></div>';
  }else{
    out+='<p class="ghdLine">생년월일만 넣으면 매일 나에게 맞춘 한 줄을 보여 줄게요.</p><div class="ghdRow"><button type="button" class="pri" data-ghd="saju">내 사주 넣고 오늘 운세 보기 ›</button></div>';
  }
  out+='</div>';
  if(daily){
    out+='<div class="ghdCard ghdFree"><div class="ghdTicket">🎟️</div><div><b>AI 상담 매일 '+esc(STATS.dailyFreeLimit||1)+'회 무료</b><span>로그인하면 매일 자정(한국 시간)에 다시 충전돼요.</span></div></div>';
  }
  out+='<div class="ghdCard"><div class="ghdMini">메뉴판</div><div class="ghdMenu">'
    +item('today','오늘의 운세','오늘 하루의 흐름과 조심할 점','무료',true)
    +item('ask','AI 사주상담',daily?'내 사주로 묻고 답하기 · 매일 무료 1회':'내 사주로 묻고 답하기 · 처음 3회 무료','무료로 시작',true)
    +item('wallet','AI 질문 3회','궁금한 것만 콕 집어서','1,100원',false)
    +item('lifetime','평생사주','14개 항목 장문 해설 · 대운 · 10년 세운','990원',false)
    +item('compat','프리미엄 궁합','두 사람 장문 해설 · 시기 겹쳐 보기','990원',false)
    +item('fortune','2027년 운세 가이드','띠·일간별 내년 흐름','무료',true)
    +'</div></div>';
  if(STATS&&Number(STATS.readings)>=1000){
    out+='<div class="ghdCard ghdCount"><div class="ghdMini">귀인사주와 함께한 풀이</div><b>'+Number(STATS.readings).toLocaleString('ko-KR')+'+</b><span>누적 사주·궁합 계산 기준</span></div>';
  }
  var rv=Array.isArray(root.GUIIN_REAL_REVIEWS)?root.GUIIN_REAL_REVIEWS.filter(function(r){return r&&r.text;}).slice(0,8):[];
  if(rv.length){
    out+='<div class="ghdCard"><div class="ghdMini">이용 후기</div><div class="ghdRev">'+rv.map(function(r){return '<div><i>'+'★★★★★'.slice(0,Math.max(1,Math.min(5,Number(r.stars)||5)))+'</i>'+esc(r.text)+'</div>';}).join('')+'</div></div>';
  }
  return out;
}
function item(key,title,desc,price,free){return '<button type="button" class="ghdItem" data-ghd="'+key+'"><b>'+esc(title)+'</b><small>'+esc(desc)+'</small><em class="'+(free?'free':'')+'">'+esc(price)+'</em></button>';}
function render(force){
  if(root.GUIIN_HOME_DAILY_OFF||!root.document)return;
  var d=root.document,home=d.getElementById('home');if(!home)return;
  var hero=home.querySelector('.homeHero');if(!hero)return;
  var c=getChart(),t=kstToday();
  var sig=(c?(c.dayMaster&&c.dayMaster.stem)+JSON.stringify(c.input||{}):'none')+'|'+t.y+t.m+t.d+'|'+(STATS?JSON.stringify(STATS):'')+'|'+(Array.isArray(root.GUIIN_REAL_REVIEWS)?root.GUIIN_REAL_REVIEWS.length:0);
  var box=d.getElementById('ghdHome');
  if(box&&box.getAttribute('data-sig')===sig&&!force)return;
  ensureCss();
  if(!box){box=d.createElement('div');box.id='ghdHome';box.className='ghdWrap';box.setAttribute('data-polish-skip','1');}
  if(hero.nextElementSibling!==box)hero.after(box);
  box.setAttribute('data-sig',sig);box.innerHTML=html();
  loadStats();
}
function onClick(e){
  var t=e.target&&e.target.closest?e.target.closest('[data-ghd]'):null;if(!t)return;
  var k=t.getAttribute('data-ghd');
  try{
    if(k==='today')root.go('today');
    else if(k==='saju')root.go('saju');
    else if(k==='ask'){var c=getChart(),x=c?today(c):null;root.go('ask');if(x&&t.classList.contains('sec')){var q=root.document.getElementById('askQ');if(q)q.value='오늘이 나한테 '+x.god+'의 날이라는데, 오늘 뭘 조심하고 뭘 하면 좋을까?';}}
    else if(k==='wallet')root.go('wallet');
    else if(k==='lifetime')root.guiinPaymentCenterStart('LIFETIME_SAJU');
    else if(k==='compat')root.go('match');
    else if(k==='fortune')root.location.href='2027-fortune.html';
  }catch(_){}
}
if(root.document&&root.MutationObserver){
  var pending=false;
  var mo=new root.MutationObserver(function(){if(pending)return;pending=true;root.requestAnimationFrame(function(){pending=false;try{render(false);}catch(_){}});});
  var start=function(){try{mo.observe(root.document.body,{childList:true,subtree:true});root.document.addEventListener('click',onClick);render(false);}catch(_){}};
  if(root.document.body)start();else root.document.addEventListener('DOMContentLoaded',start);
}
root.GuiinHomeDaily={version:'home-daily-v1',today:today};
})(typeof globalThis!=='undefined'?globalThis:this);
