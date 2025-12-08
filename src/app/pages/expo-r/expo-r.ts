import { Component } from '@angular/core';
import { NavBarComponent } from '../../core/components/nav-bar/nav-bar.component';
import { HttpClient, HttpClientModule } from '@angular/common/http'; 
import { lastValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

// --- INTERFACES ---
interface RenewExhibitionData {
    idManager: number;
    title: string;
    description: string;
    category: string;
    createdAt: string; 
    coverImageUrl?: string; // ✅ CORREGIDO: Usamos el nombre de tu BD
}

interface RenewExhibitionContent {
    idExhibition: number;
    contentType: 'TEXT' | 'IMAGE';
    textContent: string | null;
    imageUrl: string | null; // Para contenido seguimos usando imageUrl (según tu DTO de contenido)
    imageDescription: string | null;
    displayOrder: number;
}

interface ContentField {
    id: number;
    contentType: 'TEXT' | 'IMAGE';
    textContent: string | null;
    imageUrl: string | null; // Para contenido seguimos usando imageUrl (según tu DTO de contenido)
    imageDescription: string | null;
    isNew: boolean;
    selectedFile?: File | null;
    imageFileName?: string | null; // Añadido para mostrar el nombre del archivo
}

@Component({
    selector: 'app-expo-r',
    standalone: true,
    imports: [ NavBarComponent, CommonModule, FormsModule, HttpClientModule], 
    templateUrl: './expo-r.html',
    styleUrl: './expo-r.css'
})
export class ExpoR {
        exhibitionData = {
        title: '',
        description: '',
        category: '',
        idManager: 0
    };

    selectedCoverImage: File | null = null;
    coverImageFileName: string | null = null; // Añadido para mostrar el nombre del archivo de portada
    dynamicContent: ContentField[] = [];
    private nextContentId = 1;
    private readonly API_BASE_URL = 'http://34.202.158.56:8080'; 

    constructor(private http: HttpClient, private authService: AuthService, private router: Router) {
        this.anadirContenido('TEXT');
    }


    anadirContenido(type: 'TEXT' | 'IMAGE') {
        this.dynamicContent.push({
            id: this.nextContentId++,
            contentType: type,
            textContent: type === 'TEXT' ? '' : null,
            imageUrl: null,
            imageDescription: type === 'IMAGE' ? '' : null,
            isNew: true,
            selectedFile: null
        });
    }

    removerContenido(id: number) {
        this.dynamicContent = this.dynamicContent.filter(c => c.id !== id);
    }

    onCoverImageSelected(event: any): void {
        if (event.target.files && event.target.files.length > 0) {
            this.selectedCoverImage = event.target.files[0];
            this.coverImageFileName = event.target.files[0].name;
        } else {
            this.selectedCoverImage = null;
            this.coverImageFileName = null;
        }
    }

    onContentImageSelected(event: any, contentBlock: ContentField): void {
        if (event.target.files && event.target.files.length > 0) {
            contentBlock.selectedFile = event.target.files[0];
            contentBlock.imageFileName = event.target.files[0].name;
        } else {
            contentBlock.selectedFile = null;
            contentBlock.imageFileName = null;
        }
    }


    async uploadImageToCloudinary(file: File, folder: string): Promise<string> {
        const formData = new FormData();
        formData.append('file', file);
        
        const url = `${this.API_BASE_URL}/upload?folder=${folder}`;

        try {
            const response = await lastValueFrom(
                this.http.post<any>(url, formData)
            );
            return response.url;
        } catch (error) {
            console.error(`Error subiendo imagen a ${folder}:`, error);
            throw error;
        }
    }


    async publicarExposicion(): Promise<void> {
        if (!this.exhibitionData.title || !this.exhibitionData.description || !this.exhibitionData.category) {
            alert('Por favor, completa los campos obligatorios.');
            return;
        }

        try {
            const currentUser = this.authService.currentUser();
            if (!currentUser || !currentUser.id) {
                alert('No se pudo obtener el ID del usuario actual. Por favor, inicia sesión de nuevo.');
                return;
            }
            this.exhibitionData.idManager = currentUser.id;

            let finalCoverUrl = '';
            if (this.selectedCoverImage) {
                finalCoverUrl = await this.uploadImageToCloudinary(this.selectedCoverImage, 'exhibitions');
            }

            const exhibitionId = await this.registrarExposicionPrincipal(finalCoverUrl);
            
            if (!exhibitionId) throw new Error("No se pudo obtener el ID de la exposición creada.");

            for (const content of this.dynamicContent) {
                let contentImageUrl = null;

                if (content.contentType === 'IMAGE' && content.selectedFile) {
                    contentImageUrl = await this.uploadImageToCloudinary(content.selectedFile, 'exhibition_content');
                }

                await this.registrarBloqueContenido(exhibitionId, content, contentImageUrl);
            }

            alert('🎉 Exposición y contenido registrados con éxito!');
            this.resetForm();
            this.router.navigate(['/exposition', exhibitionId]);

        } catch (error) {
            console.error('Error en el proceso de publicación:', error);
            alert('Ocurrió un error al publicar la exposición. Revisa la consola.');
        }
    }


    async registrarExposicionPrincipal(coverUrl: string): Promise<number | null> {
        const payload: RenewExhibitionData = {
            idManager: this.exhibitionData.idManager,
            title: this.exhibitionData.title,
            description: this.exhibitionData.description,
            category: this.exhibitionData.category,
            createdAt: new Date().toISOString().split('T')[0],
            coverImageUrl: coverUrl 
        };

        const response = await lastValueFrom(
            this.http.post<any>(`${this.API_BASE_URL}/exhibitions`, payload)
        );

        console.log('Exposición creada:', response);
        return response.id; 
    }

    async registrarBloqueContenido(exhibitionId: number, content: ContentField, uploadedUrl: string | null) {
        const payload: RenewExhibitionContent = {
            idExhibition: exhibitionId,
            contentType: content.contentType,
            displayOrder: content.id,
            textContent: content.contentType === 'TEXT' ? content.textContent : null,
            imageDescription: content.contentType === 'IMAGE' ? content.imageDescription : null,
            imageUrl: uploadedUrl
        };

        await lastValueFrom(
            this.http.post(`${this.API_BASE_URL}/exhibitionContent`, payload)
        );
        console.log(`✅ Contenido ID ${content.id} guardado.`);
    }

    resetForm() {
        this.exhibitionData = { title: '', description: '', category: '', idManager: 0 };
        this.selectedCoverImage = null;
        this.coverImageFileName = null; // Reiniciar el nombre del archivo de portada
        this.dynamicContent = [];
        this.nextContentId = 1;
        this.anadirContenido('TEXT');
    }
}