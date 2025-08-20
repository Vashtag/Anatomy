window.Progress = {
  get(){
    try{ return JSON.parse(localStorage.getItem('kin100l:progress')||'{}'); }catch(e){ return {}; }
  },
  set(data){
    localStorage.setItem('kin100l:progress', JSON.stringify(data));
  },
  update(labId, fragment){
    const all = this.get();
    all[labId] = Object.assign({}, all[labId]||{}, fragment);
    this.set(all);
  }
};