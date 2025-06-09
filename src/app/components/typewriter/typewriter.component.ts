import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { TypewriterService } from './typewriter.service';
import { Observable, of, Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { TranslocoService, TranslocoModule } from '@jsverse/transloco';

@Component({
    selector: 'app-typewriter',
    standalone: true,
    imports: [AsyncPipe, TranslocoModule],
    templateUrl: './typewriter.component.html',
    styleUrls: ['./typewriter.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TypewriterComponent implements OnInit, OnDestroy {
  typedText$: Observable<string> = new Observable<string>();
  private readonly typewriterService = inject(TypewriterService);
  private readonly translocoService = inject(TranslocoService);
  private readonly cdr = inject(ChangeDetectorRef);

  private readonly destroy$ = new Subject<void>();

  ngOnInit() {
    this.translocoService
      .selectTranslateObject('typewriterTitles')
      .pipe(
        switchMap((titles: string[]) => {
          if (titles && titles.length) {
            return this.typewriterService.getTitleObservable().pipe(
              switchMap((title) => {
                if (title) {
                  return of(title); // Exibe o título diretamente
                } else {
                  return this.typewriterService.getTypewriterEffect(titles); // Efeito de typewriter
                }
              }),
              map((text) => {
                this.cdr.markForCheck(); // Força a detecção de mudanças
                return text;
              })
            );
          }
          return of(''); // Caso não haja títulos disponíveis
        }),
        takeUntil(this.destroy$) // Limpeza automática quando o componente for destruído
      )
      .subscribe((text) => {
        this.typedText$ = of(text);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}