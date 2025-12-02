import { Component, OnInit } from '@angular/core';
import { NavBarComponent } from '../../core/components/nav-bar/nav-bar.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-collection-main',
  standalone: true,
  imports: [NavBarComponent],
  templateUrl: './collection-main.html',
  styleUrl: './collection-main.css'
})
export class CollectionMain implements OnInit {
  userName: string = '';

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    const currentUser = this.authService.currentUser();
    if (currentUser && currentUser.name) {
      this.userName = currentUser.name;
    }
  }
}
