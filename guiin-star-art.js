/* 귀인사주 · 내 사주에 숨겨진 특별한 별 — 일러스트 연결 (표시 전용)
 * - 계산 결과(c.stars.hits)는 읽기만 한다. 신살 판정·해석 문구·점수는 만들거나 바꾸지 않는다.
 * - 기존 starDetails / guiinStarGuideButtonHTML 출력 문자열에 그림만 덧붙이고, 실패하면 원래 출력을 그대로 반환한다.
 * - 제목·설명·버튼은 모두 HTML/CSS 텍스트이며 이미지에는 글자가 없다.
 */
(function(){
 'use strict';
 if(window.GUIIN_STAR_ART)return;
 const BASE='';
 const MAP={
  '천을귀인':{f:'star_cheoneul',h:'天乙貴人',alt:'구름 사이로 날개를 펼치는 흰 학',an:'학'},
  '문창귀인':{f:'star_munchang',h:'文昌貴人',alt:'붓과 두루마리 곁에 앉은 까치',an:'까치'},
  '태극귀인':{f:'star_taegeuk',h:'太極貴人',alt:'물결 위에서 미소 짓는 푸른 거북이',an:'거북이'},
  '월덕귀인':{f:'star_woldeok',h:'月德貴人',alt:'둥근 달빛 아래 앉은 흰 토끼',an:'토끼'},
  '천덕귀인':{f:'star_cheondeok',h:'天德貴人',alt:'푸른 깃털을 펼치며 나는 상서로운 새',an:'새'},
  '학당귀인':{f:'star_hakdang',h:'學堂貴人',alt:'책과 등불 곁에 앉은 올빼미',an:'올빼미'},
  '암록':{f:'star_amrok',h:'暗祿',alt:'도토리를 품은 다람쥐',an:'다람쥐'},
  '천의성':{f:'star_cheonui',h:'天醫星',alt:'풀잎과 꽃 사이에 서 있는 사슴',an:'사슴'},
  '건록':{f:'star_geonrok',h:'建祿',alt:'큰 나무 아래 앉아 있는 곰',an:'곰'},
  '괴강살':{f:'star_goegang',h:'魁罡殺',alt:'바위 위에 의젓하게 앉은 호랑이',an:'호랑이'}
 };
 const MORE_ART={
  move:{alt:'구름 길을 가볍게 달리는 보따리를 멘 어린 말',stars:{'역마살':'驛馬殺','지살':'地殺'}},
  charm:{alt:'복숭아꽃 사이에서 꼬리를 우아하게 펼친 공작',stars:{'도화살':'桃花殺','홍염살':'紅艶殺'}},
  immerse:{alt:'보름달 아래 책과 등불 곁에 앉은 여우',stars:{'화개살':'華蓋殺','귀문관살':'鬼門關殺'}},
  power:{alt:'바위 위에서 날개를 활짝 펼친 독수리',stars:{'양인살':'羊刃殺','백호살':'白虎殺','장성살':'將星殺'}},
  friction:{alt:'풀꽃 사이에서 서로 코를 맞대는 고슴도치 두 마리',stars:{'원진살':'怨嗔殺','형살':'刑殺','충살':'沖殺','파살':'破殺','해살':'害殺'}},
  sharp:{alt:'연잎 끝에 앉은 투명한 날개의 잠자리',stars:{'현침살':'懸針殺'}},
  solo:{alt:'보름달 아래 물가에 홀로 선 흰 기러기',stars:{'고신살':'孤辰殺','과숙살':'寡宿殺'}},
  cycle:{alt:'꽃잎 떠다니는 물결 속에서 노는 수달',stars:{'겁살':'劫殺','재살':'災殺','천살':'天殺','월살':'月殺','망신살':'亡身殺','반안살':'攀鞍殺','육해살':'六害殺'}},
  special:{alt:'안개와 별빛 속에서 날개를 펼친 나비',stars:{'공망':'空亡','천라지망':'天羅地網','삼기':'三奇','삼합':'三合'}}
};
const MORE={};
for(const g of Object.keys(MORE_ART))for(const n of Object.keys(MORE_ART[g].stars))MORE[n]={f:'star_'+g,h:MORE_ART[g].stars[n],alt:MORE_ART[g].alt};
/* 별 하나에 전용 그림이 있으면 그룹 그림 대신 쓴다(표시 전용). 판정·해설은 그룹과 무관하게 각각 그대로. */
const OV={
 '역마살':['extra_01_foal','꽃길을 가볍게 달리는 보따리를 멘 어린 말'],
 '도화살':['extra_09_fox_flower','벚꽃 사이에서 웃고 있는 어린 여우'],
 '홍염살':['extra_05_peacock','복숭아꽃 정원에서 꼬리를 펼친 어린 공작'],
 '화개살':['extra_10_fox_moon','달빛 아래 책과 등불 곁에서 생각에 잠긴 여우'],
 '귀문관살':['extra_04_cat','달빛을 올려다보는 작은 고양이'],
 '원진살':['extra_07_birds','서로 다른 색의 새 두 마리가 함께 나는 모습'],
 '형살':['star_hyeongsal','작은 꽃을 단 둥근 껍데기로 풀잎 위를 조심스레 걷는 달팽이'],
 '충살':['star_chungsal','작은 바위를 딛고 힘차게 뛰어오르는 아기 염소'],
 '해살':['star_haesal','가시에 작은 꽃과 붉은 열매를 꽂고 선 고슴도치'],
 '겁살':['star_geopsal','도토리 바구니를 품고 조심스레 주변을 살피는 너구리'],
 '재살':['star_jaesal','흙더미에서 얼굴을 내밀고 놀란 두더지'],
 '천살':['star_cheonsal','물보라 위에서 활짝 웃으며 물을 뿜는 아기 고래'],
 '월살':['star_wolsal','등불을 품고 초승달 빛 아래 날아오르는 반딧불이'],
 '망신살':['star_mangsinsal','벚꽃 부채로 얼굴을 반쯤 가린 수줍은 레서판다'],
 '반안살':['star_banansal','꽃 안장 담요를 두르고 씩씩하게 걷는 아기 코끼리'],
 '육해살':['star_yukhaesal','빗방울을 피해 큰 연잎 아래 앉은 개구리'],
 '양인살':['star_yanginsal','은빛 리본과 방울을 달고 의젓하게 선 아기 양'],
 '백호살':['star_baekhosal','눈 덮인 바위 위에서 푸른 눈으로 앞을 보는 눈표범 새끼'],
 '장성살':['star_jangseongsal','별 왕관을 쓰고 가슴을 펴고 홰를 치는 수탉'],
 '고신살':['star_gosinsal','달밤 바위 위에서 혼자 망원경으로 별을 올려다보는 아기 펭귄'],
 '과숙살':['star_gwasuksal','고요한 물 위 얼음 조각에 홀로 앉아 달을 보는 아기 물범'],
 '공망':['star_gongmang','나뭇가지에서 주변 색에 반쯤 녹아든 카멜레온'],
 '천라지망':['star_cheonlajimang','이슬 맺힌 거미줄 한가운데 앉은 아기 거미'],
 '삼기':['star_samgi','구름과 파도 사이에서 여의주를 든 아기 청룡'],
 '삼합':['star_samhap','서로 기대어 도토리를 나눠 먹는 햄스터 세 마리'],
 '파살':['extra_03_duck','갈라진 돌 위에 서 있는 어린 오리']
};
for(const n of Object.keys(OV))if(MORE[n])MORE[n]={f:OV[n][0],h:MORE[n].h,alt:OV[n][1]};
const ORDER=Object.keys(MAP);
const ORDER_MORE=Object.keys(MORE);
const ART=n=>MAP[n]||MORE[n]||null;
 const NONE={f:'star_none',alt:'찻잔 곁에서 달빛을 받으며 쉬는 고양이'};
 const PL={year:'년주',month:'월주',day:'일주',hour:'시주'};
 const PO=['year','month','day','hour'];
 const esc=v=>String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const src=f=>BASE+f+'.webp';
 const img=(f,alt,cls,w)=>`<img class="${cls}" src="${src(f)}" alt="${esc(alt)}" width="${w||160}" height="${w||160}" loading="lazy" decoding="async">`;

 function hitMap(c){
  const out=new Map();
  try{
   for(const h of (c&&c.stars&&Array.isArray(c.stars.hits)?c.stars.hits:[])){
    const name=typeof h==='string'?h:(h&&(h.name||h.star||h.label));
    if(!name)continue;
    if(!out.has(name))out.set(name,new Set());
    const p=h&&typeof h==='object'?h.pillar:null;
    if(p&&PL[p])out.get(name).add(p);
   }
  }catch(_e){}
  return out;
 }
 function titles(c){
  const m={};
  try{
   const rows=window.GuiinExpert&&GuiinExpert.premiumStarContexts?GuiinExpert.premiumStarContexts(c):[];
   for(const r of rows){const t=String(r&&r.title||''),i=t.indexOf(' — ');if(i>0)m[t.slice(0,i)]=t.slice(i+3);}
  }catch(_e){}
  return m;
 }
 function matched(c){
  const hm=hitMap(c);
  const main=ORDER.filter(n=>hm.has(n)),more=ORDER_MORE.filter(n=>hm.has(n));
  return {hm,list:main,more,all:[...main,...more]};
 }
 function chips(set){
  return PO.filter(p=>set&&set.has(p)).map(p=>`<span class="gsaChip">${PL[p]}</span>`).join('');
 }
 function card(n,m,hm,tt){
  const t=tt[n]||'';
  return `<li><button type="button" class="gsaCard" data-gsa-star="${esc(n)}" aria-label="${esc(n)} 해설로 이동">
    <span class="gsaArt">${img(m.f,m.alt,'gsaImg',160)}</span>
    <span class="gsaName">${esc(n)}</span><span class="gsaHanja" lang="zh">${m.h}</span>
    <span class="gsaWhere">${chips(hm.get(n))}</span>
    ${t?`<span class="gsaLine">${esc(t)}</span>`:''}
    <span class="gsaMore">해설 보기 ›</span></button></li>`;
 }
 function gallery(c){
  const {hm,list,more}=matched(c),tt=titles(c);
  if(!list.length&&!more.length){
   return `<section class="gsaGallery" data-star-art="none" aria-label="그림으로 보는 내 별">
    <div class="gsaNone">${img(NONE.f,NONE.alt,'gsaNoneImg',160)}<div><div class="gsaKicker">내 사주에 숨겨진 특별한 별</div>
    <h3>그림으로 소개하는 별은 이번 명식에서 성립하지 않았어</h3>
    <p>그림 대상인 귀인·신살이 이 명식에서는 계산되지 않았어. 별이 없다고 사주가 부족하다는 뜻은 아니야.</p></div></div></section>`;
  }
  const mainHtml=list.map(n=>card(n,MAP[n],hm,tt)).join('');
  const moreHtml=more.map(n=>card(n,MORE[n],hm,tt)).join('');
  const head=list.length
   ?`<h3>이 명식에 실제로 성립한 귀인·길신 ${list.length}개를 그림으로 만나 봐</h3>`
   :`<h3>이번 명식에는 그림으로 소개하는 귀인·길신은 성립하지 않았어</h3>`;
  const lead=list.length?'성립한 별만 그림으로 보여줘. 해설은 카드를 누르거나 아래에서 확인해.':'천을귀인·문창귀인·태극귀인·월덕귀인·천덕귀인·학당귀인·암록·천의성·건록·괴강살은 계산되지 않았어. 별이 없다고 사주가 부족하다는 뜻은 아니야. 아래에서 성립한 다른 별을 그림으로 볼 수 있어.';
  const moreBox=more.length?`<details class="gsaMoreBox"${list.length?'':' open'}><summary>그 밖에 성립한 별 ${more.length}개도 그림으로 보기</summary><ul class="gsaGrid">${moreHtml}</ul></details>`:'';
  return `<section class="gsaGallery" data-star-art="1" aria-label="그림으로 보는 내 별">
   <div class="gsaHead"><div class="gsaKicker">내 사주에 숨겨진 특별한 별</div>${head}<p>${lead}</p></div>
   ${list.length?`<ul class="gsaGrid">${mainHtml}</ul>`:''}${moreBox}</section>`;
 }
 function decorate(html,c){
  let out=String(html);
  const {all}=matched(c);
  for(const n of all){
   const m=ART(n),key=`data-human-section="star-context-${n}">`;
   if(!out.includes(key))continue;
   out=out.replace(key,key.replace('>',' data-gsa="1">')+`<figure class="gsaFig">${img(m.f,m.alt,'gsaFigImg',120)}</figure>`);
  }
  return out;
 }
 function iconHTML(c){
  const {all}=matched(c);
  const m=all.length?ART(all[0]):NONE;
  return `<div class="starGuideIcon gsaIcon">${img(m.f,m.alt,'gsaIconImg',56)}</div>`;
 }

 const css=`
 .gsaGallery{margin:10px 0 16px;padding:16px 14px 14px;border:1px solid #eadfca;border-radius:22px;background:linear-gradient(150deg,#fffaf0 0%,#f6faee 100%)}
 .gsaKicker{display:inline-block;font-size:11px;font-weight:900;color:#8a6718;background:#fff2cb;border-radius:999px;padding:4px 10px;margin-bottom:8px}
 .gsaHead h3,.gsaNone h3{font-size:17px;line-height:1.45;color:#234535;margin:0 0 6px;word-break:keep-all}
 .gsaHead p,.gsaNone p{font-size:12.5px;line-height:1.7;color:#766f64;margin:0}
 .gsaGrid{list-style:none;margin:14px 0 0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(138px,1fr));gap:10px}
 .gsaGrid li{margin:0;min-width:0}
 .gsaGrid>li:only-child{grid-column:1/-1;width:100%;max-width:200px;justify-self:center}
 .gsaCard{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;text-align:center;gap:3px;padding:10px 8px 12px;border:1px solid #eadfca;border-radius:18px;background:#fffefb;color:#234535;font:inherit;cursor:pointer;box-shadow:0 2px 8px rgba(80,70,40,.06);transition:transform .15s,border-color .15s}
 .gsaCard:hover{transform:translateY(-2px);border-color:#d8c48f}
 .gsaCard:focus-visible{outline:3px solid #8fbf7a;outline-offset:2px}
 .gsaArt{display:block;width:100%;max-width:128px;aspect-ratio:1/1}
 .gsaImg{display:block;width:100%;height:100%;object-fit:contain}
 .gsaName{font-size:15px;font-weight:900;color:#234535;line-height:1.3}
 .gsaHanja{font-size:11px;color:#a08850;letter-spacing:.08em}
 .gsaWhere{display:flex;flex-wrap:wrap;justify-content:center;gap:4px;min-height:1px}
 .gsaChip{font-size:10.5px;font-weight:800;color:#285d32;background:#edf6df;border-radius:999px;padding:2px 8px}
 .gsaLine{font-size:11.5px;line-height:1.5;color:#766f64;word-break:keep-all;margin-top:2px}
 .gsaMore{margin-top:auto;padding-top:6px;font-size:11.5px;font-weight:900;color:#285d32}
 .gsaMoreBox{margin-top:14px;border-top:1px dashed #e3d7bb;padding-top:10px}
 .gsaMoreBox>summary{cursor:pointer;font-size:13px;font-weight:900;color:#285d32;padding:8px 2px;list-style:none}
 .gsaMoreBox>summary::-webkit-details-marker{display:none}
 .gsaMoreBox>summary::after{content:' ▾';color:#8a6718}
 .gsaMoreBox[open]>summary::after{content:' ▴'}
 .gsaNone{display:flex;gap:14px;align-items:center}
 .gsaNoneImg{flex:none;width:112px;height:112px;object-fit:contain}
 .gsaFig{float:right;width:84px;height:84px;margin:0 0 6px 12px;shape-outside:margin-box}
 .gsaFigImg{display:block;width:100%;height:100%;object-fit:contain}
 article[data-gsa]{display:flow-root}
 article[data-gsa] h3{word-break:keep-all}
 .starGuideIcon.gsaIcon{width:56px;height:56px;border-radius:16px;background:#fffaf0;border:1px solid #eadfca;padding:3px}
 .gsaIconImg{display:block;width:100%;height:100%;object-fit:contain}
 @media(min-width:560px){.gsaArt{max-width:150px}.gsaFig{width:112px;height:112px}}
 @media(min-width:900px){.gsaGallery{padding:20px 20px 18px}}
 @media(max-width:360px){.gsaNone{flex-direction:column;text-align:center}.gsaFig{width:72px;height:72px}}
 @media print{.gsaCard{box-shadow:none}.gsaMore{display:none}}
 @media(prefers-reduced-motion:reduce){.gsaCard{transition:none}}`;
 try{const st=document.createElement('style');st.dataset.guiinStarArt='1';st.textContent=css;document.head.appendChild(st);}catch(_e){}

 // 기존 출력 문자열을 읽어 그림만 덧붙인다. 실패하면 원래 문자열 그대로.
 const priorDetails=window.starDetails;
 if(typeof priorDetails==='function'){
  window.starDetails=function(c){
   const html=priorDetails.apply(this,arguments);
   try{
    if(typeof html!=='string'||html.includes('data-star-art='))return html;
    return gallery(c)+decorate(html,c);
   }catch(_e){return html;}
  };
  try{starDetails=window.starDetails;}catch(_e){}
 }
 const priorGuide=window.guiinStarGuideButtonHTML;
 if(typeof priorGuide==='function'){
  window.guiinStarGuideButtonHTML=function(c){
   const html=priorGuide.apply(this,arguments);
   try{
    const old='<div class="starGuideIcon">☘</div>';
    return typeof html==='string'&&html.includes(old)?html.replace(old,iconHTML(c)):html;
   }catch(_e){return html;}
  };
  try{guiinStarGuideButtonHTML=window.guiinStarGuideButtonHTML;}catch(_e){}
 }
 // 카드 → 해당 별 해설로 이동(스크롤만, 기존 이벤트와 무관)
 document.addEventListener('click',e=>{
  const b=e.target&&e.target.closest?e.target.closest('[data-gsa-star]'):null;
  if(!b)return;
  const t=document.querySelector(`[data-human-section="star-context-${CSS.escape(b.dataset.gsaStar)}"]`);
  if(t){try{t.scrollIntoView({behavior:'smooth',block:'start'});}catch(_e){t.scrollIntoView();}}
 });
 window.GUIIN_STAR_ART={version:'20261011-star-art-v3',map:MAP,more:MORE,none:NONE,gallery,decorate};
})();
