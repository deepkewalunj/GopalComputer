import { Component, OnInit } from '@angular/core';
import { Bill } from 'src/app/models/Bill.model';
import { environment } from 'src/environments/environment';
import { QzTrayService } from 'src/app/services/qz-tray.service';

@Component({
  selector: 'app-bill-print',
  templateUrl: './bill-print.component.html',
  styleUrls: ['./bill-print.component.scss']
})
export class BillPrintComponent implements OnInit {

  constructor(private printService: QzTrayService) { }
  modelRef: any;
  bill: Bill;
  APIURL = environment.API_URL;
  isBillPrinting: boolean = false;
  ngOnInit() {
  }
  close() {
    this.modelRef.close(false);
  }

  getTotalSum() {
    return this.bill.paidImmediatlyAmount + this.bill.outstandingAmount;
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
  that.isBillPrinting=true;
  that.toDataUrl(environment.API_URL+'PDF/PrintBill?billId='+this.bill.billId,function(base64Image){
    base64Image=base64Image.split(",")[1];
    that.printBill(base64Image,that);

  });

}
  printBill(base64Data,that){

    var printData = [
      {
        type: 'pixel',
        format: 'pdf',
        flavor: 'base64',
        data:base64Data

      }
    ];

    that.printService.printData(this.bill.normalPrinterName, printData).subscribe(data=>{
      that.isBillPrinting=false;
      console.log(data);
    },error=>{
        that.isBillPrinting=false;
      console.log(error);
    });

  }
}
