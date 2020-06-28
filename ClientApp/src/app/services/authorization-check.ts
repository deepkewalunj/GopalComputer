import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SharedService } from '../shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationCheck implements CanActivate {

 constructor(private router: Router,private sharedService:SharedService) { }

 canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
 //If token data exist, user may login to application
 if (this.sharedService.isLoggedIn()) {
  let authmodules=this.sharedService.getPermissions();
  let permission=route.data.permission;
   if(permission && permission.length>0)
   {
     let isModuleValid=false;
     debugger;
     for(let i=0;i<permission.length;i++)
     {
      let validModule=authmodules.find(x=>x.ModuleName==permission[i])
       if(validModule)
       {
        isModuleValid=true;
        break;
       }
     }
     if(isModuleValid)
     {

      return true;
     }
   }
   else
   {
    return true;
   }
 }

 // otherwise redirect to login page with the return url
 this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
 return false;
 }
}
