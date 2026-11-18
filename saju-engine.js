/**
 * 귀인사주 — 사주팔자 계산 엔진
 * 연주: 입춘 기준 / 월주: 절입 기준 / 일주: 율리우스일 / 시주: 야자시(23시부터 다음날 자시)
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.GuiinSaju = factory();
})(typeof self !== "undefined" ? self : this, function () {
  const STEMS = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"];
  const STEMS_H = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
  const BRANCHES = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"];
  const BRANCHES_H = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
  const ANIMALS = ["쥐", "소", "호랑이", "토끼", "용", "뱀", "말", "양", "원숭이", "닭", "개", "돼지"];
  const STEM_EL = ["목", "목", "화", "화", "토", "토", "금", "금", "수", "수"];
  const BRANCH_EL = ["수", "토", "목", "목", "토", "화", "화", "토", "금", "금", "토", "수"];
  const STEM_YIN = [false, true, false, true, false, true, false, true, false, true];
  const EL_KO = { 목: "목(木)", 화: "화(火)", 토: "토(土)", 금: "금(金)", 수: "수(水)" };
  const EL_COLOR = { 목: "#2f7d4a", 화: "#c23b2e", 토: "#c4a035", 금: "#8a8f99", 수: "#2b6cb0" };

  const TEN_GODS = [
    "비견",
    "겁재",
    "식신",
    "상관",
    "편재",
    "정재",
    "편관",
    "정관",
    "편인",
    "정인",
  ];

  // 월주 천간: 연간에 따른 인월 시작 천간
  const MONTH_STEM_START = [2, 4, 6, 8, 0, 2, 4, 6, 8, 0]; // 甲己丙, 乙庚戊, 丙辛庚, 丁壬壬, 戊癸甲

  // 시주 천간: 일간에 따른 자시 시작 천간
  const HOUR_STEM_START = [0, 2, 4, 6, 8, 0, 2, 4, 6, 8];

  // 1900~2100 절입(절기 중 '절') 근사 — 입춘=0 … 소한 직전 소한은 별도
  // 각 연도 입춘부터 12절의 UTC ms는 계산식으로 구함
  function julianDay(y, m, d) {
    const a = Math.floor((14 - m) / 12);
    const yy = y + 4800 - a;
    const mm = m + 12 * a - 3;
    return (
      d +
      Math.floor((153 * mm + 2) / 5) +
      365 * yy +
      Math.floor(yy / 4) -
      Math.floor(yy / 100) +
      Math.floor(yy / 400) -
      32045
    );
  }

  function julianDayTime(y, m, d, h, mi) {
    return julianDay(y, m, d) + (h - 12) / 24 + mi / 1440;
  }

  // 24절기 시각 — 태양의 겉보기 황경을 근사 계산해 목표 황경에 도달하는 시각을 수치해석합니다.
  // NOAA/Meeus 계열의 저정밀 태양 위치식을 사용한 독립 계산이며 KASI 역서 원자료를 내장한 것은 아닙니다.
  // 절입 경계 ±20분은 외부 정밀 역서와 교차 확인하도록 UI에서 경고합니다.
  const SOLAR_TERM_TARGETS=[285,300,315,330,345,0,15,30,45,60,75,90,105,120,135,150,165,180,195,210,225,240,255,270];
  const SOLAR_TERM_NAMES=["소한","대한","입춘","우수","경칩","춘분","청명","곡우","입하","소만","망종","하지","소서","대서","입추","처서","백로","추분","한로","상강","입동","소설","대설","동지"];
  const TERM_INFO_MIN=[0,21208,42467,63836,85337,107014,128867,150921,173149,195551,218072,240693,263343,285989,308563,331033,353350,375494,397447,419210,440795,462224,483532,504758];
  function approxSolarTermSeedMs(year,n){
    return Date.UTC(1900,0,6,2,5)+31556925974.7*(year-1900)+TERM_INFO_MIN[n]*60000;
  }
  function msToJulian(ms){return ms/86400000+2440587.5}
  function julianToMs(jd){return (jd-2440587.5)*86400000}
  // 태양 겉보기 황경: VSOP87(Meeus 32.A) + ΔT + 장동·광행차. 한국천문연구원 2024년 절입시각과 분 단위 일치 확인.
  // VSOP87 (Meeus, Astronomical Algorithms ch.25/32, Table 32.A) — Earth heliocentric L, R
  const L0=[[175347046,0,0],[3341656,4.6692568,6283.07585],[34894,4.6261,12566.1517],[3497,2.7441,5753.3849],[3418,2.8289,3.5231],[3136,3.6277,77713.7715],[2676,4.4181,7860.4194],[2343,6.1352,3930.2097],[1324,0.7425,11506.7698],[1273,2.0371,529.691],[1199,1.1096,1577.3435],[990,5.233,5884.927],[902,2.045,26.298],[857,3.508,398.149],[780,1.179,5223.694],[753,2.533,5507.553],[505,4.583,18849.228],[492,4.205,775.523],[357,2.92,0.067],[317,5.849,11790.629],[284,1.899,796.298],[271,0.315,10977.079],[243,0.345,5486.778],[206,4.806,2544.314],[205,1.869,5573.143],[202,2.458,6069.777],[156,0.833,213.299],[132,3.411,2942.463],[126,1.083,20.775],[115,0.645,0.98],[103,0.636,4694.003],[102,0.976,15720.839],[102,4.267,7.114],[99,6.21,2146.17],[98,0.68,155.42],[86,5.98,161000.69],[85,1.3,6275.96],[85,3.67,71430.7],[80,1.81,17260.15],[79,3.04,12036.46],[75,1.76,5088.63],[74,3.5,3154.69],[74,4.68,801.82],[70,0.83,9437.76],[62,3.98,8827.39],[61,1.82,7084.9],[57,2.78,6286.6],[56,4.39,14143.5],[56,3.47,6279.55],[52,0.19,12139.55],[52,1.33,1748.02],[51,0.28,5856.48],[49,0.49,1194.45],[41,5.37,8429.24],[41,2.4,19651.05],[39,6.17,10447.39],[37,6.04,10213.29],[37,2.57,1059.38],[36,1.71,2352.87],[36,1.78,6812.77],[33,0.59,17789.85],[30,0.44,83996.85],[30,2.74,1349.87],[25,3.16,4690.48]];
  const L1=[[628331966747,0,0],[206059,2.678235,6283.07585],[4303,2.6351,12566.1517],[425,1.59,3.523],[119,5.796,26.298],[109,2.966,1577.344],[93,2.59,18849.23],[72,1.14,529.69],[68,1.87,398.15],[67,4.41,5507.55],[59,2.89,5223.69],[56,2.17,155.42],[45,0.4,796.3],[36,0.47,775.52],[29,2.65,7.11],[21,5.34,0.98],[19,1.85,5486.78],[19,4.97,213.3],[17,2.99,6275.96],[16,0.03,2544.31],[16,1.43,2146.17],[15,1.21,10977.08],[12,2.83,1748.02],[12,3.26,5088.63],[12,5.27,1194.45],[12,2.08,4694],[11,0.77,553.57],[10,1.3,6286.6],[10,4.24,1349.87],[9,2.7,242.73],[9,5.64,951.72],[8,5.3,2352.87],[6,2.65,9437.76],[6,4.67,4690.48]];
  const L2=[[52919,0,0],[8720,1.0721,6283.0758],[309,0.867,12566.152],[27,0.05,3.52],[16,5.19,26.3],[16,3.68,155.42],[10,0.76,18849.23],[9,2.06,77713.77],[7,0.83,775.52],[5,4.66,1577.34],[4,1.03,7.11],[4,3.44,5573.14],[3,5.14,796.3],[3,6.05,5507.55],[3,1.19,242.73],[3,6.12,529.69],[3,0.31,398.15],[3,2.28,553.57],[2,4.38,5223.69],[2,3.75,0.98]];
  const L3=[[289,5.844,6283.076],[35,0,0],[17,5.49,12566.15],[3,5.2,155.42],[1,4.72,3.52],[1,5.3,18849.23],[1,5.97,242.73]];
  const L4=[[114,3.142,0],[8,4.13,6283.08],[1,3.84,12566.15]];
  const L5=[[1,3.14,0]];
  const R0=[[100013989,0,0],[1670700,3.0984635,6283.07585],[13956,3.05525,12566.1517],[3084,5.1985,77713.7715],[1628,1.1739,5753.3849],[1576,2.8469,7860.4194],[925,5.453,11506.77],[542,4.564,3930.21],[472,3.661,5884.927],[346,0.964,5507.553],[329,5.9,5223.694],[307,0.299,5573.143],[243,4.273,11790.629],[212,5.847,1577.344],[186,5.022,10977.079],[175,3.012,18849.228],[110,5.055,5486.778],[98,0.89,6069.78],[86,5.69,15720.84],[86,1.27,161000.69],[65,0.27,17260.15],[63,0.92,529.69],[57,2.01,83996.85],[56,5.24,71430.7],[49,3.25,2544.31],[47,2.58,775.52],[45,5.54,9437.76],[43,6.01,6275.96],[39,5.36,4694],[38,2.39,8827.39],[37,0.83,19651.05],[37,4.9,12139.55],[36,1.67,12036.46],[35,1.84,2942.46],[33,0.24,7084.9],[32,0.18,5088.63],[32,1.78,398.15],[28,1.21,6286.6],[28,1.9,6279.55],[26,4.59,10447.39]];
  const R1=[[103019,1.10749,6283.07585],[1721,1.0644,12566.1517],[702,3.142,0],[32,1.02,18849.23],[31,2.84,5507.55],[25,1.32,5223.69],[18,1.42,1577.34],[10,5.91,10977.08],[9,1.42,6275.96],[9,0.27,5486.78]];
  const R2=[[4359,5.7846,6283.0758],[124,5.579,12566.152],[12,3.14,0],[9,3.63,77713.77],[6,1.87,5573.14],[3,5.47,18849.23]];
  const R3=[[145,4.273,6283.076],[7,3.92,12566.15]];
  const R4=[[4,2.56,6283.08]];
  function ser(T,t){let s=0;for(const [a,b,c] of T)s+=a*Math.cos(b+c*t);return s;}
  function deltaT(y){let t;
   if(y<1900){t=y-1860;return 7.62+0.5737*t-0.251754*t*t+0.01680668*t**3-0.0004473624*t**4+t**5/233174;}
   if(y<1920){t=y-1900;return -2.79+1.494119*t-0.0598939*t*t+0.0061966*t**3-0.000197*t**4;}
   if(y<1941){t=y-1920;return 21.20+0.84493*t-0.076100*t*t+0.0020936*t**3;}
   if(y<1961){t=y-1950;return 29.07+0.407*t-t*t/233+t**3/2547;}
   if(y<1986){t=y-1975;return 45.45+1.067*t-t*t/260-t**3/718;}
   if(y<2005){t=y-2000;return 63.86+0.3345*t-0.060374*t*t+0.0017275*t**3+0.000651814*t**4+0.00002373599*t**5;}
   if(y<2050){t=y-2000;return 62.92+0.32217*t+0.005589*t*t;}
   if(y<2150){return -20+32*((y-1820)/100)**2-0.5628*(2150-y);}
   t=(y-1820)/100;return -20+32*t*t;}
  function apparentSolarLongitude(jdUT){
   const y=2000+(jdUT-2451545)/365.25;
   const jde=jdUT+deltaT(y)/86400;
   const tau=(jde-2451545)/365250, T=tau*10;
   const L=(ser(L0,tau)+ser(L1,tau)*tau+ser(L2,tau)*tau**2+ser(L3,tau)*tau**3+ser(L4,tau)*tau**4+ser(L5,tau)*tau**5)/1e8;
   const R=(ser(R0,tau)+ser(R1,tau)*tau+ser(R2,tau)*tau**2+ser(R3,tau)*tau**3+ser(R4,tau)*tau**4)/1e8;
   const d=Math.PI/180;
   let th=L/d+180; // geometric
   th-=0.09033/3600; // FK5
   const Om=(125.04452-1934.136261*T)*d, Ls=(280.4665+36000.7698*T)*d, Lm=(218.3165+481267.8813*T)*d;
   const dpsi=(-17.20*Math.sin(Om)-1.32*Math.sin(2*Ls)-0.23*Math.sin(2*Lm)+0.21*Math.sin(2*Om))/3600;
   const ab=-20.4898/3600/R;
   return (((th+dpsi+ab)%360)+360)%360;
  }
  function solarTermMs(year,n){
    if(n<0||n>23) throw new Error("invalid solar term index");
    let jd=msToJulian(approxSolarTermSeedMs(year,n));
    const target=SOLAR_TERM_TARGETS[n];
    for(let i=0;i<10;i++){
      const lon=apparentSolarLongitude(jd);
      const diff=((target-lon+540)%360)-180;
      jd+=diff/0.98564736;
      if(Math.abs(diff)<1e-7)break;
    }
    return julianToMs(jd);
  }
  function solarTermInfo(year,n){
    const ms=solarTermMs(year,n), kst=new Date(ms+9*3600000);
    return {name:SOLAR_TERM_NAMES[n],targetLongitude:SOLAR_TERM_TARGETS[n],utcMs:ms,
      kst:{year:kst.getUTCFullYear(),month:kst.getUTCMonth()+1,day:kst.getUTCDate(),hour:kst.getUTCHours(),minute:kst.getUTCMinutes()}};
  }

  // 입력은 한국시간(KST, UTC+9)
  function birthMsKst(y, m, d, h, mi) {
    return Date.UTC(y, m - 1, d, h, mi, 0) - 9 * 3600000;
  }

  function jieMonthAndYear(y, m, d, h, mi) {
    const t = birthMsKst(y, m, d, h, mi);
    const lichunThis = solarTermMs(y, 2);
    const sohanThis = solarTermMs(y, 0);
    const yearForPillar = t >= lichunThis ? y : y - 1;
    function monthStartMs(yearFor, monthIndex) {
      if (monthIndex <= 10) return solarTermMs(yearFor, 2 + monthIndex * 2);
      if (monthIndex === 11) return solarTermMs(yearFor + 1, 0);
      return solarTermMs(yearFor + 1, 2);
    }
    let monthIndex = 11;
    for (let i = 0; i < 12; i++) {
      const start = monthStartMs(yearForPillar, i);
      const end = monthStartMs(yearForPillar, i + 1);
      if (t >= start && t < end) { monthIndex = i; break; }
    }
    return { yearForPillar, monthIndex, lichunThis, sohanThis };
  }

  function hourBranchIndex(h, mi) {
    // 23:00-00:59 자시(0), 01-02 축 … 21-22 해
    const minutes = h * 60 + mi;
    if (minutes >= 23 * 60 || minutes < 60) return 0;
    return Math.floor((minutes - 60) / 120) + 1;
  }

  function tenGod(dayStem, otherStem) {
    const dEl = STEM_EL[dayStem];
    const oEl = STEM_EL[otherStem];
    const samePolarity = STEM_YIN[dayStem] === STEM_YIN[otherStem];
    const cycle = ["목", "화", "토", "금", "수"];
    const di = cycle.indexOf(dEl);
    const oi = cycle.indexOf(oEl);
    const diff = (oi - di + 5) % 5;
    // 0 same el: 비견(same) 겁재(diff)
    // 1 I generate: 식신(same) 상관(diff)
    // 2 I generate2 / wealth: 편재(same yang pair?) 정재
    // Traditional: 생하는 것=식상, 극하는 것=재성, 극하는 것(내가 극함)=재, 극아=관, 생아=인
    let base;
    if (diff === 0) base = 0;
    else if (diff === 1) base = 2;
    else if (diff === 2) base = 4;
    else if (diff === 3) base = 6;
    else base = 8;
    // 음양이 같으면 편(비견/식신/편재/편관/편인), 다르면 정(겁재? wait)
    // 비견 = same element + same yin/yang
    // 겁재 = same element + opposite
    // 식신 = I generate + same
    // 상관 = I generate + opposite
    // 편재 = I conquer + same
    // 정재 = I conquer + opposite
    // 편관 = conquers me + same
    // 정관 = conquers me + opposite
    // 편인 = generates me + same
    // 정인 = generates me + opposite
    return TEN_GODS[base + (samePolarity ? 0 : 1)];
  }

  function pillarName(si, bi) {
    return {
      ko: STEMS[si] + BRANCHES[bi],
      hanja: STEMS_H[si] + BRANCHES_H[bi],
      stem: STEMS[si],
      stemH: STEMS_H[si],
      branch: BRANCHES[bi],
      branchH: BRANCHES_H[bi],
      stemIndex: si,
      branchIndex: bi,
      stemEl: STEM_EL[si],
      branchEl: BRANCH_EL[bi],
      animal: ANIMALS[bi],
    };
  }


  // 지장간: 지지 안에 포함된 천간을 전통적 비중으로 단순 가중합니다.
  // 이 비중은 오행 분포를 더 세밀하게 보여주기 위한 규칙 기반 값이며 용신 판정이 아닙니다.
  const HIDDEN_STEMS = [
    [[9,1.0]],                         // 자 癸
    [[5,0.6],[9,0.3],[7,0.1]],       // 축 己癸辛
    [[0,0.6],[2,0.3],[4,0.1]],       // 인 甲丙戊
    [[1,1.0]],                         // 묘 乙
    [[4,0.6],[1,0.3],[9,0.1]],       // 진 戊乙癸
    [[2,0.6],[6,0.3],[4,0.1]],       // 사 丙庚戊
    [[3,0.7],[5,0.3]],               // 오 丁己
    [[5,0.6],[3,0.3],[1,0.1]],       // 미 己丁乙
    [[6,0.6],[8,0.3],[4,0.1]],       // 신 庚壬戊
    [[7,1.0]],                         // 유 辛
    [[4,0.6],[7,0.3],[3,0.1]],       // 술 戊辛丁
    [[8,0.7],[0,0.3]]                // 해 壬甲
  ];
  const BRANCH_COMBINE = {0:1,1:0,2:11,11:2,3:10,10:3,4:9,9:4,5:8,8:5,6:7,7:6};
  const BRANCH_CLASH = {0:6,6:0,1:7,7:1,2:8,8:2,3:9,9:3,4:10,10:4,5:11,11:5};
  const BRANCH_HARM = {0:7,7:0,1:6,6:1,2:5,5:2,3:4,4:3,8:11,11:8,9:10,10:9};
  const BRANCH_BREAK = {0:9,9:0,1:4,4:1,2:11,11:2,3:6,6:3,5:8,8:5,7:10,10:7};
  const STEM_COMBINE = {0:5,5:0,1:6,6:1,2:7,7:2,3:8,8:3,4:9,9:4};

  function enrichHidden(p, dayStem) {
    p.hidden = HIDDEN_STEMS[p.branchIndex].map(([si,w],idx)=>({
      stem: STEMS[si], stemH: STEMS_H[si], stemIndex: si, element: STEM_EL[si],
      god: tenGod(dayStem, si), weight: w, role: idx===0 ? "본기" : "여기"
    }));
    return p;
  }

  function chartRelations(ps) {
    const keys=["year","month","day","hour"];
    const labels={year:"년주",month:"월주",day:"일주",hour:"시주"};
    const arr=ps.map((p,i)=>p?{p,key:keys[i],label:labels[keys[i]]}:null).filter(Boolean), out=[];
    const push=(type,x,y,layer)=>out.push({
      type, layer, a:x.p[layer==="천간"?"stem":"branch"], b:y.p[layer==="천간"?"stem":"branch"],
      aKey:x.key,bKey:y.key,aLabel:x.label,bLabel:y.label
    });
    for(let i=0;i<arr.length;i++) for(let j=i+1;j<arr.length;j++){
      const x=arr[i],y=arr[j],a=x.p,b=y.p;
      if(STEM_COMBINE[a.stemIndex]===b.stemIndex) push("천간합",x,y,"천간");
      if(BRANCH_COMBINE[a.branchIndex]===b.branchIndex) push("육합",x,y,"지지");
      if(BRANCH_CLASH[a.branchIndex]===b.branchIndex) push("충",x,y,"지지");
      if(BRANCH_HARM[a.branchIndex]===b.branchIndex) push("해",x,y,"지지");
      if(BRANCH_BREAK[a.branchIndex]===b.branchIndex) push("파",x,y,"지지");
    }
    // 대표적인 지지 형 관계. 자형(辰辰·午午·酉酉·亥亥)도 포함.
    const punishPairs=[[2,5],[5,8],[8,2],[1,10],[10,7],[7,1],[0,3]];
    const selfPunish=new Set([4,6,9,11]);
    for(let i=0;i<arr.length;i++) for(let j=i+1;j<arr.length;j++){
      const x=arr[i],y=arr[j],a=x.p.branchIndex,b=y.p.branchIndex;
      if(punishPairs.some(([u,v])=>(a===u&&b===v)||(a===v&&b===u)) || (a===b&&selfPunish.has(a))) push("형",x,y,"지지");
    }
    // 삼합은 세 지지가 모두 원국에 존재할 때 한 묶음으로 표시.
    const triads=[{b:[8,0,4],name:"신자진 수국"},{b:[2,6,10],name:"인오술 화국"},{b:[5,9,1],name:"사유축 금국"},{b:[11,3,7],name:"해묘미 목국"}];
    triads.forEach(t=>{
      const found=arr.filter(x=>t.b.includes(x.p.branchIndex));
      if(new Set(found.map(x=>x.p.branchIndex)).size===3) out.push({
        type:"삼합",layer:"지지",name:t.name,
        members:found.map(x=>({key:x.key,label:x.label,branch:x.p.branch}))
      });
    });
    return out;
  }


  // Korean lunar calendar conversion table, 1900–2050.
  // The conversion is used only to normalize a user-entered lunar birth date to a solar date;
  // saju pillars are then calculated from the normalized solar date and solar terms.
  const LUNAR_BASE_YEAR=1900, LUNAR_MAX_YEAR=2050;
  const LUNAR_YEAR_DATA=[0x830084bd,0x82c404ae,0x82c60a57,0x82fe554d,0xc2c40d26,0x82c60d95,0x83014655,0x82c4056a,0xc2c609ad,0x8300255d,0x82c404ae,0x83006a5b,0xc2c40a4d,0x82c40d25,0x83005da9,0x82c60b55,0xc2c4056a,0x83002ada,0x82c6095d,0x830074bb,0xc2c4049b,0x82c40a4b,0x83005b4b,0x82c406a9,0xc2c40ad4,0x83024bb5,0x82c402b6,0x82c6095b,0xc3002537,0x82c40497,0x82fe6656,0x82c40e4a,0xc2c60ea5,0x830156a9,0x82c605b5,0x82c402b6,0xc30138ae,0x82c4092e,0x83017c8d,0x82c40c95,0xc2c40d4a,0x83016d8a,0x82c60b69,0x82c6056d,0xc301425b,0x82c4025d,0x82c4092d,0x83002d2b,0xc2c40a95,0x83007d55,0x82c40b4a,0x82c60b55,0xc3015555,0x82c604db,0x82c4025b,0x83013857,0xc2c4052b,0x83008a9b,0x82c40695,0x82c406aa,0xc3006aea,0x82c60ab5,0x82c404b6,0x83004aae,0xc2c60a57,0x82c40527,0x82fe3726,0x82c60d95,0xc30076b5,0x82c4056a,0x82c609ad,0x830054dd,0xc2c404ae,0x82c40a4e,0x83004d4d,0x82c40d25,0xc3008d59,0x82c40b54,0x82c60d6a,0x8301695a,0xc2c6095b,0x82c4049b,0x83004a9b,0x82c40a4b,0xc300ab27,0x82c406a5,0x82c406d4,0x83026b75,0xc2c402b6,0x82c6095b,0x830054b7,0x82c40497,0xc2c4064b,0x82fe374a,0x82c60ea5,0x830086d9,0xc2c605ad,0x82c402b6,0x8300596e,0x82c4092e,0xc2c40c96,0x83004e95,0x82c40d4a,0x82c60da5,0xc3002755,0x82c4056c,0x83027abb,0x82c4025d,0xc2c4092d,0x83005cab,0x82c40a95,0x82c40b4a,0xc3013b4a,0x82c60b55,0x8300955d,0x82c404ba,0xc2c60a5b,0x83005557,0x82c4052b,0x82c40a95,0xc3004b95,0x82c406aa,0x82c60ad5,0x830026b5,0xc2c404b6,0x83006a6e,0x82c60a57,0x82c40527,0xc2fe56a6,0x82c60d93,0x82c405aa,0x83003b6a,0xc2c6096d,0x8300b4af,0x82c404ae,0x82c40a4d,0xc3016d0d,0x82c40d25,0x82c40d52,0x83005dd4,0xc2c60b6a,0x82c6096d,0x8300255b,0x82c4049b,0xc3007a57,0x82c40a4b,0x82c40b25,0x83015b25,0xc2c406d4,0x82c60ada,0x830138b6];
  function lunarData(y){ if(y<LUNAR_BASE_YEAR||y>LUNAR_MAX_YEAR) throw new Error("음력 입력은 1900~2050년만 지원합니다."); return LUNAR_YEAR_DATA[y-LUNAR_BASE_YEAR]>>>0; }
  function lunarLeapMonth(y){ return (lunarData(y)>>>12)&15; }
  function lunarMonthDays(y,m,leap=false){
    if(m<1||m>12) throw new Error("음력 월을 확인해 주세요.");
    const d=lunarData(y), lm=(d>>>12)&15;
    if(leap){ if(lm!==m) throw new Error(`${y}년 음력 ${m}월은 윤달이 아닙니다.`); return ((d>>>16)&1)?30:29; }
    return ((d>>>(12-m))&1)?30:29;
  }
  function lunarYearDays(y){ return (lunarData(y)>>>17)&0x1ff; }
  function lunarToSolar(y,m,d,leap=false){
    y=Number(y);m=Number(m);d=Number(d);leap=!!leap;
    if(!Number.isInteger(y)||!Number.isInteger(m)||!Number.isInteger(d)) throw new Error("음력 생년월일을 확인해 주세요.");
    const md=lunarMonthDays(y,m,leap); if(d<1||d>md) throw new Error(`${y}년 음력 ${m}월${leap?" 윤달":""}은 ${md}일까지입니다.`);
    let offset=0;
    for(let yy=1900;yy<y;yy++) offset+=lunarYearDays(yy);
    const lm=lunarLeapMonth(y);
    for(let mm=1;mm<m;mm++){ offset+=lunarMonthDays(y,mm,false); if(lm===mm) offset+=lunarMonthDays(y,mm,true); }
    if(leap) offset+=lunarMonthDays(y,m,false);
    offset+=d-1;
    const dt=new Date(Date.UTC(1900,0,31)+offset*86400000);
    return {year:dt.getUTCFullYear(),month:dt.getUTCMonth()+1,day:dt.getUTCDate(),source:{year:y,month:m,day:d,leap},leapMonth:lm};
  }


const NAYIN_30=["해중금","노중화","대림목","노방토","검봉금","산두화","간하수","성두토","백랍금","양류목","천중수","옥상토","벽력화","송백목","장류수","사중금","산하화","평지목","벽상토","금박금","복등화","천하수","대역토","차천금","상자목","대계수","사중토","천상화","석류목","대해수"];
const VOID_BY_XUN=[["戌","亥"],["申","酉"],["午","未"],["辰","巳"],["寅","卯"],["子","丑"]];
function pillar60Index(stem,branch){for(let i=0;i<60;i++)if(STEMS[i%10]===stem&&BRANCHES[i%12]===branch)return i;return -1}
function nayinForPillar(p){const i=pillar60Index(p.stem,p.branch);return i<0?null:NAYIN_30[Math.floor(i/2)]}
function voidBranchesForPillar(p){const i=pillar60Index(p.stem,p.branch);return i<0?[]:VOID_BY_XUN[Math.floor(i/10)]}
function foundationalExtras(pillars){
 const dayVoid=voidBranchesForPillar(pillars.day),yearVoid=voidBranchesForPillar(pillars.year);
 const roots=[];
 const dayStemIndex=pillars.day.stemIndex;
 Object.entries(pillars).forEach(([k,p])=>{
  if(!p)return;
  const hidden=HIDDEN_STEMS[p.branchIndex]||[];
  const hit=hidden.find(([stemIndex])=>stemIndex===dayStemIndex);
  if(hit) roots.push({pillar:k,branch:p.branch,kind:"지장간에 일간과 같은 천간이 존재",weight:hit[1]});
 });
 return {nayin:{year:nayinForPillar(pillars.year),month:nayinForPillar(pillars.month),day:nayinForPillar(pillars.day),hour:pillars.hour?nayinForPillar(pillars.hour):null},
  void:{day:dayVoid,year:yearVoid},roots};
}

  // Stored charts retain calendar/correction markers. Restore their civil source once,
  // rather than interpreting a solar date as lunar or applying solar time twice.
  function validateBirthInput(input) {
    if(!input || typeof input!=="object") throw new Error("invalid birth input");
    const y=Number(input.year),m=Number(input.month),d=Number(input.day);
    if(!Number.isInteger(y)||y<100||y>9999) throw new Error("출생연도 범위를 확인해.");
    if(!Number.isInteger(m)||m<1||m>12||!Number.isInteger(d)||d<1) throw new Error("생년월일 범위를 확인해.");
    if(input.calendar!=="음력") {
      const date=new Date(Date.UTC(y,m-1,d));
      if(date.getUTCFullYear()!==y||date.getUTCMonth()!==m-1||date.getUTCDate()!==d) throw new Error("존재하지 않는 양력 날짜야.");
    }
    if(!input.hourUnknown) {
      const h=Number(input.hour),mi=Number(input.minute??0);
      if(input.hour===null||input.hour===undefined||input.hour===""||!Number.isInteger(h)||h<0||h>23||!Number.isInteger(mi)||mi<0||mi>59) throw new Error("출생시간 범위를 확인해.");
    }
    if(input.trueSolarApply && !input.hourUnknown && (input.longitude===null||input.longitude===undefined||input.longitude===""||!Number.isFinite(Number(input.longitude))||Number(input.longitude)<-180||Number(input.longitude)>180)) throw new Error("진태양시 적용에는 유효한 출생지 경도가 필요해.");
  }
  // 한국 시계 시간 이력(서머타임·표준시 변경) 보정.
  // 출처: IANA tz database Asia/Seoul (2018 국가기록원 자료 반영본). [UTC 시작 시각(ms), UTC 오프셋(분)]
  // 출생 당시 시계 시간을 지금 기준(UTC+9) 시계 시간으로 바꿔서 계산한다.
  const KOREA_CLOCK_HISTORY=[
    ["1908-03-31T15:32Z",510],["1911-12-31T15:30Z",540],
    ["1948-05-31T15:00Z",600],["1948-09-12T14:00Z",540],["1949-04-02T15:00Z",600],["1949-09-10T14:00Z",540],
    ["1950-03-31T15:00Z",600],["1950-09-09T14:00Z",540],["1951-05-05T15:00Z",600],["1951-09-08T14:00Z",540],
    ["1954-03-20T15:00Z",510],
    ["1955-05-04T15:30Z",570],["1955-09-08T14:30Z",510],["1956-05-19T15:30Z",570],["1956-09-29T14:30Z",510],
    ["1957-05-04T15:30Z",570],["1957-09-21T14:30Z",510],["1958-05-03T15:30Z",570],["1958-09-20T14:30Z",510],
    ["1959-05-02T15:30Z",570],["1959-09-19T14:30Z",510],["1960-04-30T15:30Z",570],["1960-09-17T14:30Z",510],
    ["1961-08-09T15:30Z",540],
    ["1987-05-09T17:00Z",600],["1987-10-10T17:00Z",540],["1988-05-07T17:00Z",600],["1988-10-08T17:00Z",540]
  ].map(function(r){return [Date.parse(r[0].replace('Z',':00Z')),r[1]];});
  function koreaOffsetAtUtc(ms){
    if(ms<KOREA_CLOCK_HISTORY[0][0])return 540;
    let off=540;for(let i=0;i<KOREA_CLOCK_HISTORY.length;i++){if(ms>=KOREA_CLOCK_HISTORY[i][0])off=KOREA_CLOCK_HISTORY[i][1];else break;}
    return off;
  }
  function koreaClockCorrection(y,m,d,h,mi){
    if(y>1989||y<1908)return null;
    const local=Date.UTC(y,m-1,d,h,mi);
    // 시계 시간 → UTC: 후보 오프셋 중 앞뒤가 맞는 것을 고른다 (겹치는 시간대는 표준시 쪽을 택함)
    const cands=[540,600,510,570];let off=null;
    for(const c of cands){if(koreaOffsetAtUtc(local-c*60000)===c){off=c;break;}}
    if(off===null)off=koreaOffsetAtUtc(local-540*60000);
    if(off===540)return null;
    const shift=540-off,t=new Date(local+shift*60000);
    const label=off===600||off===570?'서머타임':'당시 표준시(UTC+8:30)';
    return {offsetMinutes:off,shiftMinutes:shift,label:label,
      corrected:{year:t.getUTCFullYear(),month:t.getUTCMonth()+1,day:t.getUTCDate(),hour:t.getUTCHours(),minute:t.getUTCMinutes()}};
  }
  function calculate(input) {
    if(input?.calendar==="음력" && input.originalDate) input={...input,year:input.originalDate.year,month:input.originalDate.month,day:input.originalDate.day,leapMonth:!!input.originalDate.leap};
    if(input?.trueSolarApply && input.sourceDateTime) input={...input,...input.sourceDateTime};
    validateBirthInput(input);
    const originalInput={...input};
    const requestedDayBoundary=input.dayBoundary==="00"?"00":"23";
    const requestedTrueSolar=!!input.trueSolarApply;
    const requestedLongitude=Number(input.longitude);

    let lunarConversion=null;
    if(input.calendar==="음력"){ lunarConversion=lunarToSolar(input.year,input.month,input.day,!!input.leapMonth); input={...input,...lunarConversion,calendar:"양력"}; }
    let clockCorrection=null;
    const preClock={year:+input.year,month:+input.month,day:+input.day,hour:+input.hour,minute:+(input.minute||0)};
    if(!input.hourUnknown){
      clockCorrection=koreaClockCorrection(+input.year,+input.month,+input.day,+input.hour,+(input.minute||0));
      if(clockCorrection)input={...input,...clockCorrection.corrected};
    }
    let trueSolarApplied=null;
    if(requestedTrueSolar && !input.hourUnknown && Number.isFinite(requestedLongitude)){
      const preview=trueSolarPreview(input,requestedLongitude,135);
      if(preview.available){
        trueSolarApplied=preview;
        input={...input,year:preview.corrected.year,month:preview.corrected.month,day:preview.corrected.day,hour:preview.corrected.hour,minute:preview.corrected.minute};
      }
    }
    // 화면·저장용 입력값은 사용자가 넣은 시계 시간 그대로 둔다 (다시 계산할 때 이중 보정 방지)
    const showClock=!!clockCorrection&&!trueSolarApplied;
    const year = +input.year;
    const month = +input.month;
    const day = +input.day;
    let hour = input.hourUnknown ? 12 : +input.hour;
    let minute = input.hourUnknown ? 0 : +(input.minute || 0);
    const gender = input.gender === "여" ? "여" : "남";

    const { yearForPillar, monthIndex } = jieMonthAndYear(year, month, day, hour, minute);

    const yearStem = ((yearForPillar - 4) % 10 + 10) % 10;
    const yearBranch = ((yearForPillar - 4) % 12 + 12) % 12;

    const monthBranch = (monthIndex + 2) % 12; // 0 -> 인(2)
    const monthStem = (MONTH_STEM_START[yearStem] + monthIndex) % 10;

    // 일주: JDN. 1984-02-02 = 丙寅일 실제 1984-02-02는 목요일.
    // 표준: AJD 0.0 = 음... 갑자일 = JDN 11 이 정씨 공식
    // (jdn + 49) % 60 === 0 → 甲子  is common for noon-based
    const jdn = julianDay(year, month, day);
    // 검증용 상수: 1990-10-10 = 戊申
    // JDN 1990-10-10 = 2448175
    // 己=5, 未=7 → index 60 cycle: stem = idx%10, branch=idx%12, 己未 idx where 5,7
    // idx ≡ 5 (mod 10), idx ≡ 7 (mod 12)
    // Use: dayIndex = jdn + OFFSET
    const dayIndex = ((jdn + 49) % 60 + 60) % 60;
    let dayStem = dayIndex % 10;
    let dayBranch = dayIndex % 12;

    // 일주 경계: 사용자가 23시 야자시 기준 또는 자정(00시) 기준을 선택합니다.
    if (!input.hourUnknown && requestedDayBoundary==="23" && hour >= 23) {
      const next = ((dayIndex + 1) % 60 + 60) % 60;
      dayStem = next % 10;
      dayBranch = next % 12;
    }

    const hBranch = input.hourUnknown ? null : hourBranchIndex(hour, minute);
    const hStem = input.hourUnknown ? null : (HOUR_STEM_START[dayStem] + hBranch) % 10;

    const yearP = pillarName(yearStem, yearBranch);
    const monthP = pillarName(monthStem, monthBranch);
    const dayP = pillarName(dayStem, dayBranch);
    const hourP = hStem == null ? null : pillarName(hStem, hBranch);

    const pillars = [yearP, monthP, dayP];
    if (hourP) pillars.push(hourP);
    pillars.forEach(p => enrichHidden(p, dayStem));

    yearP.god = tenGod(dayStem, yearStem);
    monthP.god = tenGod(dayStem, monthStem);
    dayP.god = "일간";
    if (hourP) hourP.god = tenGod(dayStem, hStem);

    const elCount = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
    pillars.forEach((p) => {
      // 겉으로 드러난 천간 + 지지 내부 지장간을 함께 반영
      elCount[p.stemEl] += 1.0;
      p.hidden.forEach(h => { elCount[h.element] += h.weight; });
    });

    // 대운: 양남음여 순행
    const yangYear = !STEM_YIN[yearStem];
    const forward = (yangYear && gender === "남") || (!yangYear && gender === "여");

    // 대운 시작 나이: 절입까지 남은 날 / 3
    const JIE = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22];
    function monthStartMs(yfp, mi) {
      if (mi <= 10) return solarTermMs(yfp, JIE[mi]);
      if (mi === 11) return solarTermMs(yfp + 1, 0);
      return solarTermMs(yfp + 1, 2); // next 인월 = 다음 입춘
    }
    const birth = birthMsKst(year, month, day, hour, minute);
    let startAgeExact=0, startGapDays=0, startReferenceMs=null;
    if (forward) {
      startReferenceMs=monthStartMs(yearForPillar, monthIndex + 1);
      startGapDays=Math.max(0,(startReferenceMs-birth)/86400000);
    } else {
      startReferenceMs=monthStartMs(yearForPillar, monthIndex);
      startGapDays=Math.max(0,(birth-startReferenceMs)/86400000);
    }
    startAgeExact=startGapDays/3;
    const startAge=Math.max(0,Math.round(startAgeExact));
    const startY=Math.floor(startAgeExact);
    const startM=Math.floor((startAgeExact-startY)*12);
    const startD=Math.round((((startAgeExact-startY)*12)-startM)*30.44);
    const startAgeText=`약 ${startY}년 ${startM}개월 ${startD}일`;
    const luck = [];
    let ls = monthStem;
    let lb = monthBranch;
    for (let i = 0; i < 10; i++) {
      if (forward) {
        ls = (ls + 1) % 10;
        lb = (lb + 1) % 12;
      } else {
        ls = (ls + 9) % 10;
        lb = (lb + 11) % 12;
      }
      const p = pillarName(ls, lb);
      p.fromAge = startAge + i * 10;
      p.toAge = p.fromAge + 9;
      p.fromAgeExact = startAgeExact + i*10;
      p.toAgeExact = p.fromAgeExact + 10;
      p.god = tenGod(dayStem, ls);
      luck.push(p);
    }

    return {
      input: {
        name: input.name || "이름 없음",
        gender,
        year: showClock ? preClock.year : year,
        month: showClock ? preClock.month : month,
        day: showClock ? preClock.day : day,
        hour: input.hourUnknown ? null : (showClock ? preClock.hour : hour),
        minute: input.hourUnknown ? null : (showClock ? preClock.minute : minute),
        hourUnknown: !!input.hourUnknown,
        calendar: originalInput.calendar || "양력",
        leapMonth: !!originalInput.leapMonth,
        originalDate: originalInput.calendar==="음력"?{year:originalInput.year,month:originalInput.month,day:originalInput.day,leap:!!originalInput.leapMonth}:null,
        normalizedSolarDate: lunarConversion?(showClock?{year:preClock.year,month:preClock.month,day:preClock.day}:{year,month,day}):null,
        dayBoundary: requestedDayBoundary,
        trueSolarApply: requestedTrueSolar,
        longitude: Number.isFinite(requestedLongitude)?requestedLongitude:null,
        effectiveDateTime: trueSolarApplied?trueSolarApplied.corrected:null,
        clockCorrection: clockCorrection,
        ...(trueSolarApplied?{sourceDateTime:{year:originalInput.year,month:originalInput.month,day:originalInput.day,hour:originalInput.hour,minute:originalInput.minute||0}}:{}),
      },
      yearForPillar,
      pillars: { year: yearP, month: monthP, day: dayP, hour: hourP },
      extras: foundationalExtras({ year: yearP, month: monthP, day: dayP, hour: hourP }),
      dayMaster: {
        stem: STEMS[dayStem],
        hanja: STEMS_H[dayStem],
        el: STEM_EL[dayStem],
        yin: STEM_YIN[dayStem] ? "음" : "양",
      },
      elCount,
      relations: chartRelations(pillars),
      stars: specialStars({year:yearP,month:monthP,day:dayP,hour:hourP}, dayStem),
      twelveStages: twelveStagesForPillars({year:yearP,month:monthP,day:dayP,hour:hourP}, dayStem),
      calculation: {
        engineVersion: "6.0.0-expert-interpretation",
        solarTerms: "태양 겉보기 황경 수치해석 · 경계 ±20분 교차확인 권장",
        lunarConversion: lunarConversion?`음력 ${originalInput.year}.${originalInput.month}.${originalInput.day}${originalInput.leapMonth?" 윤달":""} → 양력 ${year}.${month}.${day}`:"양력 직접 입력",
        timezone: "KST UTC+9",
        trueSolarTime: !!trueSolarApplied,
        longitudeCorrection: !!trueSolarApplied,
        trueSolarCorrection: trueSolarApplied?trueSolarApplied.correction:null,
        dayBoundary: requestedDayBoundary==="23"?"23:00 다음 일주 적용":"00:00 자정 일주 변경",
        elementMethod: "천간 + 지장간 가중",
        boundaryDiagnostics: boundaryDiagnostics({year,month,day,hour,minute,hourUnknown:!!input.hourUnknown}),
        ...(input.hourUnknown?{uncertainty:unknownTimeRange(year,month,day,gender,requestedDayBoundary)}:{})
      },
      luck,
      startAge,
      startAgeExact,
      startGapDays,
      startAgeText,
      startReferenceMs,
      startAgeRule: "순·역행 절입까지 실제 시간 간격 ÷ 3일=1년 환산; 기존 호환 표시 나이는 반올림",
      forward,
    };
  }

  // 신살/귀인 보조 계산층.
  // 신살은 유파별 기준 차이가 있어 원국의 핵심 판단보다 낮은 우선순위의 참고 정보로 제공합니다.
  const SINSAL_50_CATALOG=[{name:"겁살",group:"12신살"},{name:"재살",group:"12신살"},{name:"천살",group:"12신살"},{name:"지살",group:"12신살"},{name:"도화살",group:"12신살"},{name:"월살",group:"12신살"},{name:"망신살",group:"12신살"},{name:"장성살",group:"12신살"},{name:"반안살",group:"12신살"},{name:"역마살",group:"12신살"},{name:"육해살",group:"12신살"},{name:"화개살",group:"12신살"},{name:"천을귀인",group:"귀인·길신"},{name:"천덕귀인",group:"귀인·길신"},{name:"월덕귀인",group:"귀인·길신"},{name:"문창귀인",group:"귀인·길신"},{name:"태극귀인",group:"귀인·길신"},{name:"복성귀인",group:"귀인·길신"},{name:"금여성",group:"귀인·길신"},{name:"관귀학관",group:"귀인·길신"},{name:"천문성",group:"귀인·길신"},{name:"천의성",group:"귀인·길신"},{name:"건록",group:"귀인·길신"},{name:"암록",group:"귀인·길신"},{name:"협록",group:"귀인·길신"},{name:"문곡귀인",group:"귀인·길신"},{name:"학당귀인",group:"귀인·길신"},{name:"홍염살",group:"매력·관계"},{name:"원진살",group:"매력·관계"},{name:"귀문관살",group:"매력·관계"},{name:"고란살",group:"매력·관계"},{name:"고신살",group:"매력·관계"},{name:"과숙살",group:"매력·관계"},{name:"양인살",group:"강한 기운"},{name:"괴강살",group:"강한 기운"},{name:"백호살",group:"강한 기운"},{name:"현침살",group:"강한 기운"},{name:"탕화살",group:"강한 기운"},{name:"낙정관살",group:"강한 기운"},{name:"공망",group:"특수"},{name:"천라지망",group:"특수"},{name:"삼기",group:"특수"},{name:"월공",group:"특수"},{name:"상문살",group:"특수"},{name:"조객살",group:"특수"},{name:"형살",group:"지지 관계"},{name:"충살",group:"지지 관계"},{name:"파살",group:"지지 관계"},{name:"해살",group:"지지 관계"},{name:"삼합",group:"지지 관계"}];
  const SINSAL_50_DEFAULT_META={"겁살":{group:"12신살",short:"12신살에서 살펴보는 전통 명리의 보조 상징",good:"원국 전체와 함께 보면 자신의 반복 패턴을 이해하는 참고가 될 수 있어요.",watch:"이 항목 하나만으로 성격·사건·질병·결혼·재물을 단정하지 않습니다."},"재살":{group:"12신살",short:"12신살에서 살펴보는 전통 명리의 보조 상징",good:"원국 전체와 함께 보면 자신의 반복 패턴을 이해하는 참고가 될 수 있어요.",watch:"이 항목 하나만으로 성격·사건·질병·결혼·재물을 단정하지 않습니다."},"천살":{group:"12신살",short:"12신살에서 살펴보는 전통 명리의 보조 상징",good:"원국 전체와 함께 보면 자신의 반복 패턴을 이해하는 참고가 될 수 있어요.",watch:"이 항목 하나만으로 성격·사건·질병·결혼·재물을 단정하지 않습니다."},"지살":{group:"12신살",short:"12신살에서 살펴보는 전통 명리의 보조 상징",good:"원국 전체와 함께 보면 자신의 반복 패턴을 이해하는 참고가 될 수 있어요.",watch:"이 항목 하나만으로 성격·사건·질병·결혼·재물을 단정하지 않습니다."},"도화살":{group:"12신살",short:"12신살에서 살펴보는 전통 명리의 보조 상징",good:"원국 전체와 함께 보면 자신의 반복 패턴을 이해하는 참고가 될 수 있어요.",watch:"이 항목 하나만으로 성격·사건·질병·결혼·재물을 단정하지 않습니다."},"월살":{group:"12신살",short:"12신살에서 살펴보는 전통 명리의 보조 상징",good:"원국 전체와 함께 보면 자신의 반복 패턴을 이해하는 참고가 될 수 있어요.",watch:"이 항목 하나만으로 성격·사건·질병·결혼·재물을 단정하지 않습니다."},"망신살":{group:"12신살",short:"12신살에서 살펴보는 전통 명리의 보조 상징",good:"원국 전체와 함께 보면 자신의 반복 패턴을 이해하는 참고가 될 수 있어요.",watch:"이 항목 하나만으로 성격·사건·질병·결혼·재물을 단정하지 않습니다."},"장성살":{group:"12신살",short:"12신살에서 살펴보는 전통 명리의 보조 상징",good:"원국 전체와 함께 보면 자신의 반복 패턴을 이해하는 참고가 될 수 있어요.",watch:"이 항목 하나만으로 성격·사건·질병·결혼·재물을 단정하지 않습니다."},"반안살":{group:"12신살",short:"12신살에서 살펴보는 전통 명리의 보조 상징",good:"원국 전체와 함께 보면 자신의 반복 패턴을 이해하는 참고가 될 수 있어요.",watch:"이 항목 하나만으로 성격·사건·질병·결혼·재물을 단정하지 않습니다."},"역마살":{group:"12신살",short:"12신살에서 살펴보는 전통 명리의 보조 상징",good:"원국 전체와 함께 보면 자신의 반복 패턴을 이해하는 참고가 될 수 있어요.",watch:"이 항목 하나만으로 성격·사건·질병·결혼·재물을 단정하지 않습니다."},"육해살":{group:"12신살",short:"12신살에서 살펴보는 전통 명리의 보조 상징",good:"원국 전체와 함께 보면 자신의 반복 패턴을 이해하는 참고가 될 수 있어요.",watch:"이 항목 하나만으로 성격·사건·질병·결혼·재물을 단정하지 않습니다."},"화개살":{group:"12신살",short:"12신살에서 살펴보는 전통 명리의 보조 상징",good:"원국 전체와 함께 보면 자신의 반복 패턴을 이해하는 참고가 될 수 있어요.",watch:"이 항목 하나만으로 성격·사건·질병·결혼·재물을 단정하지 않습니다."},"천을귀인":{group:"귀인·길신",short:"귀인·길신에서 살펴보는 전통 명리의 보조 상징",good:"원국 전체와 함께 보면 자신의 반복 패턴을 이해하는 참고가 될 수 있어요.",watch:"이 항목 하나만으로 성격·사건·질병·결혼·재물을 단정하지 않습니다."},"천덕귀인":{group:"귀인·길신",short:"귀인·길신에서 살펴보는 전통 명리의 보조 상징",good:"원국 전체와 함께 보면 자신의 반복 패턴을 이해하는 참고가 될 수 있어요.",watch:"이 항목 하나만으로 성격·사건·질병·결혼·재물을 단정하지 않습니다."},"월덕귀인":{group:"귀인·길신",short:"귀인·길신에서 살펴보는 전통 명리의 보조 상징",good:"원국 전체와 함께 보면 자신의 반복 패턴을 이해하는 참고가 될 수 있어요.",watch:"이 항목 하나만으로 성격·사건·질병·결혼·재물을 단정하지 않습니다."},"문창귀인":{group:"귀인·길신",short:"귀인·길신에서 살펴보는 전통 명리의 보조 상징",good:"원국 전체와 함께 보면 자신의 반복 패턴을 이해하는 참고가 될 수 있어요.",watch:"이 항목 하나만으로 성격·사건·질병·결혼·재물을 단정하지 않습니다."},"태극귀인":{group:"귀인·길신",short:"귀인·길신에서 살펴보는 전통 명리의 보조 상징",good:"원국 전체와 함께 보면 자신의 반복 패턴을 이해하는 참고가 될 수 있어요.",watch:"이 항목 하나만으로 성격·사건·질병·결혼·재물을 단정하지 않습니다."},"복성귀인":{group:"귀인·길신",short:"귀인·길신에서 살펴보는 전통 명리의 보조 상징",good:"원국 전체와 함께 보면 자신의 반복 패턴을 이해하는 참고가 될 수 있어요.",watch:"이 항목 하나만으로 성격·사건·질병·결혼·재물을 단정하지 않습니다."},"금여성":{group:"귀인·길신",short:"귀인·길신에서 살펴보는 전통 명리의 보조 상징",good:"원국 전체와 함께 보면 자신의 반복 패턴을 이해하는 참고가 될 수 있어요.",watch:"이 항목 하나만으로 성격·사건·질병·결혼·재물을 단정하지 않습니다."},"관귀학관":{group:"귀인·길신",short:"귀인·길신에서 살펴보는 전통 명리의 보조 상징",good:"원국 전체와 함께 보면 자신의 반복 패턴을 이해하는 참고가 될 수 있어요.",watch:"이 항목 하나만으로 성격·사건·질병·결혼·재물을 단정하지 않습니다."},"천문성":{group:"귀인·길신",short:"귀인·길신에서 살펴보는 전통 명리의 보조 상징",good:"원국 전체와 함께 보면 자신의 반복 패턴을 이해하는 참고가 될 수 있어요.",watch:"이 항목 하나만으로 성격·사건·질병·결혼·재물을 단정하지 않습니다."},"천의성":{group:"귀인·길신",short:"귀인·길신에서 살펴보는 전통 명리의 보조 상징",good:"원국 전체와 함께 보면 자신의 반복 패턴을 이해하는 참고가 될 수 있어요.",watch:"이 항목 하나만으로 성격·사건·질병·결혼·재물을 단정하지 않습니다."},"건록":{group:"귀인·길신",short:"귀인·길신에서 살펴보는 전통 명리의 보조 상징",good:"원국 전체와 함께 보면 자신의 반복 패턴을 이해하는 참고가 될 수 있어요.",watch:"이 항목 하나만으로 성격·사건·질병·결혼·재물을 단정하지 않습니다."},"암록":{group:"귀인·길신",short:"귀인·길신에서 살펴보는 전통 명리의 보조 상징",good:"원국 전체와 함께 보면 자신의 반복 패턴을 이해하는 참고가 될 수 있어요.",watch:"이 항목 하나만으로 성격·사건·질병·결혼·재물을 단정하지 않습니다."},"협록":{group:"귀인·길신",short:"귀인·길신에서 살펴보는 전통 명리의 보조 상징",good:"원국 전체와 함께 보면 자신의 반복 패턴을 이해하는 참고가 될 수 있어요.",watch:"이 항목 하나만으로 성격·사건·질병·결혼·재물을 단정하지 않습니다."},"문곡귀인":{group:"귀인·길신",short:"귀인·길신에서 살펴보는 전통 명리의 보조 상징",good:"원국 전체와 함께 보면 자신의 반복 패턴을 이해하는 참고가 될 수 있어요.",watch:"이 항목 하나만으로 성격·사건·질병·결혼·재물을 단정하지 않습니다."},"학당귀인":{group:"귀인·길신",short:"귀인·길신에서 살펴보는 전통 명리의 보조 상징",good:"원국 전체와 함께 보면 자신의 반복 패턴을 이해하는 참고가 될 수 있어요.",watch:"이 항목 하나만으로 성격·사건·질병·결혼·재물을 단정하지 않습니다."},"홍염살":{group:"매력·관계",short:"매력·관계에서 살펴보는 전통 명리의 보조 상징",good:"원국 전체와 함께 보면 자신의 반복 패턴을 이해하는 참고가 될 수 있어요.",watch:"이 항목 하나만으로 성격·사건·질병·결혼·재물을 단정하지 않습니다."},"원진살":{group:"매력·관계",short:"매력·관계에서 살펴보는 전통 명리의 보조 상징",good:"원국 전체와 함께 보면 자신의 반복 패턴을 이해하는 참고가 될 수 있어요.",watch:"이 항목 하나만으로 성격·사건·질병·결혼·재물을 단정하지 않습니다."},"귀문관살":{group:"매력·관계",short:"매력·관계에서 살펴보는 전통 명리의 보조 상징",good:"원국 전체와 함께 보면 자신의 반복 패턴을 이해하는 참고가 될 수 있어요.",watch:"이 항목 하나만으로 성격·사건·질병·결혼·재물을 단정하지 않습니다."},"고란살":{group:"매력·관계",short:"매력·관계에서 살펴보는 전통 명리의 보조 상징",good:"원국 전체와 함께 보면 자신의 반복 패턴을 이해하는 참고가 될 수 있어요.",watch:"이 항목 하나만으로 성격·사건·질병·결혼·재물을 단정하지 않습니다."},"고신살":{group:"매력·관계",short:"매력·관계에서 살펴보는 전통 명리의 보조 상징",good:"원국 전체와 함께 보면 자신의 반복 패턴을 이해하는 참고가 될 수 있어요.",watch:"이 항목 하나만으로 성격·사건·질병·결혼·재물을 단정하지 않습니다."},"과숙살":{group:"매력·관계",short:"매력·관계에서 살펴보는 전통 명리의 보조 상징",good:"원국 전체와 함께 보면 자신의 반복 패턴을 이해하는 참고가 될 수 있어요.",watch:"이 항목 하나만으로 성격·사건·질병·결혼·재물을 단정하지 않습니다."},"양인살":{group:"강한 기운",short:"강한 기운에서 살펴보는 전통 명리의 보조 상징",good:"원국 전체와 함께 보면 자신의 반복 패턴을 이해하는 참고가 될 수 있어요.",watch:"이 항목 하나만으로 성격·사건·질병·결혼·재물을 단정하지 않습니다."},"괴강살":{group:"강한 기운",short:"강한 기운에서 살펴보는 전통 명리의 보조 상징",good:"원국 전체와 함께 보면 자신의 반복 패턴을 이해하는 참고가 될 수 있어요.",watch:"이 항목 하나만으로 성격·사건·질병·결혼·재물을 단정하지 않습니다."},"백호살":{group:"강한 기운",short:"강한 기운에서 살펴보는 전통 명리의 보조 상징",good:"원국 전체와 함께 보면 자신의 반복 패턴을 이해하는 참고가 될 수 있어요.",watch:"이 항목 하나만으로 성격·사건·질병·결혼·재물을 단정하지 않습니다."},"현침살":{group:"강한 기운",short:"강한 기운에서 살펴보는 전통 명리의 보조 상징",good:"원국 전체와 함께 보면 자신의 반복 패턴을 이해하는 참고가 될 수 있어요.",watch:"이 항목 하나만으로 성격·사건·질병·결혼·재물을 단정하지 않습니다."},"탕화살":{group:"강한 기운",short:"강한 기운에서 살펴보는 전통 명리의 보조 상징",good:"원국 전체와 함께 보면 자신의 반복 패턴을 이해하는 참고가 될 수 있어요.",watch:"이 항목 하나만으로 성격·사건·질병·결혼·재물을 단정하지 않습니다."},"낙정관살":{group:"강한 기운",short:"강한 기운에서 살펴보는 전통 명리의 보조 상징",good:"원국 전체와 함께 보면 자신의 반복 패턴을 이해하는 참고가 될 수 있어요.",watch:"이 항목 하나만으로 성격·사건·질병·결혼·재물을 단정하지 않습니다."},"공망":{group:"특수",short:"특수에서 살펴보는 전통 명리의 보조 상징",good:"원국 전체와 함께 보면 자신의 반복 패턴을 이해하는 참고가 될 수 있어요.",watch:"이 항목 하나만으로 성격·사건·질병·결혼·재물을 단정하지 않습니다."},"천라지망":{group:"특수",short:"특수에서 살펴보는 전통 명리의 보조 상징",good:"원국 전체와 함께 보면 자신의 반복 패턴을 이해하는 참고가 될 수 있어요.",watch:"이 항목 하나만으로 성격·사건·질병·결혼·재물을 단정하지 않습니다."},"삼기":{group:"특수",short:"특수에서 살펴보는 전통 명리의 보조 상징",good:"원국 전체와 함께 보면 자신의 반복 패턴을 이해하는 참고가 될 수 있어요.",watch:"이 항목 하나만으로 성격·사건·질병·결혼·재물을 단정하지 않습니다."},"월공":{group:"특수",short:"특수에서 살펴보는 전통 명리의 보조 상징",good:"원국 전체와 함께 보면 자신의 반복 패턴을 이해하는 참고가 될 수 있어요.",watch:"이 항목 하나만으로 성격·사건·질병·결혼·재물을 단정하지 않습니다."},"상문살":{group:"특수",short:"특수에서 살펴보는 전통 명리의 보조 상징",good:"원국 전체와 함께 보면 자신의 반복 패턴을 이해하는 참고가 될 수 있어요.",watch:"이 항목 하나만으로 성격·사건·질병·결혼·재물을 단정하지 않습니다."},"조객살":{group:"특수",short:"특수에서 살펴보는 전통 명리의 보조 상징",good:"원국 전체와 함께 보면 자신의 반복 패턴을 이해하는 참고가 될 수 있어요.",watch:"이 항목 하나만으로 성격·사건·질병·결혼·재물을 단정하지 않습니다."},"형살":{group:"지지 관계",short:"지지 관계에서 살펴보는 전통 명리의 보조 상징",good:"원국 전체와 함께 보면 자신의 반복 패턴을 이해하는 참고가 될 수 있어요.",watch:"이 항목 하나만으로 성격·사건·질병·결혼·재물을 단정하지 않습니다."},"충살":{group:"지지 관계",short:"지지 관계에서 살펴보는 전통 명리의 보조 상징",good:"원국 전체와 함께 보면 자신의 반복 패턴을 이해하는 참고가 될 수 있어요.",watch:"이 항목 하나만으로 성격·사건·질병·결혼·재물을 단정하지 않습니다."},"파살":{group:"지지 관계",short:"지지 관계에서 살펴보는 전통 명리의 보조 상징",good:"원국 전체와 함께 보면 자신의 반복 패턴을 이해하는 참고가 될 수 있어요.",watch:"이 항목 하나만으로 성격·사건·질병·결혼·재물을 단정하지 않습니다."},"해살":{group:"지지 관계",short:"지지 관계에서 살펴보는 전통 명리의 보조 상징",good:"원국 전체와 함께 보면 자신의 반복 패턴을 이해하는 참고가 될 수 있어요.",watch:"이 항목 하나만으로 성격·사건·질병·결혼·재물을 단정하지 않습니다."},"삼합":{group:"지지 관계",short:"지지 관계에서 살펴보는 전통 명리의 보조 상징",good:"원국 전체와 함께 보면 자신의 반복 패턴을 이해하는 참고가 될 수 있어요.",watch:"이 항목 하나만으로 성격·사건·질병·결혼·재물을 단정하지 않습니다."}};
  const SINSAL_META = {
    "도화살": {group:"매력·표현", tone:"popular", short:"사람의 시선과 호감을 끄는 힘", good:"표현·서비스·영업·콘텐츠처럼 사람과 만나는 장면에서 매력으로 쓰기 좋습니다.", watch:"인기나 관심을 관계의 확신으로 바로 해석하지 않는 것이 좋아요."},
    "역마살": {group:"변화·이동", tone:"move", short:"움직임과 변화에 반응하는 힘", good:"이동·출장·여행·새 환경처럼 변화가 있는 자리에서 활력이 살아날 수 있어요.", watch:"변화 자체가 목적이 되어 자주 방향을 바꾸지는 않는지 확인해 보세요."},
    "화개살": {group:"몰입·감성", tone:"deep", short:"혼자 깊게 파고드는 몰입과 감성", good:"예술·연구·전문기술·취향처럼 한 분야를 깊게 파는 힘으로 쓰기 좋아요.", watch:"생각이 깊어질수록 혼자만의 결론에 갇히지 않도록 바깥 피드백도 받아보세요."},
    "천을귀인": {group:"귀인·도움", tone:"good", short:"도움과 해결의 연결을 상징하는 귀인", good:"어려울 때 사람·정보·제도를 통해 해결 실마리를 찾는 상징으로 읽습니다.", watch:"귀인이 있다고 기다리기보다 먼저 도움을 요청하고 관계를 관리하는 행동이 중요해요."},
    "문창귀인": {group:"배움·표현", tone:"good", short:"배움·글·정리·표현의 재능을 상징", good:"공부한 것을 글·말·기술·문서로 정리할 때 장점이 살아날 수 있어요.", watch:"아는 것을 실제 결과로 옮기는 단계까지 연결해 보세요."},
    "태극귀인": {group:"통찰·배움", tone:"good", short:"이해력과 탐구 성향을 상징하는 귀인", good:"복잡한 것을 이해하고 자기 방식으로 정리하는 힘을 살펴볼 때 참고합니다.", watch:"상징 하나만으로 총명함이나 성공을 확정하지 않아요."},
    "홍염살": {group:"매력·표현", tone:"popular", short:"개성 있는 매력과 감정 표현을 상징", good:"자기 취향과 분위기를 드러내는 장면에서 존재감으로 쓰일 수 있어요.", watch:"강한 호감과 오래가는 관계는 다른 문제라는 점을 기억하세요."},
    "양인살": {group:"추진·결단", tone:"power", short:"결단력과 밀어붙이는 힘을 상징", good:"책임이 분명하고 결단이 필요한 상황에서 추진력으로 활용할 수 있어요.", watch:"급한 결정이나 힘으로 밀어붙이는 방식은 한 번 더 점검하세요."},
    "괴강살": {group:"주도·기준", tone:"power", short:"강한 기준과 주도성을 상징", good:"자기 기준을 세우고 책임지는 자리에서 강점으로 읽을 수 있어요.", watch:"강한 기준이 타인에게는 압박으로 느껴질 수 있어 전달 방식을 조절해 보세요."},
    "귀문관살": {group:"감각·몰입", tone:"deep", short:"예민한 감각과 깊은 몰입을 상징", good:"세밀한 관찰과 독특한 관점이 필요한 분야에서 장점으로 바꿀 수 있어요.", watch:"불안이나 질환을 뜻한다고 단정하지 않습니다. 실제 어려움은 전문가의 평가가 기준입니다."},
    "원진살": {group:"관계·조정", tone:"relation", short:"가까운 관계에서 감정의 엇갈림을 상징", good:"서로 다른 기대를 말로 확인해야 한다는 관계 체크포인트로 활용할 수 있어요.", watch:"특정 사람과의 악연을 뜻하지 않습니다."},
    "공망": {group:"비움·재정비", tone:"deep", short:"비어 있음과 재정비의 상징", good:"계획을 고정하기보다 여지를 두고 다시 점검하는 신호로 읽을 수 있어요.", watch:"재물·결혼·가족이 사라진다는 식으로 해석하지 않습니다."},
    "건록": {group:"자립·기반", tone:"good", short:"자기 힘으로 기반을 세우는 상징", good:"꾸준히 실력과 생활 기반을 쌓는 힘을 살펴볼 때 참고합니다.", watch:"독립심이 모든 일을 혼자 해야 한다는 뜻은 아니에요."},
    "천덕귀인": {group:"귀인·완충", tone:"good", short:"월지 기준으로 보는 전통적 완충·도움의 길신", good:"갈등이나 난관에서 주변 도움과 조정 여지를 살피는 보조 상징으로 참고합니다.", watch:"재난을 막아준다거나 반드시 귀인을 만난다고 단정하지 않습니다."},
    "월덕귀인": {group:"귀인·완충", tone:"good", short:"월지 삼합국의 양간으로 보는 전통 길신", good:"관계 속 배려와 도움의 연결을 보는 보조 상징으로 참고합니다.", watch:"길흉을 뒤집는 절대적인 별로 해석하지 않습니다."},
    "암록": {group:"귀인·기반", tone:"good", short:"건록의 육합지로 보는 숨은 기반의 상징", good:"드러나지 않은 도움·연결·생활 기반을 점검하는 보조 지표로 활용합니다.", watch:"숨은 재물이나 공짜 행운을 보장하는 뜻은 아닙니다."},
    "학당귀인": {group:"배움·전문성", tone:"good", short:"배움과 가르침의 자질을 상징하는 전통 귀인", good:"공부·자격·교육·전문기술처럼 지식을 쌓고 전달하는 장면에서 참고합니다.", watch:"성적이나 합격을 보증하는 별은 아닙니다."},
    "천의성": {group:"돌봄·회복", tone:"good", short:"월지 기준으로 보는 돌봄과 회복의 전통 상징", good:"돌봄·상담·건강관리처럼 사람을 보살피는 관심사를 살펴볼 때 참고합니다.", watch:"의료인 적성이나 질병을 진단하는 지표로 사용하지 않습니다."}
  };

  Object.keys(SINSAL_50_DEFAULT_META).forEach(k=>{if(!SINSAL_META[k])SINSAL_META[k]=SINSAL_50_DEFAULT_META[k];});
  function starHit(name, pillarKey, basis, extra) {
    return Object.assign({name, pillar:pillarKey, basis, meta:SINSAL_META[name]||{group:"특별한 기운",short:"명식의 보조 상징",good:"원국과 함께 참고합니다.",watch:"단독으로 길흉을 정하지 않습니다."}}, extra||{});
  }
  function uniqStarHits(hits) {
    const seen=new Set();
    return hits.filter(h=>{const k=[h.name,h.pillar,h.basis].join("|"); if(seen.has(k)) return false; seen.add(k); return true;});
  }
  function voidBranches(dayStem, dayBranch) {
    const cycleIndex = Array.from({length:60},(_,i)=>i).find(i=>i%10===dayStem && i%12===dayBranch);
    const xunStart = cycleIndex - (cycleIndex%10);
    const used = new Set(Array.from({length:10},(_,i)=>(xunStart+i)%12));
    return Array.from({length:12},(_,i)=>i).filter(i=>!used.has(i));
  }
  function specialStars(pillars, dayStem) {
    const entries=[["year",pillars.year],["month",pillars.month],["day",pillars.day],["hour",pillars.hour]].filter(x=>x[1]);
    const dayBranch=pillars.day.branchIndex, yearBranch=pillars.year.branchIndex, hits=[];
    const peach={8:9,0:9,4:9,2:3,6:3,10:3,5:6,9:6,1:6,11:0,3:0,7:0};
    const horse={8:2,0:2,4:2,2:8,6:8,10:8,5:11,9:11,1:11,11:5,3:5,7:5};
    const canopy={8:4,0:4,4:4,2:10,6:10,10:10,5:1,9:1,1:1,11:7,3:7,7:7};
    const noble={
      0:[1,7],4:[1,7],6:[1,7], 1:[0,8],5:[0,8], 2:[11,9],3:[11,9],
      7:[2,6], 8:[3,5],9:[3,5]
    };
    const literary={0:5,1:6,2:8,3:9,4:8,5:9,6:11,7:0,8:2,9:3};
    const taiji={0:[0,6],1:[0,6],2:[3,9],3:[3,9],4:[4,10,1,7],5:[4,10,1,7],6:[2,11],7:[2,11],8:[5,8],9:[5,8]};
    const hongyeom={0:6,1:8,2:2,3:6,4:4,5:4,6:10,7:9,8:0,9:8};
    const blade={0:3,1:2,2:6,3:5,4:6,5:5,6:9,7:8,8:0,9:11};
    const guimenPairs=[[0,9],[1,6],[2,7],[3,8],[4,11],[5,10]];
    const wonjinPairs=[[0,7],[1,6],[2,9],[3,8],[4,11],[5,10]];
    const guigang=new Set(["경진","경술","임진","무술"]);
    const geonrok={0:2,1:3,2:5,3:6,4:5,5:6,6:8,7:9,8:11,9:0};
    // 검증된 추가 귀인 5종. 신살은 유파차이가 있으므로 아래 채택표를 계산 근거로 공개합니다.
    const monthBranch=pillars.month.branchIndex;
    // 천덕귀인: 월지별 대상 글자. stem은 천간, branch는 지지에서 찾습니다.
    const cheondeok={2:["stem",3],3:["branch",8],4:["stem",8],5:["stem",7],6:["branch",11],7:["stem",0],8:["stem",9],9:["branch",2],10:["stem",2],11:["stem",1],0:["branch",5],1:["stem",6]};
    // 월덕귀인: 寅午戌→丙, 亥卯未→甲, 申子辰→壬, 巳酉丑→庚.
    const woldeokStem={2:2,6:2,10:2,11:0,3:0,7:0,8:8,0:8,4:8,5:6,9:6,1:6};
    // 암록은 일간 건록의 육합지, 학당은 통용 장생지, 천의성은 월지 한 칸 앞 지지.
    const amrok={0:11,1:10,2:8,3:7,4:8,5:7,6:5,7:4,8:2,9:1};
    const hakdang={0:11,1:6,2:2,3:9,4:2,5:9,6:5,7:0,8:8,9:3};
    const cheonui=(monthBranch+11)%12;

    function addByBranch(name,target,basis,excludeBasisSelf=false){
      entries.forEach(([k,p])=>{
        if(p.branchIndex===target && !(excludeBasisSelf && ((basis==="년지"&&k==="year")||(basis==="일지"&&k==="day"))))
          hits.push(starHit(name,k,basis));
      });
    }
    function addByStem(name,target,basis){
      entries.forEach(([k,p])=>{ if(p.stemIndex===target) hits.push(starHit(name,k,basis)); });
    }
    // 년지·일지 두 기준을 모두 보여주되 같은 위치/이름/기준 중복은 제거합니다.
    addByBranch("도화살",peach[yearBranch],"년지");
    addByBranch("도화살",peach[dayBranch],"일지");
    addByBranch("역마살",horse[yearBranch],"년지");
    addByBranch("역마살",horse[dayBranch],"일지");
    addByBranch("화개살",canopy[yearBranch],"년지");
    addByBranch("화개살",canopy[dayBranch],"일지");

    (noble[dayStem]||[]).forEach(b=>addByBranch("천을귀인",b,"일간"));
    addByBranch("문창귀인",literary[dayStem],"일간");
    (taiji[dayStem]||[]).forEach(b=>addByBranch("태극귀인",b,"일간"));
    addByBranch("홍염살",hongyeom[dayStem],"일간");
    addByBranch("양인살",blade[dayStem],"일간");
    addByBranch("건록",geonrok[dayStem],"일간");

    // 추가 검증 귀인 5종 계산
    const td=cheondeok[monthBranch];
    if(td){ if(td[0]==="stem") addByStem("천덕귀인",td[1],"월지·채택표"); else addByBranch("천덕귀인",td[1],"월지·채택표"); }
    addByStem("월덕귀인",woldeokStem[monthBranch],"월지·삼합국 양간");
    addByBranch("암록",amrok[dayStem],"일간·건록의 육합지");
    addByBranch("학당귀인",hakdang[dayStem],"일간·장생지 통용표");
    addByBranch("천의성",cheonui,"월지·직전 지지");

    entries.forEach(([k,p])=>{
      if(guigang.has(p.ko)) hits.push(starHit("괴강살",k,"일주·간지"));
    });
    function addPairStars(name,pairs){
      for(let i=0;i<entries.length;i++) for(let j=i+1;j<entries.length;j++){
        const [ka,a]=entries[i],[kb,b]=entries[j];
        if(pairs.some(([x,y])=>(a.branchIndex===x&&b.branchIndex===y)||(a.branchIndex===y&&b.branchIndex===x))){
          hits.push(starHit(name,ka,`${ka}↔${kb}`));
          hits.push(starHit(name,kb,`${ka}↔${kb}`));
        }
      }
    }
    addPairStars("귀문관살",guimenPairs);
    addPairStars("원진살",wonjinPairs);

    const voids=voidBranches(dayStem,dayBranch);
    entries.forEach(([k,p])=>{if(voids.includes(p.branchIndex))hits.push(starHit("공망",k,"일주旬"));});


    // 12신살 전체: 삼합국 기준 순환표. 년지와 일지를 각각 기준으로 확인합니다.
    const twelveNames=["겁살","재살","천살","지살","도화살","월살","망신살","장성살","반안살","역마살","육해살","화개살"];
    const twelveStart={8:5,0:5,4:5, 2:11,6:11,10:11, 5:2,9:2,1:2, 11:8,3:8,7:8};
    function addTwelve(baseBranch,basis){
      const start=twelveStart[baseBranch];
      if(start===undefined)return;
      entries.forEach(([k,p])=>{
        const offset=(p.branchIndex-start+12)%12;
        hits.push(starHit(twelveNames[offset],k,basis+"·12신살"));
      });
    }
    addTwelve(yearBranch,"년지");
    addTwelve(dayBranch,"일지");

    // 지지 관계성: 형·충·파·해·삼합. 사건 예측이 아니라 원국 내부 관계 표식입니다.
    const chungPairs=[[0,6],[1,7],[2,8],[3,9],[4,10],[5,11]];
    const haePairs=[[0,7],[1,6],[2,5],[3,4],[8,11],[9,10]];
    const paPairs=[[0,9],[1,4],[2,11],[3,6],[5,8],[7,10]];
    const hyeongPairs=[[2,5],[5,8],[8,2],[1,10],[10,7],[7,1],[0,3]];
    function addRelation(name,pairs){
      for(let i=0;i<entries.length;i++)for(let j=i+1;j<entries.length;j++){
        const [ka,a]=entries[i],[kb,b]=entries[j];
        if(pairs.some(([x,y])=>(a.branchIndex===x&&b.branchIndex===y)||(a.branchIndex===y&&b.branchIndex===x))){
          hits.push(starHit(name,ka,`${ka}↔${kb}`)); hits.push(starHit(name,kb,`${ka}↔${kb}`));
        }
      }
    }
    addRelation("충살",chungPairs); addRelation("해살",haePairs); addRelation("파살",paPairs); addRelation("형살",hyeongPairs);
    const triads=[[8,0,4],[2,6,10],[5,9,1],[11,3,7]];
    triads.forEach(t=>{
      const present=entries.filter(([k,p])=>t.includes(p.branchIndex));
      if(new Set(present.map(x=>x[1].branchIndex)).size===3) present.forEach(([k])=>hits.push(starHit("삼합",k,"원국 3지")));
    });

    // 천라지망: 辰巳 / 戌亥가 원국에서 함께 보이는 전통적 표식.
    [[[4,5]],[[10,11]]].flat().forEach(([a,b])=>{
      const pa=entries.filter(x=>x[1].branchIndex===a), pb=entries.filter(x=>x[1].branchIndex===b);
      if(pa.length&&pb.length){pa.concat(pb).forEach(([k])=>hits.push(starHit("천라지망",k,"지지 조합")));}
    });

    // 고신·과숙: 년지 삼합국 기준의 대표적인 전통 표.
    const gosin={11:2,0:2,1:2, 2:5,3:5,4:5, 5:8,6:8,7:8, 8:11,9:11,10:11};
    const gwasuk={11:10,0:10,1:10, 2:1,3:1,4:1, 5:4,6:4,7:4, 8:7,9:7,10:7};
    addByBranch("고신살",gosin[yearBranch],"년지");
    addByBranch("과숙살",gwasuk[yearBranch],"년지");

    // 현침: 천간/지지 글자 자체의 형상을 보는 대표 기준.
    const needleStems=new Set([0,7]); // 甲, 辛
    const needleBranches=new Set([3,6,8]); // 卯, 午, 申
    entries.forEach(([k,p])=>{if(needleStems.has(p.stemIndex)||needleBranches.has(p.branchIndex))hits.push(starHit("현침살",k,"간지 형상"));});

    // 백호: 널리 쓰이는 백호대살 7일주 기준.
    const baekhoDays=new Set(["갑진","을미","병술","정축","무진","임술","계축"]);
    if(baekhoDays.has(pillars.day.ko))hits.push(starHit("백호살","day","일주"));

    // 삼기: 천간 3개가 甲戊庚 / 乙丙丁 / 壬癸辛 세 조합 중 하나를 모두 포함하는지 확인.
    const stemSet=new Set(entries.map(x=>x[1].stemIndex));
    [[0,4,6],[1,2,3],[8,9,7]].forEach(arr=>{if(arr.every(x=>stemSet.has(x)))entries.filter(x=>arr.includes(x[1].stemIndex)).forEach(([k])=>hits.push(starHit("삼기",k,"천간 3기")));});

    const clean=uniqStarHits(hits);
    const counts={}; clean.forEach(h=>counts[h.name]=(counts[h.name]||0)+1);
    const supported=new Set(["겁살","재살","천살","지살","도화살","월살","망신살","장성살","반안살","역마살","육해살","화개살","천을귀인","천덕귀인","월덕귀인","문창귀인","태극귀인","천의성","건록","암록","학당귀인","홍염살","양인살","괴강살","귀문관살","원진살","공망","고신살","과숙살","백호살","현침살","천라지망","삼기","형살","충살","파살","해살","삼합"]);
    const catalogue=SINSAL_50_CATALOG.map(x=>Object.assign({},x,{count:counts[x.name]||0,status:supported.has(x.name)?"calculated":"school-dependent"}));
    return {hits:clean, counts, total:clean.length, catalogue, supportedCount:supported.size, catalogCount:SINSAL_50_CATALOG.length, voidBranches:voids.map(i=>BRANCHES[i])};
  }


  const TWELVE_STAGES=["장생","목욕","관대","건록","제왕","쇠","병","사","묘","절","태","양"];
  // 일간별 장생 시작 지지: 甲亥 乙午 丙寅 丁酉 戊寅 己酉 庚巳 辛子 壬申 癸卯.
  // 양간은 순행, 음간은 역행하는 통용표를 사용합니다.
  const TWELVE_STAGE_START=[11,6,2,9,2,9,5,0,8,3];
  function twelveStage(dayStem, branchIndex){
    const start=TWELVE_STAGE_START[dayStem];
    const forward=(dayStem%2===0);
    const offset=forward ? (branchIndex-start+12)%12 : (start-branchIndex+12)%12;
    return TWELVE_STAGES[offset];
  }
  function twelveStagesForPillars(pillars,dayStem){
    const out={};
    ["year","month","day","hour"].forEach(k=>{if(pillars[k])out[k]=twelveStage(dayStem,pillars[k].branchIndex);});
    return out;
  }

  // 특정 날짜의 세운·월운·일운을 출생 명식과 분리해 계산하는 공개 헬퍼.
  // 화면에서 날짜 흐름을 조회할 때 같은 계산식을 재사용해 UI와 엔진의 결과가 어긋나지 않게 합니다.
  function calendarPillars(year, month, day, hour=12, minute=0, options={}) {
    const c = calculate({name:"달력", gender:"여", calendar:"양력", year, month, day, hour, minute, hourUnknown:false,
      dayBoundary:options.dayBoundary||"23",trueSolarApply:!!options.trueSolarApply,longitude:options.longitude});
    return {year:c.pillars.year, month:c.pillars.month, day:c.pillars.day, hour:c.pillars.hour};
  }
  function flowForDate(year, month, day, dayStem, hour=12, minute=0, options={}) {
    const pillars=calendarPillars(year,month,day,hour,minute,options);
    const ds=typeof dayStem==="number"?dayStem:STEMS.indexOf(dayStem);
    if(ds<0) throw new Error("invalid day stem");
    const out={pillars,gods:{},stages:{}};
    ["year","month","day","hour"].forEach(k=>{
      const p=pillars[k];
      out.gods[k]=tenGod(ds,p.stemIndex);
      out.stages[k]=twelveStage(ds,p.branchIndex);
    });
    return out;
  }


  // 원국에 하나의 운 간지를 겹쳐 합·충·형·파·해·삼합 등을 확인합니다.
  // transit를 임시 시주 슬롯에 넣어 기존 관계 계산식을 재사용하며, 결과의 hour 라벨은 운으로 바꿉니다.
  function relationsWithTransit(basePillars, transit) {
    if(!basePillars || !transit) return [];
    const merged=[basePillars.year,basePillars.month,basePillars.day,transit];
    return chartRelations(merged).filter(r=>
      r.aKey==="hour" || r.bKey==="hour" || (r.members||[]).some(m=>m.key==="hour")
    ).map(r=>{
      const x=Object.assign({},r);
      if(x.aKey==="hour"){x.aKey="transit";x.aLabel="운";}
      if(x.bKey==="hour"){x.bKey="transit";x.bLabel="운";}
      if(x.members)x.members=x.members.map(m=>m.key==="hour"?Object.assign({},m,{key:"transit",label:"운"}):m);
      return x;
    });
  }


  // 정밀 시간 보조층: 표준시를 바꾸지 않고, 사용자가 선택했을 때만
  // 경도 보정 + 균시차(EoT)로 진태양시와의 차이를 비교합니다.
  // NOAA 계열의 간단 근사식이며 역법 원국의 기본값에는 자동 적용하지 않습니다.
  function equationOfTimeMinutes(year, month, day) {
    const start = Date.UTC(year,0,1), cur = Date.UTC(year,month-1,day);
    const n = Math.floor((cur-start)/86400000)+1;
    const b = 2*Math.PI*(n-81)/364;
    return 9.87*Math.sin(2*b)-7.53*Math.cos(b)-1.5*Math.sin(b);
  }
  function trueSolarCorrectionMinutes(year,month,day,longitude,standardMeridian=135) {
    const lon=Number(longitude), sm=Number(standardMeridian);
    if(!Number.isFinite(lon)||!Number.isFinite(sm)) throw new Error("invalid longitude");
    const longitudeMinutes=4*(lon-sm);
    const equationMinutes=equationOfTimeMinutes(year,month,day);
    return {longitudeMinutes,equationMinutes,totalMinutes:longitudeMinutes+equationMinutes};
  }
  function trueSolarPreview(input, longitude, standardMeridian=135) {
    if(input.hourUnknown) return {available:false,reason:"출생시간 미상"};
    const corr=trueSolarCorrectionMinutes(input.year,input.month,input.day,longitude,standardMeridian);
    const base=Date.UTC(input.year,input.month-1,input.day,Number(input.hour)||0,Number(input.minute)||0);
    const dt=new Date(base+corr.totalMinutes*60000);
    const h=dt.getUTCHours(), mi=dt.getUTCMinutes();
    const originalBranch=hourBranchIndex(Number(input.hour)||0,Number(input.minute)||0);
    const correctedBranch=hourBranchIndex(h,mi);
    return {available:true,correction:corr,corrected:{year:dt.getUTCFullYear(),month:dt.getUTCMonth()+1,day:dt.getUTCDate(),hour:h,minute:mi},originalBranch,correctedBranch,branchChanged:originalBranch!==correctedBranch};
  }
  function unknownTimeRange(year,month,day,gender,dayBoundary) {
    // Existing known-hour engine computes endpoint candidates; no synthetic hour pillar is kept.
    const minutes=new Set([0,720,1439]);
    for(let n=0;n<24;n+=2){const term=new Date(solarTermMs(year,n)+9*3600000);if(term.getUTCMonth()+1===month&&term.getUTCDate()===day){const at=term.getUTCHours()*60+term.getUTCMinutes();[at-1,at,at+1].filter(m=>m>=0&&m<1440).forEach(m=>minutes.add(m));}}
    const samples=[...minutes].map(m=>calculate({year,month,day,hour:Math.floor(m/60),minute:m%60,gender,calendar:"양력",dayBoundary,hourUnknown:false}));
    const candidates={};
    for(const key of ["year","month","day"]) candidates[key]=[...new Set(samples.map(c=>c.pillars[key].ko))];
    const startAges=samples.map(c=>c.startAgeExact);
    return {reference:"기존 정오 대표 계산 유지",candidates,uncertainPillars:Object.keys(candidates).filter(k=>candidates[k].length>1),startAgeExactRange:[Math.min(...startAges),Math.max(...startAges)],hourPillar:null,
      note:"시간 미상: 시주는 제외했고 일주·절입일 연월주와 대운 시작 시점은 출생시각에 따라 달라져. 대표값을 확정값으로 보지 마."};
  }
  function boundaryDiagnostics(input) {
    const out=[];
    if(input.hourUnknown) return [{type:"hour-unknown",level:"info",text:"출생시간 미상이라 시주와 시간 민감 해석을 제외합니다."}];
    const mins=(Number(input.hour)||0)*60+(Number(input.minute)||0);
    const hourEdges=[60,180,300,420,540,660,780,900,1020,1140,1260,1380];
    const hourDist=Math.min(...hourEdges.map(x=>Math.abs(mins-x)),Math.abs(mins-1440),mins);
    if(hourDist<=40) out.push({type:"hour-boundary",level:"warn",minutes:hourDist,text:`시지 경계와 약 ${hourDist}분 이내입니다. 출생지 보정 여부에 따라 시주가 달라질 수 있습니다.`});
    const t=birthMsKst(input.year,input.month,input.day,Number(input.hour)||0,Number(input.minute)||0);
    const jy=jieMonthAndYear(input.year,input.month,input.day,Number(input.hour)||0,Number(input.minute)||0);
    const starts=[];
    for(let y=jy.yearForPillar-1;y<=jy.yearForPillar+1;y++) for(let n=0;n<24;n+=2) starts.push(solarTermMs(y,n));
    const termDist=Math.min(...starts.map(x=>Math.abs(t-x)))/60000;
    if(termDist<=720) out.push({type:"solar-term-boundary",level:"warn",minutes:Math.round(termDist),text:`절입 경계와 약 ${Math.round(termDist)}분 이내입니다. 현재 천문 근사 계산에서도 경계 오차가 중요하므로 정밀 역서와 월주를 교차 확인하세요.`});
    if(mins>=22*60+20 || mins<=40) out.push({type:"day-boundary",level:"warn",text:"23시 전후는 일주 경계 기준이 유파마다 다를 수 있어 선택한 ‘23시 야자시’ 또는 ‘자정 변경’ 기준을 함께 확인하세요."});
    return out;
  }

  function normalizeEl(elCount) {
    const total = Object.values(elCount).reduce((a, b) => a + b, 0) || 1;
    const out = {};
    for (const k of ["목", "화", "토", "금", "수"]) out[k] = Math.round((elCount[k] / total) * 100);
    return out;
  }

  return {
    STEMS,
    STEMS_H,
    BRANCHES,
    BRANCHES_H,
    ANIMALS,
    STEM_EL,
    BRANCH_EL,
    EL_KO,
    EL_COLOR,
    TEN_GODS,
    HIDDEN_STEMS,
    SINSAL_META,
    SINSAL_50_CATALOG,
    SOLAR_TERM_NAMES,
    SOLAR_TERM_TARGETS,
    TWELVE_STAGES,
    twelveStage,
    twelveStagesForPillars,
    calendarPillars,
    flowForDate,
    solarTermMs,
    solarTermInfo,
    apparentSolarLongitude,
    foundationalExtras,
    nayinForPillar,
    voidBranchesForPillar,
    chartRelations,
    relationsWithTransit,
    equationOfTimeMinutes,
    trueSolarCorrectionMinutes,
    trueSolarPreview,
    boundaryDiagnostics,
    lunarToSolar,
    lunarLeapMonth,
    lunarMonthDays,
    specialStars,
    calculate,
    validateBirthInput,
    unknownTimeRange,
    normalizeEl,
    tenGod,
    pillarName,
  };
});


/* GUIIN SAJU 2.5 evidence metadata
 * Interpretation order: natal chart -> daewoon -> sewoon -> wolwoon -> ilwoon.
 * Do not infer deterministic events from a single daily/monthly indicator.
 * School-dependent rules remain labelled as such in the UI/catalog.
 */
(typeof window!=="undefined"?window:globalThis).GUIIN_SAJU_EVIDENCE = Object.freeze({
  version: "4.0.0-master-analysis",
  interpretationOrder: ["원국","대운","세운","월운","일운"],
  caution: "명리 해석은 전통 이론의 적용이며 과학적 예측이나 사건 확률이 아닙니다.",
  privacy: "별도 서버 연동이 없는 기능은 브라우저 안에서 처리합니다."
});


/* v2.6 flow cross-check helpers: presentation/evidence only.
   These helpers do not introduce a new 명리 formula. */
(typeof window!=="undefined"?window:globalThis).GUIIN_FLOW_CROSSCHECK = Object.freeze({
  version: "4.0.0-master-analysis",
  layers: [
    {key:"natal", label:"원국", scale:"기준 구조"},
    {key:"daewoon", label:"대운", scale:"약 10년"},
    {key:"sewoon", label:"세운", scale:"1년"},
    {key:"wolwoon", label:"월운", scale:"1개월"},
    {key:"ilwoon", label:"일운", scale:"1일"}
  ],
  interpretationRules: [
    "한 개의 합·충·형·파·해만으로 사건을 확정하지 않는다.",
    "12운성의 왕쇠를 길흉 점수로 직접 환산하지 않는다.",
    "짧은 운보다 원국과 대운을 먼저 읽고 세운·월운·일운을 겹쳐 본다.",
    "유파가 갈리는 신살과 시간 경계는 계산 기준을 함께 표시한다."
  ]
});

(typeof window!=="undefined"?window:globalThis).GUIIN_LIFE_TIMELINE_PRO=Object.freeze({version:"4.0.0-master-analysis",method:"대운 구간과 같은 연도의 세운을 원국에 교차 비교",caution:"관계 표식을 사건 확률로 환산하지 않음"});

(typeof window!=="undefined"?window:globalThis).GUIIN_ALLINONE_RELEASE=Object.freeze({
 version:"4.0.0-master-analysis",
 precision:"apparent-solar-longitude approximate solver",
 dayBoundaryOptions:["23","00"],
 trueSolar:"optional longitude + equation-of-time application",
 daeun:"exact gap/3 preserved plus compatibility rounded display",
 dailyCalendar:true,
 timelineYears:12,
 compatibilityFlowYears:6,
 starPolicy:"unsupported school-dependent items are not fabricated"
});

function calculationFingerprint(result){
  const i=result.input||{},c=result.calculation||{};
  const raw=[c.engineVersion,i.calendar,i.year,i.month,i.day,i.hour,i.minute,i.dayBoundary,i.trueSolarApply,i.longitude,
    result.pillars?.year?.ko,result.pillars?.month?.ko,result.pillars?.day?.ko,result.pillars?.hour?.ko,result.startAgeExact].join("|");
  let h=2166136261;for(let n=0;n<raw.length;n++){h^=raw.charCodeAt(n);h=Math.imul(h,16777619)}
  return ("00000000"+(h>>>0).toString(16)).slice(-8);
}
const GUIIN_METHOD_DISCLOSURE=Object.freeze({
 version:"4.0.0-master-analysis",
 pillars:"연주=입춘, 월주=절입, 일주 경계 선택형(23시/자정), 시주=일간×시지",
 solarTerms:"태양 겉보기 황경 저정밀 수치해석; 경계 ±20분 외부 정밀 역서 교차확인 권장",
 daeun:"연간 음양+성별로 순역행, 절입까지 실제 시간÷3일=1년; 정확 원값 보존",
 trueSolar:"선택 적용: 경도 보정+균시차; 역사적 DST/표준시 변경 자동 미지원",
 stars:"50종 카탈로그 중 엔진이 공식화한 항목만 계산; 유파차이 항목은 미지원 표시",
 interpretation:"전통 명리 해석 보조용; 사건 확률·의학/법률/투자 결과를 산출하지 않음"
});
if(typeof module!=="undefined"&&module.exports){module.exports.calculationFingerprint=calculationFingerprint;module.exports.GUIIN_METHOD_DISCLOSURE=GUIIN_METHOD_DISCLOSURE}
if(typeof window!=="undefined"){window.GUIIN_METHOD_DISCLOSURE=GUIIN_METHOD_DISCLOSURE}

const GUIIN_FOUNDATION_METHOD=Object.freeze({
 version:"4.0.0-master-analysis",
 void:"60갑자 순(旬) 기준 공망: 갑자순 戌亥, 갑술순 申酉, 갑신순 午未, 갑오순 辰巳, 갑진순 寅卯, 갑인순 子丑",
 nayin:"60갑자 두 간지씩 묶는 30 납음 표",
 roots:"지장간에 일간과 동일 천간이 존재하는지를 통근의 기초 표식으로 표시",
 scope:"격국·용신은 단일 공식으로 확정하지 않고 별도 유파 판단 영역으로 남김"
});
if(typeof module!=="undefined"&&module.exports){module.exports.GUIIN_FOUNDATION_METHOD=GUIIN_FOUNDATION_METHOD}
if(typeof window!=="undefined"){window.GUIIN_FOUNDATION_METHOD=GUIIN_FOUNDATION_METHOD}
