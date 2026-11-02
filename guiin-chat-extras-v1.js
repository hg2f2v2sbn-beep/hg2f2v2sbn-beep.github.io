/* 귀인사주 AI 상담 v3.8 보조 화면: 계산 메모 카드(월운·세운표 + 한 줄 결론), 상황별 추천 카드 */
(function(){
  'use strict';
  var CSS='.gxMemo{margin:10px 0 6px;max-width:92%;border:1px solid #eadfcd;border-radius:16px;background:#fffaf2;padding:12px 14px;font-size:14px;color:#3a2f22}'+
  '.gxMemo .gxHead{display:flex;align-items:center;gap:6px;font-weight:700;font-size:13px;color:#8a6a3c;margin-bottom:8px}'+
  '.gxMemo .gxOne{font-weight:800;font-size:15px;line-height:1.45;color:#2b2318;margin:2px 0 10px}'+
  '.gxMemo .gxSub{font-size:12px;color:#8b7b66;margin-bottom:6px}'+
  '.gxMemo .gxRows{display:grid;grid-template-columns:repeat(auto-fill,minmax(88px,1fr));gap:6px}'+
  '.gxMemo .gxRow{background:#fff;border:1px solid #f0e6d6;border-radius:10px;padding:6px 8px;text-align:center;line-height:1.35}'+
  '.gxMemo .gxRow b{display:block;font-size:12px;color:#8a6a3c}'+
  '.gxMemo .gxRow span{display:block;font-size:14px;font-weight:700}'+
  '.gxMemo .gxRow i{display:block;font-style:normal;font-size:11.5px;color:#6b5d4b}'+
  '.gxRec{margin:8px 0 4px;max-width:92%;border-radius:16px;background:linear-gradient(135deg,#f3fbf4,#fffaf0);border:1px solid #d7ecd9;padding:12px 14px;font-size:14px;color:#2f3a2f}'+
  '.gxRec .gxRecT{font-weight:800;margin-bottom:4px}'+
  '.gxRec .gxRecR{font-size:13px;color:#4b5a4b;line-height:1.5;margin-bottom:8px}'+
  '.gxRec button{border:0;border-radius:999px;padding:8px 14px;font-weight:700;font-size:13px;background:#2f7a43;color:#fff;cursor:pointer}';
  function css(){if(document.getElementById('gxChatExtrasCss'))return;var s=document.createElement('style');s.id='gxChatExtrasCss';s.textContent=CSS;document.head.appendChild(s);}
  function el(tag,cls,txt){var d=document.createElement(tag);if(cls)d.className=cls;if(txt!=null)d.textContent=txt;return d;}
  function box(){return document.getElementById('msgs');}
  function before(data){
    var b=box();if(!b||!data)return;
    var memo=data.memo&&Array.isArray(data.memo.rows)&&data.memo.rows.length?data.memo:null;
    var one=String(data.headline||'').trim();
    if(!memo&&!one)return;
    css();
    var card=el('div','gxMemo');card.setAttribute('data-polish-skip','1');
    card.appendChild(el('div','gxHead','📝 귀인 메모'));
    if(one)card.appendChild(el('div','gxOne',one));
    if(memo){
      card.appendChild(el('div','gxSub',(memo.title||'운 계산')+' · 천간 / 지지 십성'));
      var rows=el('div','gxRows');
      memo.rows.slice(0,8).forEach(function(r){
        var c=el('div','gxRow');
        c.appendChild(el('b','',String(r.label||'')));
        c.appendChild(el('span','',String(r.ko||'')+(r.hanja?'('+r.hanja+')':'')));
        c.appendChild(el('i','',String(r.stemGod||'')+' · '+String(r.branchGod||'')));
        rows.appendChild(c);
      });
      card.appendChild(rows);
    }
    b.appendChild(card);
  }
  function entitled(code){
    try{var e=(typeof GUIIN_VERIFIED_ENTITLEMENTS!=='undefined'&&GUIIN_VERIFIED_ENTITLEMENTS)||window.GUIIN_VERIFIED_ENTITLEMENTS||{};return code==='LIFETIME_SAJU'?e.lifetimeSaju===true:code==='PREMIUM_COMPAT'?e.compat===true:false;}catch(_){return false;}
  }
  function openLongform(){
    try{if(typeof go==='function')go('result');}catch(_){}
    setTimeout(function(){var t=document.getElementById('gxLongformCard');if(t)t.scrollIntoView({behavior:'smooth',block:'start'});},450);
  }
  function after(data){
    var b=box();if(!b||!data||!data.recommend||!data.recommend.code)return;
    var r=data.recommend,code=String(r.code);
    b.querySelectorAll('.gxRec').forEach(function(x){x.remove();});
    var owned=entitled(code);
    if(owned&&code==='PREMIUM_COMPAT')return;
    css();
    var card=el('div','gxRec');card.setAttribute('data-polish-skip','1');
    card.appendChild(el('div','gxRecT',owned?'📖 평생사주 장문 해설에서 이어 보기':'🍀 '+String(r.label||'더 깊게 보기')));
    card.appendChild(el('div','gxRecR',String(r.reason||'')));
    var btn=el('button','',owned?'장문 해설 열기':(code==='PREMIUM_COMPAT'?'궁합 보러 가기':'자세히 보기'));btn.type='button';
    btn.onclick=function(){
      try{window.guiinSaveConsultReturn&&window.guiinSaveConsultReturn();}catch(_){}
      if(owned){openLongform();return;}
      if(code==='PREMIUM_COMPAT'){try{go('match');}catch(_){}return;}
      try{if(typeof window.guiinPaymentCenterStart==='function'){window.guiinPaymentCenterStart(code);return;}}catch(_){}
      try{go('result');}catch(_){}
    };
    card.appendChild(btn);
    var fb=b.querySelectorAll('.followupBox'),last=fb.length?fb[fb.length-1]:null;
    if(last)b.insertBefore(card,last);else b.appendChild(card);
  }
  window.guiinChatExtras={before:before,after:after};
})();
