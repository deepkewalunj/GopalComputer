import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import {  NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { first } from 'rxjs/operators';
import { MaterialAccessoryService } from '../../../services/material-accessory.service';
import { UserPermission } from '../../../models/user-permission';
import { DataTableDirective } from 'angular-datatables';
import { AddEditAccessoryComponent } from '../add-edit-accessory/add-edit-accessory.component';
import { CommonModel } from 'src/app/models/common.model';
import { AccessoryInputModel } from '../../../models/AccessoryInputModel';

@Component({
  selector: 'app-inward-accessories',
  templateUrl: './inward-accessories.component.html',
  styleUrls: ['./inward-accessories.component.scss']
})
export class InwardAccessoriesComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  

  title = 'angulardatatables';
  dtOptions: DataTables.Settings = {};
  searchFilter: boolean;
  error = '';
  private _success = new Subject<string>();
  staticAlertClosed = false;
  successMessage: string;
  materialAccessoriesList = [];
  dtTrigger: Subject<any> = new Subject();

  accessoryInputModel = new AccessoryInputModel();

  constructor( private modalService: NgbModal, private materialAccessoryService: MaterialAccessoryService
    , config: NgbModalConfig) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    const that=this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      columns: [{ data: 'materialType',searchable:true,orderable:true  }, { data: 'accessoryName',searchable:true,orderable:true  },
      {searchable:false,orderable:false}]

    };
    this.getMaterialAccessories(true);
    setTimeout(() => this.staticAlertClosed = true, 20000);

    this._success.subscribe((message) => this.successMessage = message);
    this._success.pipe(
      debounceTime(5000)
    ).subscribe(() => this.successMessage = null);

  }

  getMaterialAccessories(first=false){
    const that = this;
    try {
      this.materialAccessoryService.getAccessories()
        .subscribe(
          data => {
            that.materialAccessoriesList = data.materialAccessoriesList;
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

  getAccessoryById(accessoryId){
     this.materialAccessoryService.getAccessoryById(accessoryId)
     .subscribe(data=>{
       this.accessoryInputModel.accessoryName = data.accessory.accessoryName;
       this.accessoryInputModel.materialType = data.accessory.materialType;
       this.accessoryInputModel.materialAccessoryId = data.accessory.materialAccessoryId;
       this.openAddEditAccessoryPopup(this.accessoryInputModel);
     },
     error=>{
       console.log(error);
     })
  }

  openDelete(content, accessoryId:number){
     const that = this;
     this.modalService.open(content).result.then((result)=>{
       if(result == true){
         that.deleteAccessory(accessoryId,that);
       }
     },
     (error)=>{

     })
  }

  deleteAccessory(accessoryId:number, that){
    that.materialAccessoryService.deleteAccessory(accessoryId).subscribe((data)=>{
      that.getMaterialAccessories();
      that._success.next("Accessory deleted successfully.");
    },(error)=>{
    })
  }

  openAccessoryPopup(accessoryId) {
    if (accessoryId > 0)
    {
      this.getAccessoryById(accessoryId);
    }
    else {
      this.accessoryInputModel = new AccessoryInputModel();
      this.openAddEditAccessoryPopup(this.accessoryInputModel);
    }


  }

  openAddEditAccessoryPopup(accessoryInputModel){
    const modalRef = this.modalService.open(AddEditAccessoryComponent, { size: 'lg' });
    modalRef.componentInstance.accessoryInputModel=accessoryInputModel;
    modalRef.componentInstance.modelRef=modalRef;
    modalRef.result.then((result) => {
      if(result==true)
      {
        this._success.next("Accessory Saved Successfully.")
        this.getMaterialAccessories();
      }

    }, (reason) => {

    });
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

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }  
}
