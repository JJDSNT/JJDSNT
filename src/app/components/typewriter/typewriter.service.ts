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
  switchMap,
  filter,
} from 'rxjs/operators';
import { AppTranslationService } from '@/app/services/app-translation.service';

@Injectable({ providedIn: 'root' })
export class TypewriterService implements OnDestroy {
  private readonly titleSubject = new BehaviorSubject<string>('');
  private readonly translationService = inject(AppTranslationService);
  private typewriterSubscription?: Subscription;
  private isRunning = false;

  constructor() {
    console.debug('[TypewriterService] Inicializando...');
    this.initializeTypewriter();
  }

  private initializeTypewriter() {
    // Aguarda os títulos serem carregados e inicia o efeito automaticamente
    this.translationService.getTitlesObservable().pipe(
      filter(titles => titles && titles.length > 0),
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
      next: (title) => {
        console.debug('[TypewriterService] Atualizando título:', title);
        this.titleSubject.next(title);
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

  setTitle(title: string) {
    console.debug('[TypewriterService] Título definido manualmente:', title);
    this.stopTypewriterEffect(); // Para o efeito automático
    this.titleSubject.next(title);
  }

  getTitleObservable() {
    return this.titleSubject.asObservable();
  }

  getCurrentTitle(): string {
    return this.titleSubject.getValue();
  }

  getTitlesObservable() {
    return this.translationService.getTitlesObservable();
  }

  getCurrentTitles(): string[] {
    const titles = this.translationService.getCurrentTitles();
    console.debug('[TypewriterService] Títulos atuais:', titles);
    return titles;
  }

  // Gera o efeito de digitação
  private type({
    word,
    speed,
    backwards = false,
  }: {
    word: string;
    speed: number;
    backwards?: boolean;
  }) {
    console.debug(
      '[TypewriterService] Iniciando digitação:',
      word,
      backwards ? '(backwards)' : '(forwards)'
    );

    return interval(speed).pipe(
      map((x) =>
        backwards
          ? word.substring(0, word.length - x)
          : word.substring(0, x + 1)
      ),
      take(word.length + 1)
    );
  }

  typeEffect(word: string) {
    console.debug('[TypewriterService] Criando efeito para palavra:', word);
    return concat(
      this.type({ word, speed: 50 }),
      of('').pipe(delay(1200), ignoreElements()),
      this.type({ word, speed: 30, backwards: true }),
      of('').pipe(delay(300), ignoreElements())
    );
  }

  getTypewriterEffect(titles: string[]) {
    console.debug('[TypewriterService] Iniciando ciclo de efeito com títulos:', titles);
    return from(titles).pipe(
      concatMap((title) => {
        console.debug('[TypewriterService] Processando título:', title);
        return this.typeEffect(title);
      }),
      repeat()
    );
  }

  // Métodos de controle público
  startEffect() {
    const titles = this.getCurrentTitles();
    if (titles.length > 0) {
      this.startTypewriterEffect(titles);
    } else {
      console.warn('[TypewriterService] Nenhum título disponível para iniciar o efeito');
    }
  }

  stopEffect() {
    this.stopTypewriterEffect();
    this.titleSubject.next('');
  }

  restartEffect() {
    this.stopEffect();
    setTimeout(() => this.startEffect(), 100);
  }

  // Força uma atualização dos títulos
  refreshTitles() {
    const titles = this.getCurrentTitles();
    if (titles.length > 0) {
      this.startTypewriterEffect(titles);
    }
  }

  ngOnDestroy() {
    console.debug('[TypewriterService] Destruindo serviço...');
    this.stopTypewriterEffect();
  }
}