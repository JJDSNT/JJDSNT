import { Injectable, inject, OnDestroy } from '@angular/core';
import { BehaviorSubject, interval, concat, from, of, Subscription } from 'rxjs';
import {
  map,
  take,
  delay,
  ignoreElements,
  concatMap,
  repeat,
  tap,
  filter,
} from 'rxjs/operators';
import { AppTranslationService } from '@/app/services/app-translation.service';

@Injectable({ providedIn: 'root' })
export class TypewriterService implements OnDestroy {
  private readonly typedTextSubject = new BehaviorSubject<string>('');
  private readonly currentTitleSubject = new BehaviorSubject<string>('');
  private readonly translationService = inject(AppTranslationService);
  private typewriterSubscription?: Subscription;
  private isRunning = false;

  typedText$ = this.typedTextSubject.asObservable();
  currentTitle$ = this.currentTitleSubject.asObservable();

  constructor() {
    console.debug('[TypewriterService] Inicializando...');
    this.initializeTypewriter();
  }

  private initializeTypewriter() {
    this.translationService.getTitlesObservable().pipe(
      filter(titles => titles.length > 0),
      tap(titles => console.debug('[TypewriterService] Títulos recebidos:', titles))
    ).subscribe(titles => {
      this.startTypewriterEffect(titles);
    });
  }

  private startTypewriterEffect(titles: string[]) {
    if (this.isRunning) {
      console.debug('[TypewriterService] Parando efeito anterior...');
      this.stopTypewriterEffect();
    }

    console.debug('[TypewriterService] Iniciando efeito de digitação com títulos:', titles);
    this.isRunning = true;

    this.typewriterSubscription = this.getTypewriterEffect(titles).subscribe({
      next: (typedText) => {
        this.typedTextSubject.next(typedText);
      },
      error: (error) => {
        console.error('[TypewriterService] Erro no efeito:', error);
        this.isRunning = false;
      }
    });
  }

  private stopTypewriterEffect() {
    if (this.typewriterSubscription) {
      this.typewriterSubscription.unsubscribe();
      this.typewriterSubscription = undefined;
    }
    this.isRunning = false;
  }

  private type({
    word,
    speed,
    backwards = false,
  }: {
    word: string;
    speed: number;
    backwards?: boolean;
  }) {
    return interval(speed).pipe(
      map((x) =>
        backwards
          ? word.substring(0, word.length - x)
          : word.substring(0, x + 1)
      ),
      take(word.length + 1)
    );
  }

  private typeEffect(word: string) {
    return concat(
      of(null).pipe(
        tap(() => {
          console.debug('[TypewriterService] Emitindo título atual completo:', word);
          this.currentTitleSubject.next(word);
        }),
        ignoreElements()
      ),
      this.type({ word, speed: 50 }),
      of(null).pipe(delay(1200), ignoreElements()),
      this.type({ word, speed: 30, backwards: true }),
      of(null).pipe(delay(300), ignoreElements())
    );
  }

  private getTypewriterEffect(titles: string[]) {
    return from(titles).pipe(
      concatMap(title => {
        console.debug('[TypewriterService] Processando título:', title);
        return this.typeEffect(title);
      }),
      repeat()
    );
  }

  // Métodos auxiliares e de controle

  stopEffect() {
    this.stopTypewriterEffect();
    this.typedTextSubject.next('');
    this.currentTitleSubject.next('');
  }

  restartEffect() {
    this.stopEffect();
    setTimeout(() => {
      const titles = this.translationService.getCurrentTitles();
      if (titles.length > 0) {
        this.startTypewriterEffect(titles);
      }
    }, 100);
  }

  ngOnDestroy() {
    console.debug('[TypewriterService] Destruindo serviço...');
    this.stopEffect();
  }
}
