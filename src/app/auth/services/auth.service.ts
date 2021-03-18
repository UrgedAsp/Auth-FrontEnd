import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthResponse, Usuario } from '../interfaces/interfaces';
import { catchError, map, tap } from "rxjs/operators";
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private baseUrl: string = environment.baseUrl;
  private _usuario!: Usuario;

  get usuario(){
    return {...this._usuario};
  }

  constructor(private http: HttpClient) { }

  // Servicio para agregar un nuevo usuario a la base de datos
  registro(name: string, email: string, password: string){
    const url = `${this.baseUrl}/auth/new`
    const body = {name, email, password}

    return this.http.post<AuthResponse>(url,body)
    .pipe(
      tap(res => {
        if(res.ok){
          localStorage.setItem('token', res.token!)
          this._usuario = {
            name: res.name!,
            uid: res.uid!,
            email: res.email!
          }
        }
      }),
      map(res => res.ok),
      catchError(err => of(err.error.msg))
    )
  }

  // Servicio para verificar el usuario en la base de datos
  login(email: string, password: string){

    const url = `${this.baseUrl}/auth`
    const body = {email, password}

    return this.http.post<AuthResponse>(url,body)
    .pipe(
      tap( res => {
        if(res.ok){
          localStorage.setItem('token', res.token!)
          this._usuario = {
            name: res.name!,
            email: res.email!,
            uid: res.uid!
          }
        }
      }),
      map( res => res.ok),
      catchError(err => of(err.error.msg))
    )

  }

  // Validacion de los JWT
  validarToken():Observable<boolean>{
    const url = `${this.baseUrl}/auth/renew`
    const headers = new HttpHeaders()
    .set('x-token', localStorage.getItem('token') || '')

    return this.http.get<AuthResponse>(url, { headers })
    .pipe(
      map(res => {
        localStorage.setItem('token', res.token!)
          this._usuario = {
            name: res.name!,
            email: res.email!,
            uid: res.uid!
          }
          return res.ok;
      }),
      catchError(err => of(false))
    )

  }

  // Cierre de sesion del localstorage
  logout(){
    localStorage.removeItem('token')
  }

}
