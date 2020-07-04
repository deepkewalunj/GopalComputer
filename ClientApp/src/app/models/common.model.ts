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

static getInwardOutwardBillStatuses():Array<SelectList>{
  let statuses:Array<SelectList> =[{id:'1',name:'Paid'},
  {id:'2',name:'Unpaid'},
 ];
return statuses;
}


static getInwardOutwardPrintStatuses():Array<SelectList>{
  let statuses:Array<SelectList> =[{id:'1',name:'Printed'},
  {id:'2',name:'Not Printed'},
 ];
return statuses;
}


static getInwardRepeatJobs():Array<SelectList>{
  let statuses:Array<SelectList> =[{id:'1',name:'Yes'},
  {id:'2',name:'No'},
 ];
return statuses;
}

static getInwardSmsStatuses():Array<SelectList>{
  let statuses:Array<SelectList> =[{id:'1',name:'Yes'},
  {id:'2',name:'No'},
 ];
return statuses;
}

}
export class SelectList{
  name:string;
  id:string;

}

export class TypeAheadSelect{
  name:string;
  id:number;

}

export class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

export class FilePoco{

  originalFilename:string;
  uniqueFilename:string;
  documentId:string;
  file:any;
}

export class Guid {
  static newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

