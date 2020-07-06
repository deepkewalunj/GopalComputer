export class TypeAheadRequestModel{

  searchType:number;
  searchText:string;
}

export class TypeAheadResponseModel{
  searchId:number;
  searchValue:string;
  splitValue: string;
  advanceAmount: number;
  clientRefId: number;
}
