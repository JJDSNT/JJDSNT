import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { TypewriterService } from './typewriter.service';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-typewriter',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './typewriter.component.html',
  styleUrls: ['./typewriter.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TypewriterComponent implements OnInit, OnDestroy {
  typedText$: Observable<string>;
  private readonly typewriterService = inject(TypewriterService);
  private readonly destroy$ = new Subject<void>();

  constructor() {
    console.debug('[TypewriterComponent] Inicializando...');
    
    // Simplesmente observe o título do serviço - ele já gerencia tudo
    this.typedText$ = this.typewriterService.getTitleObservable().pipe(
      takeUntil(this.destroy$)
    );
  }

  ngOnInit() {
    console.debug('[TypewriterComponent] Componente iniciado');
    
    // Opcional: Log para debug
    this.typedText$.subscribe(text => {
      console.debug('[TypewriterComponent] Texto recebido:', text);
    });
  }

  // Métodos opcionais para controle
  pauseEffect() {
    this.typewriterService.stopEffect();
  }

  resumeEffect() {
    this.typewriterService.startEffect();
  }

  restartEffect() {
    this.typewriterService.restartEffect();
  }

  ngOnDestroy() {
    console.debug('[TypewriterComponent] Destruindo componente');
    this.destroy$.next();
    this.destroy$.complete();
  }
}