import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit
} from '@angular/core';
import { AppTranslationService } from '@/app/services/app-translation.service';
import { TypewriterService } from '../typewriter/typewriter.service';
import { Observable, Subject, combineLatest, of } from 'rxjs';
import {
  map,
  takeUntil,
  filter,
  startWith,
  distinctUntilChanged
} from 'rxjs/operators';

@Component({
  selector: 'app-destaque',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './destaque.component.html',
  styleUrls: ['./destaque.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DestaqueComponent implements OnInit, OnDestroy {
  content$: Observable<{ title: string; description: string }> = of({
    title: '',
    description: ''
  });

  private readonly typewriterService = inject(TypewriterService);
  private readonly translationService = inject(AppTranslationService);
  private readonly destroy$ = new Subject<void>();

  ngOnInit() {
    console.debug('[DestaqueComponent] Inicializando...');

    this.content$ = combineLatest([
      this.typewriterService.currentTitle$.pipe(
        startWith(''),
        distinctUntilChanged()
      ),
      this.translationService.getTitlesObservable().pipe(
        filter(titles => titles.length > 0)
      ),
      this.translationService.getTranslationsObservable().pipe(
        filter(trans => Object.keys(trans).length > 0)
      )
    ]).pipe(
      map(([currentTitle, titles, translations]) => {
        console.debug('[DestaqueComponent] Processando dados:');
        console.debug('  - Título atual:', currentTitle);
        console.debug('  - Lista de títulos:', titles);
        console.debug('  - Traduções disponíveis:', Object.keys(translations));

        const index = titles.indexOf(currentTitle);
        if (index >= 0) {
          const titleKey = `content${index}Title`;
          const descKey = `content${index}Description`;

          const result = {
            title: translations[titleKey] ?? `Título ${index + 1}`,
            description:
              translations[descKey] ??
              translations[`content${index}`] ??
              `Descrição ${index + 1}`
          };

          console.debug('[DestaqueComponent] Conteúdo resolvido:', result);
          return result;
        }

        console.warn('[DestaqueComponent] Título não encontrado:', currentTitle);
        return { title: '', description: '' };
      }),
      startWith({ title: '', description: '' }),
      takeUntil(this.destroy$)
    );

    this.content$.subscribe(content => {
      console.debug('[DestaqueComponent] Conteúdo final emitido:', content);
    });
  }

  ngOnDestroy() {
    console.debug('[DestaqueComponent] Destruindo componente');
    this.destroy$.next();
    this.destroy$.complete();
  }

  debugCurrentState() {
    console.group('[DestaqueComponent] Estado Atual:');
    console.log('Títulos:', this.translationService.getCurrentTitles());
    console.log('Traduções:', this.translationService.getCurrentTranslations());
    console.log('Título atual do Typewriter:', this.typewriterService.currentTitle$);
    console.groupEnd();
  }
}
