import { Injectable, inject } from '@angular/core';
import { TranslocoService, Translation } from '@jsverse/transloco';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

type AssetType = 'cover' | 'pdf' | 'epub' | 'audio';

@Injectable({ providedIn: 'root' })
export class AppTranslationService {
  private readonly transloco = inject(TranslocoService);

  constructor() {
    console.debug('[AppTranslationService] Inicializando...');
  }

  // ─────────────────────────────────────────────
  // 🧠 Traduções
  // ─────────────────────────────────────────────

  getTitlesObservable(): Observable<string[]> {
    return this.transloco.selectTranslation().pipe(
      map(trans => trans['typewriterTitles']),
      filter((titles): titles is string[] => Array.isArray(titles) && titles.length > 0)
    );
  }

  getTranslationsObservable(): Observable<Translation> {
    return this.transloco.selectTranslation().pipe(
      filter(t => !!t && Object.keys(t).length > 0)
    );
  }

  getTranslationValue(key: string): string | undefined {
    const translation = this.transloco.translateObject('');
    return translation?.[key];
  }

  waitForInitialLoad(): Observable<string[]> {
    return this.getTitlesObservable();
  }

  getCurrentTitles(): string[] {
    const current = this.transloco.translateObject('')['typewriterTitles'];
    return Array.isArray(current) ? current : [];
  }

  getCurrentTranslations(): Translation {
    return this.transloco.translateObject('');
  }

  getCurrentLang(): string {
    return this.transloco.getActiveLang();
  }

  // ─────────────────────────────────────────────
  // 🧩 Assets por idioma com fallback
  // ─────────────────────────────────────────────

  private readonly translatedAssets: Record<AssetType, string[]> = {
    cover: ['en'],
    pdf: [],
    epub: [],
    audio: ['en'],
  };

  getAssetPath(type: AssetType): string {
    const lang = this.getCurrentLang();
    const suffix = this.translatedAssets[type].includes(lang) ? `_${lang}` : '';
    const extension = this.getExtension(type);
    const prefix = this.getPrefix(type);
    return `assets/${prefix}${suffix}.${extension}`;
  }

  private getExtension(type: AssetType): string {
    const lang = this.getCurrentLang();
    
    switch (type) {
      case 'cover': return 'jpg';
      case 'pdf': return 'pdf';
      case 'epub': return 'epub';
      case 'audio': return lang.startsWith('en') ? 'mp3' : 'wav';
    }
  }

  private getPrefix(type: AssetType): string {
    switch (type) {
      case 'cover': return 'cover';
      case 'audio': return 'audio';
      default: return 'livro';
    }
  }
}
