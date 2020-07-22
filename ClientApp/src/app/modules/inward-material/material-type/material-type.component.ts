import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import {  NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { first } from 'rxjs/operators';
import {SearchModelNoMaterialTypeCompanyNameService} from '../../../services/search-model-no-material-type-company-name.service';
import { DataTableDirective } from 'angular-datatables';
import { AddUpdateModelNoMaterialTypeComponent } from '../add-update-model-no-material-type/add-update-model-no-material-type.component';
import { CommonModel } from 'src/app/models/common.model';
import { tblSearchModelNoMaterialTypeCompanyName } from 'src/app/models/tblSearchModelNoMaterialTypeCompanyName';

@Component({
  selector: 'app-material-type',
  templateUrl: './material-type.component.html',
  styleUrls: ['./material-type.component.scss']
})
export class MaterialTypeComponent implements OnInit {
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  searchModelNoMaterialTypeCompanyName = new tblSearchModelNoMaterialTypeCompanyName();
  title = 'angulardatatables';
  dtOptions: DataTables.Settings = {};
  searchFilter: boolean;
  error = '';
  private _success = new Subject<string>();
  staticAlertClosed = false;
  successMessage: string;
  searchModelNoMaterialTypeCompanyNameServiceList = [];
  dtTrigger: Subject<any> = new Subject();

  constructor( private modalService: NgbModal, private searchModelNoMaterialTypeCompanyNameService: SearchModelNoMaterialTypeCompanyNameService
    , config: NgbModalConfig) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  /*on click modal will be open*/

  addSearchModelNoMaterialTypePopup(searchId) {
    if (searchId > 0)
    {
      this.GetSearchModelNoMaterialTypeCompanyNameById(searchId);
    }
    else {
      this.searchModelNoMaterialTypeCompanyName = new tblSearchModelNoMaterialTypeCompanyName();
      this.openAddEditSearchModelNoMaterialTypeCompanyNamePopup(this.searchModelNoMaterialTypeCompanyName);
    }
  }

  openAddEditSearchModelNoMaterialTypeCompanyNamePopup(searchModelNoMaterialTypeCompanyName){
    const modalRef = this.modalService.open(AddUpdateModelNoMaterialTypeComponent, { size: 'lg' });
    modalRef.componentInstance.searchModelNoMaterialTypeCompanyName=searchModelNoMaterialTypeCompanyName;
    modalRef.componentInstance.modelRef=modalRef;
    modalRef.result.then((result) => {
      if(result==true)
      {
        this._success.next("Material type saved Successfully.")
        this.GetSearchModelNoMaterialTypeCompanyNames();
      }

    }, (reason) => {

    });
  }

   /*succes message code here*/
   ngOnInit(): void {
    const that=this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      columns: [{ data: 'modelNo',searchable:true,orderable:true  }, { data: 'materialType',searchable:true,orderable:true  },
      { data: 'companyName',searchable:true,orderable:true  },
      {searchable:false,orderable:false}]

    };
    this.GetSearchModelNoMaterialTypeCompanyNames(true);
    setTimeout(() => this.staticAlertClosed = true, 20000);

    this._success.subscribe((message) => this.successMessage = message);
    this._success.pipe(
      debounceTime(5000)
    ).subscribe(() => this.successMessage = null);
  }



  getuserRoleName(roleId){
    if(roleId)
    {
      let lstRoles=CommonModel.getRoles();
      let roleName=lstRoles.find(role=>role.id==roleId).name;
      if(roleName)
      {
        return roleName;
      }
      else
      {
        return "";
      }
    }

  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }



  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }
  GetSearchModelNoMaterialTypeCompanyNames(first=false) {
    const that = this;
    try {
      this.searchModelNoMaterialTypeCompanyNameService.GetSearchModelNoMaterialTypeCompanyNames()
        .subscribe(
          data => {
            that.searchModelNoMaterialTypeCompanyNameServiceList = data.materialTypeDetails;
            if(first)
            {
              that.dtTrigger.next();
            }
            else
            {
              that.rerender();
            }
          },
          error => {
            that.error = error;
          });
    }
    catch (e) {

    }
  }

  GetSearchModelNoMaterialTypeCompanyNameById(searchId) {

    this.searchModelNoMaterialTypeCompanyNameService.GetSearchModelNoMaterialTypeCompanyNameById(searchId)
      .pipe(first())
      .subscribe(
        data => {
          this.searchModelNoMaterialTypeCompanyName.companyName = data.materialTypeDetail.companyName;
          this.searchModelNoMaterialTypeCompanyName.modelNo = data.materialTypeDetail.modelNo;
          this.searchModelNoMaterialTypeCompanyName.materialType = data.materialTypeDetail.materialType;
          this.searchModelNoMaterialTypeCompanyName.searchId = data.materialTypeDetail.searchId;
          this.openAddEditSearchModelNoMaterialTypeCompanyNamePopup(this.searchModelNoMaterialTypeCompanyName);
        },
        error => {
          this.error = error;
        });
  }

  openDelete(content,searchId:number) {
    const that=this;
    this.modalService.open(content).result.then((result) => {
      if(result==true)
      {
        that.deleteMaterialType(searchId,that);
      }
    }, (reason) => {

    });
  }

  deleteMaterialType(searchId:number,that){
    that.searchModelNoMaterialTypeCompanyNameService.DeleteSearchModelNoMaterialTypeCompanyName(searchId).subscribe((data)=>{
        that.GetSearchModelNoMaterialTypeCompanyNames();
        that._success.next("Material type deleted successfully.");
      },(error)=>{
      })
  }


}

