import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [],
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.css']
})
export class LanguageSelectorComponent implements OnInit, OnDestroy {
  private readonly translocoService = inject(TranslocoService);
  private readonly destroy$ = new Subject<void>();

  currentLang: string = 'pt';
  currentImage: string = 'assets/usa-flag.png';
  isFlipped: boolean = false;

  ngOnInit() {
    this.currentLang = this.translocoService.getActiveLang();
    this.updateImage();

    this.translocoService.langChanges$
      .pipe(takeUntil(this.destroy$))
      .subscribe((lang) => {
        this.currentLang = lang;
        this.updateImage();
        console.debug('[LanguageSelector] Idioma alterado para:', lang);
      });
  }

  toggleLanguage() {
    this.isFlipped = true;
    setTimeout(() => {
      const nextLang = this.currentLang === 'pt' ? 'en' : 'pt';
      this.translocoService.setActiveLang(nextLang);
      this.isFlipped = false;
    }, 300);
  }

  updateImage() {
    this.currentImage =
      this.currentLang === 'pt'
        ? 'assets/usa-flag.png'
        : 'assets/brazil-flag.png';
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
