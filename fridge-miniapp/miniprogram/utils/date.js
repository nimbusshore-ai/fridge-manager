function startOfDay(d){const x=new Date(d);x.setHours(0,0,0,0);return x;}
function daysBetween(a,b){const A=startOfDay(a).getTime();const B=startOfDay(b).getTime();return Math.round((B-A)/(24*3600*1000));}
function fmt(d){const x=new Date(d);const y=x.getFullYear();const m=String(x.getMonth()+1).padStart(2,'0');const dd=String(x.getDate()).padStart(2,'0');return `${y}-${m}-${dd}`;}
function parseYMD(str){
 // very small parser: supports YYYY-MM-DD or M/D or M-D
 if(!str) return null;
 str=String(str).trim();
 let m=str.match(/^(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})$/);
 if(m){return new Date(Number(m[1]),Number(m[2])-1,Number(m[3]));}
 m=str.match(/^(\d{1,2})[-\/.](\d{1,2})$/);
 if(m){const now=new Date();return new Date(now.getFullYear(),Number(m[1])-1,Number(m[2]));}
 return null;
}

function parseExpireFromText(text){
 // MVP: parse common Chinese relative dates + explicit dates
 if(!text) return null;
 const t=String(text).replace(/\s+/g,'');
 const now=new Date();
 const addDays=(n)=>{const d=new Date(now); d.setDate(d.getDate()+n); return d;};
 if(/后天/.test(t)) return addDays(2);
 if(/明天/.test(t)) return addDays(1);
 if(/今天/.test(t)) return addDays(0);
 let m=t.match(/(\d{1,2})月(\d{1,2})[日号]?/);
 if(m){return new Date(now.getFullYear(), Number(m[1])-1, Number(m[2]));}
 m=t.match(/(\d{4})年(\d{1,2})月(\d{1,2})[日号]?/);
 if(m){return new Date(Number(m[1]), Number(m[2])-1, Number(m[3]));}
 // fallback: try YMD / M-D
 return parseYMD(t);
}

module.exports={startOfDay,daysBetween,fmt,parseYMD,parseExpireFromText};
