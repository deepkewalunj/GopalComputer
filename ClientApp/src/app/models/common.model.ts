export  class  CommonModel{



  static getTitles():Array<SelectList>{
  let titles:Array<SelectList> = [
    {id: '1', name: "Mr."},
    {id: '2', name: "Mrs."},
    {id: '3', name: "Miss."}
];
return titles;
}

}
export class SelectList{
  name:string;
  id:string;

}
