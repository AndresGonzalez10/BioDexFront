import { Component } from '@angular/core';
import { ImageLoginComponent } from '../../core/components/image-login/image-login.component';
import { FormComponent } from '../../core/components/form/form.component';
@Component({
  selector: 'app-login',
  imports: [ImageLoginComponent,FormComponent],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

}
