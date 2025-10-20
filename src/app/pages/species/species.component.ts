import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro-especimen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './species.component.html',
  styleUrl: './species.component.css'
})
export class SpeciesComponent {
  selectedFile: File | null = null;
  imageUrl: string | ArrayBuffer | null = null;
  imageUrl1: string | ArrayBuffer | null = null;
  imageUrl2: string | ArrayBuffer | null = null;
  imageUrl3: string | ArrayBuffer | null = null;
  imageUrl4: string | ArrayBuffer | null = null;
  imageUrl5: string | ArrayBuffer | null = null;
  imageUrl6: string | ArrayBuffer | null = null;
  

  onFileSelected(event: Event, imageVarName: string): void {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList && fileList.length > 0) {
      this.selectedFile = fileList[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (imageVarName === 'imageUrl') {
          this.imageUrl = reader.result;
        } else if (imageVarName === 'imageUrl1') {
          this.imageUrl1 = reader.result;
        } else if (imageVarName === 'imageUrl2') {
          this.imageUrl2 = reader.result;
        } else if (imageVarName === 'imageUrl3') {
          this.imageUrl3 = reader.result;
        } else if (imageVarName === 'imageUrl4') {
          this.imageUrl4 = reader.result;
        } else if (imageVarName === 'imageUrl5') {
          this.imageUrl5 = reader.result;
        } else if (imageVarName === 'imageUrl6') {
          this.imageUrl6 = reader.result;
        }
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }
}