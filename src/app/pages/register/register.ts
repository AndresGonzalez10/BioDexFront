import { Component } from '@angular/core';
import { ImageRegisterComponent } from '../../core/components/RegisterC/image-register/image-register.component';
import { Form1Component } from '../../core/components/RegisterC/form1/form1.component';

@Component({
  selector: 'app-register',
  imports: [ImageRegisterComponent, Form1Component],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

}
