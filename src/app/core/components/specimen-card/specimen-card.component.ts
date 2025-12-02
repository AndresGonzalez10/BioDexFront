import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
  @Output() specimenSelected = new EventEmitter<string>();

  constructor() { }

  onCardClick() {
    this.specimenSelected.emit(this.specimen.id);
  }
}