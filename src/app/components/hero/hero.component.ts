import { Component, OnDestroy } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { Subject, startWith, takeUntil } from 'rxjs';

@Component({
  selector: 'app-hero',
  standalone: true,
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
})
export class HeroComponent implements OnDestroy {
  imageUrl = '/assets/ai_image.jpg';
  private readonly destroy$ = new Subject<void>();

  constructor(private readonly translocoService: TranslocoService) {
    this.translocoService.langChanges$
      .pipe(startWith(this.translocoService.getActiveLang()), takeUntil(this.destroy$))
      .subscribe(lang => {
        this.imageUrl = lang === 'pt' ? '/assets/ai_image_pt.png' : '/assets/ai_image.jpg';
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
