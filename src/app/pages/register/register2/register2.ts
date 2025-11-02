import { Component } from '@angular/core';
import { ImageRegisterComponent } from '../../../core/components/RegisterC/image-register/image-register.component';
import { Form2Component } from '../../../core/components/RegisterC/form2/form2.component';

@Component({
  selector: 'app-register2',
  imports: [ImageRegisterComponent,Form2Component],
  templateUrl: './register2.html',
  styleUrl: './register2.css'
})
export class Register2 {

}
