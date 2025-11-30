import { Component } from '@angular/core';
import { NavBarComponent } from '../../core/components/nav-bar/nav-bar.component';
import { HttpClient, HttpClientModule } from '@angular/common/http'; 
import { lastValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ManagerIdService } from '../../core/services/manager-id.service';

interface ExhibitionResponse {
    id: number;
    idManager: number;
    title: string;
    description: string;
    category: string;
    createdAt: string;
}

interface RenewExhibitionData {
    idManager: number;
    title: string;
    description: string;
    category: string;
    createdAt: string;
    coverImageUrl?: string; 
}

interface RenewExhibitionContent {
    idExhibition: number;
    contentType: 'TEXT' | 'IMAGE';
    textContent: string | null;
    imageUrl: string | null;
    imageDescription: string | null;
    displayOrder: number;
}

interface ContentField {
    id: number;
    contentType: 'TEXT' | 'IMAGE';
    textContent: string | null;
    imageUrl: string | null;
    imageDescription: string | null;
    isNew: boolean;
    selectedFile?: File | null;
}

@Component({
    selector: 'app-expo-r',
    imports: [ NavBarComponent, CommonModule, FormsModule, HttpClientModule], 
    templateUrl: './expo-r.html',
    styleUrl: './expo-r.css'
})
export class ExpoR {
    exhibitionData: Partial<RenewExhibitionData> = {
        title: '',
        description: '',
        category: '',
    };

    
    dynamicContent: ContentField[] = [];

    private nextContentId = 1;

    private readonly API_BASE_URL = 'http://localhost:8060';

    constructor(private http: HttpClient, private managerIdService: ManagerIdService) {
        this.exhibitionData.idManager = this.managerIdService.getManagerId();
        this.anadirContenido('TEXT');
    }

    anadirContenido(type: 'TEXT' | 'IMAGE') {
        this.dynamicContent.push({
            id: this.nextContentId++,
            contentType: type,
            textContent: type === 'TEXT' ? '' : null,
            imageUrl: type === 'IMAGE' ? '' : null,
            imageDescription: type === 'IMAGE' ? '' : null,
            isNew: true,
        });
    }

    removerContenido(id: number) {
        this.dynamicContent = this.dynamicContent.filter(c => c.id !== id);
    }
    
    async registrarExposicionPrincipal(): Promise<number | null> {
        if (!this.exhibitionData.title || !this.exhibitionData.description || !this.exhibitionData.category || this.exhibitionData.idManager === undefined) {
            alert('Por favor, complete el Título, Descripción, Categoría y el ID del Gestor.');
            return null;
        }

        const payload: RenewExhibitionData = {
            ...this.exhibitionData,
            idManager: this.exhibitionData.idManager as number, 
            createdAt: new Date().toISOString().split('T')[0],
        } as RenewExhibitionData;

        try {
            const response = await lastValueFrom(
                this.http.post(`${this.API_BASE_URL}/exhibitions`, payload, { responseType: 'text' })
            );
            const idMatch = response.match(/Contemnido Guardo: (\d+)/);
            if (idMatch && idMatch[1]) {
                return parseInt(idMatch[1], 10);
            }
            return null;
        } catch (error) {
            console.error('Error en Fase 1 (Registro Principal):', error);
            alert('❌ Error al registrar la exposición principal.');
            return null;
        }
    }

    async registrarBloqueContenido(exhibitionId: number, content: ContentField) {
        let imageUrlToSave: string | null = null;

        if (content.contentType === 'IMAGE' && content.selectedFile) {
            try {
                imageUrlToSave = await this.uploadContentImage(content.selectedFile);
            } catch (error) {
                console.error('Error al subir la imagen de contenido:', error);
                alert('❌ Error al subir una imagen de contenido. La exposición se registrará sin esta imagen.');
                return; 
            }
        }

        const contentPayload: RenewExhibitionContent = {
            idExhibition: exhibitionId,
            contentType: content.contentType,
            textContent: content.contentType === 'TEXT' ? content.textContent : null,
            imageUrl: imageUrlToSave, 
            imageDescription: content.imageDescription,
            displayOrder: content.id, 
        } as RenewExhibitionContent;

        try {
            await lastValueFrom(
                this.http.post(`${this.API_BASE_URL}/exhibitionContent`, contentPayload, { responseType: 'text' })
            );
            console.log(`✅ Contenido de tipo ${content.contentType} registrado para Exposición ID: ${exhibitionId}`);
        } catch (error) {
            console.error(`Error en Fase 2 (Registro de Contenido ${content.contentType}):`, error);
        }
    }

    selectedCoverImage: File | null = null;

    onCoverImageSelected(event: any): void {
        if (event.target.files && event.target.files.length > 0) {
            this.selectedCoverImage = event.target.files[0];
        } else {
            this.selectedCoverImage = null;
        }
    }

    onContentImageSelected(event: any, contentBlock: ContentField): void {
        if (event.target.files && event.target.files.length > 0) {
            contentBlock.selectedFile = event.target.files[0];
        } else {
            contentBlock.selectedFile = null;
        }
    }

    async uploadCoverImage(file: File): Promise<string> {
        const formData = new FormData();
        formData.append('image', file, file.name);

        try {
            const response = await lastValueFrom(
                this.http.post(`${this.API_BASE_URL}/upload/exhibition-cover-image`, formData, { responseType: 'text' })
            );
            return response;
        } catch (error) {
            console.error('Error al subir la imagen de portada:', error);
            throw error;
        }
    }

    async uploadContentImage(file: File): Promise<string> {
        const formData = new FormData();
        formData.append('image', file, file.name);

        try {
            const response = await lastValueFrom(
                this.http.post(`${this.API_BASE_URL}/upload/exhibition-content-image`, formData, { responseType: 'text' })
            );
            return response;
        } catch (error) {
            console.error('Error al subir la imagen de contenido:', error);
            throw error;
        }
    }

    async publicarExposicion(): Promise<void> {
        if (this.selectedCoverImage) {
            try {
                const coverImageUrl = await this.uploadCoverImage(this.selectedCoverImage);
                this.exhibitionData.coverImageUrl = coverImageUrl;
            } catch (error) {
                console.error('No se pudo subir la imagen de portada, la exposición no se publicará.', error);
                return;
            }
        }

        const exhibitionId = await this.registrarExposicionPrincipal();

        if (exhibitionId === null) {
            return;
        }
        
        const contentPromises = this.dynamicContent
            .filter(c => c.textContent || c.selectedFile) 
            .map(content => this.registrarBloqueContenido(exhibitionId, content));

        await Promise.all(contentPromises);
        
        alert('🎉 Exposición y contenido registrados con éxito!');
        this.resetForm();
    }

    resetForm() {
        this.exhibitionData = { title: '', description: '', category: '' };
        this.selectedCoverImage = null; 
        this.dynamicContent = [];
        this.nextContentId = 1;
        this.anadirContenido('TEXT');
    }
}