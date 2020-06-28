export  class  CommonModel{



  static getTitles():Array<SelectList>{
  let titles:Array<SelectList> = [
    {id: '1', name: "Mr."},
    {id: '2', name: "Mrs."},
    {id: '3', name: "Miss."}
];
return titles;
}

static getRoles():Array<SelectList>{
  let roles:Array<SelectList> =[{id:'1',name:'Super Admin'},
  {id:'2',name:'Staff'},
  {id:'3',name:'Other'}];
return roles;
}

}
export class SelectList{
  name:string;
  id:string;

}
