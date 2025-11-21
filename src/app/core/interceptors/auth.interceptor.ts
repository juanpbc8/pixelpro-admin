import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    // TODO: Implement JWT token injection when authentication is added
    // const token = localStorage.getItem('auth_token');
    // if (token) {
    //     req = req.clone({
    //         setHeaders: {
    //             Authorization: `Bearer ${token}`
    //         }
    //     });
    // }

    return next(req);
};
