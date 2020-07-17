import { Component, OnInit } from '@angular/core';
import { Lumpsum } from 'src/app/models/Lumpsum.model';
import { environment } from 'src/environments/environment';
import { QzTrayService } from 'src/app/services/qz-tray.service';

@Component({
  selector: 'app-lumpsum-print',
  templateUrl: './lumpsum-print.component.html',
  styleUrls: ['./lumpsum-print.component.scss']
})
export class LumpsumPrintComponent implements OnInit {

  constructor(private printService: QzTrayService) { }
  modelRef: any;
  lumpsum: Lumpsum;
  APIURL = environment.API_URL;
  isLumpsumPrinting: boolean = false;
  ngOnInit() {
  }
  close() {
    this.modelRef.close(false);
  }

  toDataUrl(url, callback) {

    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }


  getBase64EncodedImage() {
    const that = this;
    that.isLumpsumPrinting = true;
    that.toDataUrl(environment.API_URL + 'PDF/PrintLumpsum?lumpsumId=' + this.lumpsum.lumpsumId, function (base64Image) {
      base64Image = base64Image.split(",")[1];
      that.printLumpsum(base64Image, that);

    });

  }
  printLumpsum(base64Data, that) {

    var printData = [
      {
        type: 'pixel',
        format: 'pdf',
        flavor: 'base64',
        data: base64Data

      }
    ];

    that.printService.printData(this.lumpsum.normalPrinterName, printData).subscribe(data => {
      that.isLumpsumPrinting = false;
      console.log(data);
    }, error => {
        that.isLumpsumPrinting = false;
      console.log(error);
    });

  }
}


