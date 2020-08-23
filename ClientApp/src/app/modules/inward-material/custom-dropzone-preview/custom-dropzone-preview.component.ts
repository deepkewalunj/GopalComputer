

import { Component, OnInit, Input } from '@angular/core';
import { NgxDropzonePreviewComponent } from 'ngx-dropzone';
import { DomSanitizer } from '@angular/platform-browser';
import { FilePoco } from 'src/app/models/common.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'custom-dropzone-preview',
  templateUrl: './custom-dropzone-preview.component.html',
  styleUrls: ['./custom-dropzone-preview.component.scss'],
  providers: [
    {
      provide: NgxDropzonePreviewComponent,
      useExisting: CustomDropzonePreviewComponent
    }
  ]
})
export class CustomDropzonePreviewComponent extends NgxDropzonePreviewComponent implements OnInit {

  constructor(
    sanitizer: DomSanitizer
  ) {
    super(sanitizer);
  }

  @Input() UploadedFile:FilePoco;

  ngOnInit() {
  }

  open_image(event:Event){

    event.stopPropagation();
    if(this.UploadedFile.documentId){
      this.OpenUploadedImageInNewTab();
    }
  }


OpenUploadedImageInNewTab(){
  let imagepath=`${environment.API_URL}Uploads/${this.UploadedFile.uniqueFilename}`;
 window.open(imagepath,"_blank")
}




}
