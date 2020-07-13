import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Inward, InwardListModel } from 'src/app/models/inward.model';
import { environment } from 'src/environments/environment';
import { QzTrayService } from 'src/app/services/qz-tray.service';


@Component({
  selector: 'app-inward-print',
  templateUrl: './inward-print.component.html',
  styleUrls: ['./inward-print.component.scss']
})
export class InwardPrintComponent implements OnInit {

  constructor(private printService: QzTrayService) { }
  modelRef: any;
  inward: Inward;
  APIURL = environment.API_URL;
  isInwardPrinting:boolean=false;
  ngOnInit() {
  }

  close() {
    this.modelRef.close(false);
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
  that.isInwardPrinting=true;
  that.toDataUrl(environment.API_URL+'PDF/PrintInward?inwardId='+this.inward.inwardId,function(base64Image){
    base64Image=base64Image.split(",")[1];
    that.printInward(base64Image,that);

  });

}
  printInward(base64Data,that){

    var printData = [
      {
        type: 'pixel',
        format: 'pdf',
        flavor: 'base64',
        data:base64Data

      }
    ];

    that.printService.printData(this.inward.normalPrinterName, printData).subscribe(data=>{
      that.isInwardPrinting=false;
      console.log(data);
    },error=>{
      that.isInwardPrinting=false;
      console.log(error);
    });

  }
}
