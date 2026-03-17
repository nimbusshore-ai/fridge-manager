const { load, updateItem } = require('../../utils/store');

Page({
 data:{consumed:[],discarded:[]},
 onShow(){
 const items=load();
 const consumed=items.filter(x=>x.status==='consumed');
 const discarded=items.filter(x=>x.status==='discarded');
 this.setData({consumed,discarded});
 },
 itemTitle(item){
 return item.title;
 },
 onUndo(e){
 const id=e.currentTarget.dataset.id;
 updateItem(id,{status:'active'});
 this.onShow();
 }
});
