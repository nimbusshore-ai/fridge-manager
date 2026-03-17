const { load, updateItem } = require('../../utils/store');
const { daysBetween } = require('../../utils/date');

Page({
 data: {
 groups: { overdue: [], d3: [] }
 },
 onShow(){
 this.refresh();
 },
 refresh(){
 const items = load().filter(x=>x.status==='active');
 const now = new Date();
 const overdue=[]; const d3=[];
 for(const it of items){
 const [y,m,d]=it.expireDate.split('-').map(Number);
 const ex=new Date(y,m-1,d);
 const diff=daysBetween(now, ex); // ex - now in days
 if(diff<0) overdue.push(it);
 else if(diff<=3) d3.push(it);
 }
 const sortFn=(a,b)=> a.expireDate.localeCompare(b.expireDate);
 overdue.sort(sortFn); d3.sort(sortFn);
 this.setData({ groups:{ overdue, d3 }});
 },
 iconFor(item){
 const c=item.category;
 const map={
 '蔬菜':'🥬','水果':'🍎','肉/蛋/奶':'🥚','熟食/剩菜':'🍱','饮料':'🥤','其他':'🍽️'
 };
 return map[c] || '🍽️';
 },
 itemTitle(item){
 return item.title;
 },
 locationBadge(item){
 return item.location==='冷冻' ? '❄️冷冻' : '🧊冷藏';
 },
 onConsume(e){
 const id=e.currentTarget.dataset.id;
 updateItem(id,{status:'consumed'});
 this.refresh();
 },
 onDiscard(e){
 const id=e.currentTarget.dataset.id;
 updateItem(id,{status:'discarded'});
 this.refresh();
 }
});
