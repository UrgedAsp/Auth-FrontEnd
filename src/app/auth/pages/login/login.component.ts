import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from "sweetalert2";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  
  constructor(private fb: FormBuilder,
              private router: Router,
              private authService: AuthService) { }
  
  miFormulario: FormGroup = this.fb.group({
    email: ['test1@test.com', [Validators.required, Validators.email]],
    password: ['123456',[Validators.required, Validators.minLength(6)]]
  })

  ngOnInit(): void {
  }

  login(){
    const {email, password} = this.miFormulario.value
    this.authService.login(email, password)
    .subscribe(res =>{
      if (res === true) {
        Swal.fire({
          imageUrl: 'https://i.pinimg.com/originals/89/1d/79/891d7919c4878ac354883fecacaeaba5.gif',
          imageHeight: 200,
          imageWidth: 200,
          html: 'Logueado con exito',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        })        
        this.router.navigate(['./dashboard'])
      }else{
        Swal.fire({
          imageUrl: 'https://gluc.mx/u/fotografias/m/2020/12/14/f608x342-42146_71869_0.jpg',
          imageHeight: 200,
          imageWidth: 200,
          html: res
        })          
      }
    })
  }
}
