import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import { HttpClient } from '@angular/common/http';

declare var qz: any;

@Injectable()
export class QzTrayService {
	private config;

	constructor(private http: HttpClient) {}

	async getPrivateKey() {
		return "-----BEGIN CERTIFICATE-----\n" +
    "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\n" +
    "-----END CERTIFICATE-----\n" +
    "--START INTERMEDIATE CERT--\n" +
    "-----BEGIN CERTIFICATE-----\n" +
    "MIIFEjCCA/qgAwIBAgICEAAwDQYJKoZIhvcNAQELBQAwgawxCzAJBgNVBAYTAlVT\n" +
    "MQswCQYDVQQIDAJOWTESMBAGA1UEBwwJQ2FuYXN0b3RhMRswGQYDVQQKDBJRWiBJ\n" +
    "bmR1c3RyaWVzLCBMTEMxGzAZBgNVBAsMElFaIEluZHVzdHJpZXMsIExMQzEZMBcG\n" +
    "A1UEAwwQcXppbmR1c3RyaWVzLmNvbTEnMCUGCSqGSIb3DQEJARYYc3VwcG9ydEBx\n" +
    "emluZHVzdHJpZXMuY29tMB4XDTE1MDMwMjAwNTAxOFoXDTM1MDMwMjAwNTAxOFow\n" +
    "gZgxCzAJBgNVBAYTAlVTMQswCQYDVQQIDAJOWTEbMBkGA1UECgwSUVogSW5kdXN0\n" +
    "cmllcywgTExDMRswGQYDVQQLDBJRWiBJbmR1c3RyaWVzLCBMTEMxGTAXBgNVBAMM\n" +
    "EHF6aW5kdXN0cmllcy5jb20xJzAlBgkqhkiG9w0BCQEWGHN1cHBvcnRAcXppbmR1\n" +
    "c3RyaWVzLmNvbTCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCCAgoCggIBANTDgNLU\n" +
    "iohl/rQoZ2bTMHVEk1mA020LYhgfWjO0+GsLlbg5SvWVFWkv4ZgffuVRXLHrwz1H\n" +
    "YpMyo+Zh8ksJF9ssJWCwQGO5ciM6dmoryyB0VZHGY1blewdMuxieXP7Kr6XD3GRM\n" +
    "GAhEwTxjUzI3ksuRunX4IcnRXKYkg5pjs4nLEhXtIZWDLiXPUsyUAEq1U1qdL1AH\n" +
    "EtdK/L3zLATnhPB6ZiM+HzNG4aAPynSA38fpeeZ4R0tINMpFThwNgGUsxYKsP9kh\n" +
    "0gxGl8YHL6ZzC7BC8FXIB/0Wteng0+XLAVto56Pyxt7BdxtNVuVNNXgkCi9tMqVX\n" +
    "xOk3oIvODDt0UoQUZ/umUuoMuOLekYUpZVk4utCqXXlB4mVfS5/zWB6nVxFX8Io1\n" +
    "9FOiDLTwZVtBmzmeikzb6o1QLp9F2TAvlf8+DIGDOo0DpPQUtOUyLPCh5hBaDGFE\n" +
    "ZhE56qPCBiQIc4T2klWX/80C5NZnd/tJNxjyUyk7bjdDzhzT10CGRAsqxAnsjvMD\n" +
    "2KcMf3oXN4PNgyfpbfq2ipxJ1u777Gpbzyf0xoKwH9FYigmqfRH2N2pEdiYawKrX\n" +
    "6pyXzGM4cvQ5X1Yxf2x/+xdTLdVaLnZgwrdqwFYmDejGAldXlYDl3jbBHVM1v+uY\n" +
    "5ItGTjk+3vLrxmvGy5XFVG+8fF/xaVfo5TW5AgMBAAGjUDBOMB0GA1UdDgQWBBSQ\n" +
    "plC3hNS56l/yBYQTeEXoqXVUXDAfBgNVHSMEGDAWgBQDRcZNwPqOqQvagw9BpW0S\n" +
    "BkOpXjAMBgNVHRMEBTADAQH/MA0GCSqGSIb3DQEBCwUAA4IBAQAJIO8SiNr9jpLQ\n" +
    "eUsFUmbueoxyI5L+P5eV92ceVOJ2tAlBA13vzF1NWlpSlrMmQcVUE/K4D01qtr0k\n" +
    "gDs6LUHvj2XXLpyEogitbBgipkQpwCTJVfC9bWYBwEotC7Y8mVjjEV7uXAT71GKT\n" +
    "x8XlB9maf+BTZGgyoulA5pTYJ++7s/xX9gzSWCa+eXGcjguBtYYXaAjjAqFGRAvu\n" +
    "pz1yrDWcA6H94HeErJKUXBakS0Jm/V33JDuVXY+aZ8EQi2kV82aZbNdXll/R6iGw\n" +
    "2ur4rDErnHsiphBgZB71C5FD4cdfSONTsYxmPmyUb5T+KLUouxZ9B0Wh28ucc1Lp\n" +
    "rbO7BnjW\n" +
    "-----END CERTIFICATE-----\n"

	}

	async getPrivatePem() {
		return `-----BEGIN PRIVATE KEY-----
    MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDqgGJc6rK9bASI
    D7Bs8M5r/5yQbae8OiVdSXv3KG9xVTRIcry4O8+PmP3j9SlMiSqHuOU6VSW3gHZ0
    Tfh4onERdRBtxEvazn0rN47CLjSI/zOkAZoybveoo7u5LABwPL+NIRWmnSdDhq53
    V1IEK3rxmI0MMv7SiuH4dbC2cfH032ufgNCI7AnJaFjkxcn0qe5YwPu7VW+ZoUO1
    IsSvKH9MKmVeKK/OdkKLIGke6+G8BDPtAtxVJoAJ8vOPxxBEI4hS5Jc2PaRfmVkR
    uy0mfdaJKZD07hvvn+6+LRXY4Ynh1O18GTyZT/fXs4dqcapHpVTQy/K0SP53MIhD
    bt1qGlldAgMBAAECggEBAIBDNInp/VXKLThWjIMpu14q83Gz6Jj1nNZHiTyIq1vr
    5KrzxvFmFYNPhR8YSzyHkfGmWgrr47NY2nGG7C7fesS3qQLA6VSGuMPYoYboSufb
    3l0IW1TWiTN+SwFfZeX99C+3NuZo8r7mfarc4glR1u8qJ4vSoLp8KFkD1mIUNOlf
    9qxmKNphOqJJ1W+aPVyQbFziu8id3O3M6onATaM9SDgbbEPwh7MP9No1bXuoCs7C
    +A+Dw7TUurkKDbnwRbu2cebfD93in64ofjfsETLo3bxNDtgeXKnDyubb2RqieUcJ
    uK88gYAisit0qXRS7ICo1W7cv0xLn918n5ro98GtNoECgYEA95Erkyk2HQdrEa8y
    wrOIj0Qdt4ZLyE7xeP5m1/UhNYk87Y9ssfHDj7UaluY+Hqj+Ek/vI+fUaK9p7uEb
    1UEuhrb9vw/S6rYEZ5m00U4vZD6NogY4F0AIMAlFtWJPeyUBtGbYypHJKsEzgZl4
    BqdslzYPAnsB9Xh67zC3+AzA3VECgYEA8n1HpblWgUd6W/PjPJF9aBHb5SCzZlVm
    eR9pGZ9XNQprDwBHCtk6ymqnKvS421moFYMcd6Xdf+jDVOXCeMl6zQl2VE7oF9Oo
    xAt/hCVADvxGEW689FSiH8km92fnkowu6NxslwTEuz83RXEEX9Nund57iK0uGGYT
    BHG1by4JSE0CgYAr5gUJCkS7LwaQUzW4CqfLZ7OxSFIFyeHNp6bK4n+qA5TXNxh6
    ETmxMNbvLRKU0ziCPMRV5JTonzo0jpwl23IJl0c1avPmhLIRQNMsTiXfK6xnr5yg
    ms0Y33wJ5s3bMzuzJo2IlgNK3olokLMU0vlRcteEhBVb1qpN4aCtjm1gkQKBgDqf
    lwa1u/gdM7OvTqyB7/OM/cBzG2wOEWwO7/XF0+t6zU8fHg29Xr0485kq+NXu4vfw
    bp1ueBJIT5DiyxUwgIO5WeYf/XRlM1PSA84Kw2XcD4R/ZSccnuVYWBdQA2gmg+DA
    CXCpMnaiXdZn8ErKbt+zveHZHF/Bra9RXi+2zX+xAoGAY7kx7FnE3o9PtbmldB+x
    J+DrEPHI8TUtlCmLurMgSNttel0e2ky7Rc0gCguYT6yT1R0bqRYy1epHEup/Wr0F
    VnJtUf5UWQHtVhWKTrEfW4G3JuwkAURkTHYrsGnjrBZQCzVnRmFv/CA4tplfo5Jk
    eZeUeeDzMys5OVxIaka+p+M=
    -----END PRIVATE KEY-----
    `
	}

	initQZ () {
		let privateKey = '';

		this.getPrivateKey().then((data) => privateKey = data);

		qz.security.setCertificatePromise(function(resolve, reject) {
			console.log('Set Certificate');
			resolve(privateKey);
    });


    qz.security.setSignaturePromise(function(toSign) {
      return function(resolve, reject) {

          resolve();
      };
  });

		qz.websocket.connect();
	}

	errorHandler(error: any): Observable<any> {
		return Observable.throw(error);
	}

	getPrinters(): Observable<string[]> {
		return Observable
		.fromPromise( qz.printers.find())
		.map((printers: string[]) => printers);
	}

	getPrinter(printerName: string): Observable<string> {
		return Observable
		.fromPromise( qz.printers.find(printerName))
		.map((printer: string) => printer);
	}

	printHTML(printerName, htmlData) {
		qz.printers.find(printerName).then(function(found) {
			console.log("Printer: " + found);
			var config = qz.configs.create(printerName);

			qz.print(config, htmlData).then(function() {
				console.log("Sent data to printer");
      }).catch((err) =>

      console.log(err));
		}).catch((err) => {

      console.log(err) });
	}

	// Print data to chosen printer
	printData(printer: string, data: any): Observable<any> {


		const config = qz.configs.create(printer);

		return Observable.fromPromise(qz.print(config, data))
		.map((anything: any) => anything);
	}

	// Disconnect QZ Tray from the browser
	removePrinter(): void {
		qz.websocket.disconnect();
	}
}
