import { Component } from '@angular/core'
import { NavBarComponent } from '../../core/components/nav-bar/nav-bar.component'
import { AuthService } from '../../core/services/auth.service'



@Component({
  selector: 'app-mainview',
  imports: [NavBarComponent],
  templateUrl: './mainview.html',
  styleUrl: './mainview.css'
})
export class Mainview {
  userName: string = '';
   constructor(private authService: AuthService) { }
   ngOnInit(): void {
    const currentUser = this.authService.currentUser();
    if (currentUser && currentUser.name) {
      this.userName = currentUser.name;
    }
  }

}
