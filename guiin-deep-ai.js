/* 귀인사주 깊이 풀이 → AI 상담 자료 연결 모듈 (표시/계산 변경 없음)
   guiin-deep-voice.js / guiin-deep-compat.js 가 화면에 보여주는 풀이와 같은 문장을
   AI 상담 요청의 추가 필드(deep_reading)로만 넘긴다. 계산 엔진·점수·해석 문구는 읽기만 한다.
   실패하면 null을 돌려주고 기존 요청은 그대로 나간다. */
(function(){
'use strict';
var V='20261013-deep-ai-bridge';
var BODY_MAX=600, TOTAL_MAX=2400;
function parse(html){
  try{
    var doc=new DOMParser().parseFromString('<div id="r">'+html+'</div>','text/html');
    var out=[],total=0;
    var secs=doc.querySelectorAll('.gdvSec');
    for(var i=0;i<secs.length;i++){
      var s=secs[i],h=s.querySelector('h3'),ev=s.querySelector('.gdvEv');
      var title=h?h.textContent.trim():'';
      var evText=ev?ev.textContent.replace(/^\s*근거:\s*/,'').trim():'';
      var clone=s.cloneNode(true);
      var rm=clone.querySelectorAll('h3,.gdvEv');for(var j=0;j<rm.length;j++)rm[j].remove();
      var body=new DOMParser().parseFromString(clone.innerHTML.replace(/<[^>]*>/g,' '),'text/html').body.textContent.replace(/\s+/g,' ').trim().slice(0,BODY_MAX);
      if(!body)continue;
      if(total+body.length>TOTAL_MAX)break;
      total+=body.length;
      out.push({title:title.slice(0,40),body:body,evidence:evsafe(evText)});
    }
    return out.length?out:null;
  }catch(e){return null}
}
function evsafe(s){return String(s||'').slice(0,240)}
function personal(c){
  try{
    var DV=window.GUIIN_DEEP_VOICE;
    if(!DV||typeof DV.build!=='function'||!c||!c.pillars)return null;
    var html=DV.build(c,['self','flaw','money','time']);
    var s=html?parse(html):null;
    return s?{version:V,source:'site-deep-voice',sections:s}:null;
  }catch(e){return null}
}
function compat(pair){
  try{
    var DC=window.GUIIN_DEEP_COMPAT;
    if(!DC||typeof DC.build!=='function'||!pair||!pair.a||!pair.b)return null;
    var swapped=false,old;
    try{
      if(typeof matchMeta!=='undefined'&&matchMeta!==pair){old=matchMeta;matchMeta=pair;swapped=true}
    }catch(_e){swapped=false}
    var html;
    try{html=DC.build(['verdict','good','hard','fight','marry'])}
    finally{if(swapped){try{matchMeta=old}catch(_e){}}}
    var s=html?parse(html):null;
    return s?{version:V,source:'site-deep-compat',sections:s}:null;
  }catch(e){return null}
}
window.GUIIN_DEEP_AI={version:V,personal:personal,compat:compat};
})();
