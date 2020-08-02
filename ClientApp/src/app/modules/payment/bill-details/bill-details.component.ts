import { Component, OnInit } from '@angular/core';
import { PaymentListModel, GetPaymentDetailsBySearchModel } from 'src/app/models/Lumpsum.model';
import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { LumpsumService } from 'src/app/services/lumpsum.service';
import { environment } from 'src/environments/environment';
import { QzTrayService } from 'src/app/services/qz-tray.service';

@Component({
  selector: 'app-bill-details',
  templateUrl: './bill-details.component.html',
  styleUrls: ['./bill-details.component.scss']
})
export class BillDetailsComponent implements OnInit {

  constructor(private ngbCalendar:NgbCalendar,private lumpsumService:LumpsumService,
    private printService: QzTrayService) { }
  paymentListModel:PaymentListModel;
  paymentSearchModel:GetPaymentDetailsBySearchModel;
  searchFilter: boolean;
  maxDate:NgbDate
  isPaymentDetailPrinting:boolean;
  ngOnInit() {
    this.paymentSearchModel=new GetPaymentDetailsBySearchModel();
    this.paymentSearchModel.startDate=this.ngbCalendar.getToday();
    this.paymentSearchModel.endDate=this.ngbCalendar.getToday();
    this.maxDate=this.ngbCalendar.getToday();
    this.GetPaymentModel();
  }

  GetPaymentModel(){
    this.lumpsumService.getPaymentDetailsBySearch(this.paymentSearchModel).subscribe(data=>{
        this.paymentListModel=data;

    },error=>{
       console.log(error);
    })
  }


  toggleSearch() {
    this.searchFilter = !this.searchFilter;
  }

  clearFilter(){
    this.paymentSearchModel.startDate=null;
    this.paymentSearchModel.endDate=null;
  }


  toDataUrl(url, callback) {

    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        var reader = new FileReader();
        reader.onloadend = function() {
            callback(reader.result);
        }
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
}


getBase64EncodedImage(){
  const that=this;
  let startDate="";
  if(this.paymentSearchModel.startDate!=null){
    let startDateNgbModel=this.paymentSearchModel.startDate;
    startDate=`startDate=${startDateNgbModel.year}-${startDateNgbModel.month}-${startDateNgbModel.day}`;
  }
  let endDate="";
  if(this.paymentSearchModel.endDate!=null){
    let endDateNgbModel=this.paymentSearchModel.endDate;
    endDate=`endDate=${endDateNgbModel.year}-${endDateNgbModel.month}-${endDateNgbModel.day}`;
  }
  that.isPaymentDetailPrinting=true;
  that.toDataUrl(environment.API_URL+`PDF/PrintPaymentDetail?${startDate!==""?startDate:''}${startDate==""?endDate:'&'+endDate}`,function(base64Image){
    base64Image=base64Image.split(",")[1];
    that.printInward(base64Image,that);

  });

}
  printInward(base64Data,that){
    console.log(base64Data)
    var printData = [
      {
        type: 'pixel',
        format: 'pdf',
        flavor: 'base64',
        data:base64Data

      }
    ];

    that.printService.printData(that.paymentListModel.normalPrinterName, printData).subscribe(data=>{
      that.isPaymentDetailPrinting=false;

    },error=>{
      that.isInwardPrinting=false;

    });

  }
}
