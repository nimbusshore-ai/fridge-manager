const { addItem } = require('../../utils/store');
const { parseYMD, parseExpireFromText } = require('../../utils/date');

const plugin = requirePlugin('WechatSI');
const manager = plugin.getRecordRecognitionManager();

Page({
 data:{
 title:'',
 asrText:'',
 categories:['蔬菜','水果','肉/蛋/奶','熟食/剩菜','饮料','其他'],
 catIndex:5,
 locations:['冷藏','冷冻'],
 locIndex:0,
 expireDate:''
 },
 onLoad(){
 manager.onRecognize = (res)=>{
 // partial
 if(res && res.result){
 this.setData({ asrText: res.result });
 }
 };
 manager.onStop = (res)=>{
 const text = (res && res.result) ? res.result : '';
 if(text) this.applyAsrText(text);
 };
 manager.onError = ()=>{
 wx.showToast({title:'语音识别失败，请重试', icon:'none'});
 };
 },

 applyAsrText(text){
 const t=String(text).trim();
 this.setData({ asrText: t });
 // location
 if(/冷冻/.test(t)) this.setData({ locIndex:1 });
 if(/冷藏/.test(t)) this.setData({ locIndex:0 });
 // expire date
 const ex = parseExpireFromText(t);
 if(ex){
 const y=ex.getFullYear();
 const m=String(ex.getMonth()+1).padStart(2,'0');
 const d=String(ex.getDate()).padStart(2,'0');
 this.setData({ expireDate: `${y}-${m}-${d}` });
 }
 // title heuristic: take first token before location/日期词
 const cleaned=t
 .replace(/冷藏|冷冻/g,'')
 .replace(/(\d{4}年)?\d{1,2}月\d{1,2}[日号]?/g,'')
 .replace(/今天|明天|后天/g,'')
 .replace(/到期|过期|截止/g,'')
 .trim();
 if(cleaned){
 // keep short
 this.setData({ title: cleaned.slice(0,20) });
 }
 },

 onHoldToTalkStart(){
 this.setData({ asrText: '' });
 manager.start({ lang: 'zh_CN' });
 },
 onHoldToTalkEnd(){
 manager.stop();
 },

 onTitle(e){ this.setData({title: e.detail.value}); },
 onCatChange(e){ this.setData({catIndex: Number(e.detail.value)}); },
 onLocChange(e){ this.setData({locIndex: Number(e.detail.value)}); },
 onDateChange(e){ this.setData({expireDate: e.detail.value}); },
 onSubmit(){
 if(!this.data.title || !this.data.title.trim()){
 wx.showToast({title:'请填写名称（比如：牛奶）', icon:'none'});
 return;
 }
 if(!this.data.expireDate){
 wx.showToast({title:'请先选择到期日', icon:'none'});
 return;
 }
 const ex=parseYMD(this.data.expireDate);
 addItem({
 title: this.data.title.trim(),
 category: this.data.categories[this.data.catIndex],
 location: this.data.locations[this.data.locIndex],
 expireDate: ex
 });
 wx.navigateBack();
 }
});
