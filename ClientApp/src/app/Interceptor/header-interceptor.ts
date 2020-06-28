import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class HeaderInterceptor implements HttpInterceptor {
constructor( private SpinnerService: NgxSpinnerService){}
count = 0;

  intercept(request: HttpRequest<any>, newRequest: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header to request
      this.SpinnerService.show();
      this.count++;
    //Get Token data from local storage
    let tokenInfo = JSON.parse(localStorage.getItem('TokenInfo'));

    if (tokenInfo && tokenInfo.token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${tokenInfo.token}`,
          'Content-Type': 'application/json'
        }
      });
    }

    return newRequest.handle(request).do(
      (response) => {
        if (response instanceof HttpResponse) {
          this.count--;
          if ( this.count == 0 )
          {
              this.SpinnerService.hide ();

          }
        }
      },
      (error) => {
        this.count--;
        if ( this.count == 0 )
        {
          this.SpinnerService.hide ();
        }
      });




  }
}
