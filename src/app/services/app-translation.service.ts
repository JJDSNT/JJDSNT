import { Injectable, inject } from '@angular/core';
import { TranslocoService, Translation } from '@jsverse/transloco';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  filter,
  map
} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AppTranslationService {
  private readonly transloco = inject(TranslocoService);
  private readonly titlesSubject = new BehaviorSubject<string[]>([]);
  private readonly translationsSubject = new BehaviorSubject<Translation>({});

  constructor() {
    console.debug('[AppTranslationService] Inicializando...');

    combineLatest([
      this.transloco.langChanges$,
      this.transloco.events$.pipe(
        filter(
          (event) =>
            event.type === 'translationLoadSuccess' &&
            !!event.payload?.langName
        )
      )
    ])
      .pipe(
        filter(([lang, event]) => lang === event.payload.langName),
        map(([lang]) => {
          console.debug('[AppTranslationService] Tradução carregada e confirmada para:', lang);
          return this.transloco.getTranslation(lang);
        })
      )
      .subscribe({
        next: (translations) => {
          console.debug('[AppTranslationService] Traduções finais carregadas:', translations);
          this.translationsSubject.next(translations);

          const titles = translations?.['typewriterTitles'];

          if (Array.isArray(titles) && titles.length > 0) {
            console.debug('[AppTranslationService] typewriterTitles carregados:', titles);
            this.titlesSubject.next(titles);
          } else {
            console.warn('[AppTranslationService] typewriterTitles não encontrados ou vazios:', titles);
          }
        },
        error: (err) => {
          console.error('[AppTranslationService] Erro ao carregar traduções:', err);
        }
      });
  }

  getTitlesObservable(): Observable<string[]> {
    console.debug('[AppTranslationService] getTitlesObservable chamado');
    return this.titlesSubject.asObservable().pipe(
      filter((titles) => titles.length > 0)
    );
  }

  getCurrentTitles(): string[] {
    const current = this.titlesSubject.getValue();
    console.debug('[AppTranslationService] getCurrentTitles:', current);
    return current;
  }

  getTranslationsObservable(): Observable<Translation> {
    console.debug('[AppTranslationService] getTranslationsObservable chamado');
    return this.translationsSubject.asObservable().pipe(
      filter((t) => Object.keys(t).length > 0)
    );
  }

  getCurrentTranslations(): Translation {
    const current = this.translationsSubject.getValue();
    console.debug('[AppTranslationService] getCurrentTranslations:', current);
    return current;
  }

  getTranslationValue(key: string): string | undefined {
    const value = this.getCurrentTranslations()?.[key];
    console.debug(`[AppTranslationService] Valor da tradução para "${key}":`, value);
    return value;
  }

  waitForInitialLoad(): Observable<string[]> {
    return this.getTitlesObservable();
  }
}
