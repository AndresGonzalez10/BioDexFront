import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-specimen-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './specimen-card.component.html',
  styleUrls: ['./specimen-card.component.css']
})
export class SpecimenCardComponent {
  @Input() specimen: any;
  @Input() imageUrlBase: string = '';

  constructor(private router: Router) { }

  navigateToDetails() {
    this.router.navigate(['/specimens', this.specimen.id]);
  }
}