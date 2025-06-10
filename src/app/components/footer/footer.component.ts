import { Component, OnDestroy } from '@angular/core';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { Subject, takeUntil, startWith } from 'rxjs';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [TranslocoModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnDestroy {
  linkedinUrl = 'https://www.linkedin.com/in/jdiasneto/';
  private readonly destroy$ = new Subject<void>();

  constructor(private readonly translocoService: TranslocoService) {
    this.translocoService.langChanges$
      .pipe(startWith(this.translocoService.getActiveLang()), takeUntil(this.destroy$))
      .subscribe(lang => {
        this.linkedinUrl =
          lang === 'en'
            ? 'https://www.linkedin.com/in/jdiasneto/?locale=en_US'
            : 'https://www.linkedin.com/in/jdiasneto/';
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
