const { fmt } = require('./date');

const KEY='fridge_items_v0';

function load(){
 try{ return wx.getStorageSync(KEY) || []; }catch(e){ return []; }
}
function save(items){
 wx.setStorageSync(KEY, items);
}
function uuid(){
 return 'i_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2,8);
}

function addItem({title='',category='其他',location='冷藏',expireDate}){
 const items=load();
 items.unshift({
 id: uuid(),
 title,category,location,
 expireDate: fmt(expireDate),
 status:'active',
 createdAt: Date.now(),
 updatedAt: Date.now()
 });
 save(items);
 return items;
}
function updateItem(id, patch){
 const items=load();
 const idx=items.findIndex(x=>x.id===id);
 if(idx>=0){ items[idx] = { ...items[idx], ...patch, updatedAt: Date.now()}; }
 save(items);
 return items;
}

module.exports={load,save,addItem,updateItem};
