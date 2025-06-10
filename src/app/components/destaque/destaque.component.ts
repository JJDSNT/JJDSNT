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
  content$: Observable<{ title: string; description: string }> = of({ title: '', description: '' });

  private readonly typewriterService = inject(TypewriterService);
  private readonly translationService = inject(AppTranslationService);
  private readonly destroy$ = new Subject<void>();

  ngOnInit() {
    this.content$ = combineLatest([
      this.typewriterService.currentTitle$.pipe(distinctUntilChanged()),
      this.translationService.getTitlesObservable().pipe(filter(t => t.length > 0)),
      this.translationService.getTranslationsObservable().pipe(filter(t => Object.keys(t).length > 0))
    ]).pipe(
      map(([currentTitle, titles, translations]) => {
        const index = titles.indexOf(currentTitle);
        if (index >= 0) {
          const titleKey = `content${index}Title`;
          const descKey = `content${index}Description`;
          return {
            title: translations[titleKey] ?? `Título ${index + 1}`,
            description:
              translations[descKey] ?? translations[`content${index}`] ?? `Descrição ${index + 1}`
          };
        }
        return { title: '', description: '' };
      }),
      takeUntil(this.destroy$)
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
