import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  OnDestroy
} from '@angular/core';
import { TypewriterService } from './typewriter.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-typewriter',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './typewriter.component.html',
  styleUrls: ['./typewriter.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TypewriterComponent implements OnInit, OnDestroy {
  private readonly typewriterService = inject(TypewriterService);
  private readonly destroy$ = new Subject<void>();

  typedText$ = this.typewriterService.typedText$.pipe(takeUntil(this.destroy$));

  ngOnInit() {
    console.debug('[TypewriterComponent] Componente iniciado');
    this.typedText$.subscribe(text => {
      console.debug('[TypewriterComponent] Texto recebido:', text);
    });
  }

  pauseEffect() {
    this.typewriterService.stopEffect();
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
