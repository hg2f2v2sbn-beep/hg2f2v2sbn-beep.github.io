/* 귀인사주 홈 화면 다듬기 — 표시 전용 (계산·결제·로그인·이동 함수는 건드리지 않는다)
 * 1) 홈 대표 그림 위 글자가 동물과 겹치지 않게 위쪽에 부드러운 바탕을 깔아 준다.
 * 2) 대운·세운·연운 같은 긴 타일 제목이 두 줄로 꺾이지 않게 한다.
 * 3) 「내 사주에 숨겨진 특별한 별」 동물 친구 소개 띠를 대표 그림 아래에 추가한다. 버튼은 기존 openResultTab('stars')만 호출한다.
 * 실패하면 아무것도 바꾸지 않고 기존 홈이 그대로 보인다.
 */
(function(){
 'use strict';
 if(window.GUIIN_HOME_POLISH)return;
 const FRIENDS=[
  ['star_cheoneul','천을귀인','구름 사이로 날개를 펼치는 흰 학'],
  ['star_munchang','문창귀인','붓과 두루마리 곁에 앉은 까치'],
  ['star_taegeuk','태극귀인','물결 위에서 미소 짓는 푸른 거북이'],
  ['star_woldeok','월덕귀인','둥근 달빛 아래 앉은 흰 토끼'],
  ['star_cheondeok','천덕귀인','푸른 깃털을 펼치며 나는 상서로운 새'],
  ['star_hakdang','학당귀인','책과 등불 곁에 앉은 올빼미'],
  ['star_amrok','암록','도토리를 품은 다람쥐'],
  ['star_cheonui','천의성','풀잎과 꽃 사이에 서 있는 사슴'],
  ['star_geonrok','건록','큰 나무 아래 앉아 있는 곰'],
  ['star_goegang','괴강살','바위 위에 의젓하게 앉은 호랑이']
 ];
 const css=`
 #home .homeHero .heroArt::after{content:"";position:absolute;left:0;right:0;top:0;height:64%;background:linear-gradient(180deg,rgba(255,251,238,.97) 0%,rgba(255,251,238,.78) 55%,rgba(255,251,238,0) 100%);pointer-events:none;z-index:1}
 #home .homeHero .heroText{z-index:3!important;text-shadow:none!important}
 #home .tiles .tile b{white-space:nowrap;letter-spacing:-.05em;font-size:12.5px!important;line-height:1.35}
 #home .tiles .tile{min-height:206px!important}
 #home .ghTeaser{margin:12px 0;padding:16px 0 14px;border:1px solid #eadfca;border-radius:22px;background:linear-gradient(150deg,#fffaf0 0%,#f6faee 100%);overflow:hidden}
 #home .ghTeaser .ghHead{padding:0 16px}
 #home .ghTeaser .ghKicker{display:inline-block;font-size:10.5px;font-weight:900;color:#8a6718;background:#fff2cb;border-radius:999px;padding:4px 10px}
 #home .ghTeaser h3{margin:8px 0 4px;font-size:16.5px;line-height:1.45;color:#234535;word-break:keep-all}
 #home .ghTeaser p{margin:0;font-size:11.5px;line-height:1.65;color:#766f64}
 #home .ghStrip{display:flex;gap:10px;overflow-x:auto;padding:12px 16px 6px;scroll-snap-type:x proximity;-webkit-overflow-scrolling:touch;scrollbar-width:none}
 #home .ghStrip::-webkit-scrollbar{display:none}
 #home .ghFriend{flex:0 0 92px;scroll-snap-align:start;display:flex;flex-direction:column;align-items:center;gap:4px;text-align:center}
 #home .ghFriend span.ghArt{display:block;width:92px;height:92px;border-radius:20px;background:#fffefb;border:1px solid #eee3cb;padding:5px}
 #home .ghFriend img{display:block;width:100%;height:100%;object-fit:contain}
 #home .ghFriend b{font-size:11.5px;color:#234535;font-weight:900}
 #home .ghGo{display:block;width:calc(100% - 32px);margin:8px 16px 0;border:0;border-radius:999px;padding:12px 14px;background:#285d32;color:#fff;font:inherit;font-size:13px;font-weight:900;cursor:pointer}
 #home .ghGo:focus-visible{outline:3px solid #8fbf7a;outline-offset:2px}
 @media(min-width:900px){#home .ghStrip{flex-wrap:wrap;overflow:visible;justify-content:center}}`;
 function inject(){
  try{
   const home=document.getElementById('home');if(!home)return;
   if(!document.querySelector('style[data-guiin-home-polish]')){const st=document.createElement('style');st.dataset.guiinHomePolish='1';st.textContent=css;document.head.appendChild(st);}
   if(home.querySelector('.ghTeaser'))return;
   const hero=home.querySelector('.homeHero');if(!hero)return;
   const box=document.createElement('section');box.className='ghTeaser';box.setAttribute('aria-label','내 사주에 숨겨진 특별한 별 소개');
   box.innerHTML=`<div class="ghHead"><span class="ghKicker">내 사주에 숨겨진 특별한 별</span>
    <h3>귀인과 신살마다 동물 친구가 있어요</h3>
    <p>내 사주에 실제로 성립한 별만 그림으로 보여드려요. 어떤 친구가 내 곁에 있는지 확인해 보세요.</p></div>
    <div class="ghStrip" role="list">${FRIENDS.map(f=>`<div class="ghFriend" role="listitem"><span class="ghArt"><img src="${f[0]}.webp" alt="${f[2]}" width="92" height="92" loading="lazy" decoding="async"></span><b>${f[1]}</b></div>`).join('')}</div>
    <button type="button" class="ghGo" data-gh-go="stars">내 숨은 별 보러 가기 ›</button>`;
   hero.insertAdjacentElement('afterend',box);
   box.querySelector('[data-gh-go]').addEventListener('click',()=>{try{if(typeof openResultTab==='function')openResultTab('stars');else if(typeof go==='function')go('saju');}catch(_e){}});
  }catch(_e){}
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',inject);else inject();
 window.GUIIN_HOME_POLISH={version:'20261011-home-polish-demo',inject};
})();
