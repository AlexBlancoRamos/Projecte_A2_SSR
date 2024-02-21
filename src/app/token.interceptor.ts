import {HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const userToken = localStorage.getItem('jwt');
    let modifiedReq;
    if (userToken !== null && userToken !== undefined) {
      modifiedReq = req.clone({
        setHeaders: {
          'token': userToken
        },
        // headers: req.headers.set('token', `${userToken}`),
      });
      return next.handle(modifiedReq);

    } else {

      return next.handle(req);
    }
  }
}
