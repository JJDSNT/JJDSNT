import { Injectable, inject } from '@angular/core';
import { TranslocoService, Translation } from '@jsverse/transloco';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AppTranslationService {
  private readonly transloco = inject(TranslocoService);

  constructor() {
    console.debug('[AppTranslationService] Inicializando...');
  }

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
}
