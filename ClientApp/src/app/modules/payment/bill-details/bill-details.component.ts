import { Component, OnInit } from '@angular/core';
import { PaymentListModel, GetPaymentDetailsBySearchModel } from 'src/app/models/Lumpsum.model';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { LumpsumService } from 'src/app/services/lumpsum.service';

@Component({
  selector: 'app-bill-details',
  templateUrl: './bill-details.component.html',
  styleUrls: ['./bill-details.component.scss']
})
export class BillDetailsComponent implements OnInit {

  constructor(private ngbCalendar:NgbCalendar,private lumpsumService:LumpsumService) { }
  paymentListModel:PaymentListModel;
  paymentSearchModel:GetPaymentDetailsBySearchModel;
  ngOnInit() {
    this.paymentSearchModel=new GetPaymentDetailsBySearchModel();
    this.paymentSearchModel.startDate=this.ngbCalendar.getToday();
    this.paymentSearchModel.endDate=this.ngbCalendar.getToday();
    this.GetPaymentModel();
  }

  GetPaymentModel(){
    this.lumpsumService.getPaymentDetailsBySearch(this.paymentSearchModel).subscribe(data=>{
        this.paymentListModel=data;
    },error=>{
       console.log(error);
    })
  }

}
