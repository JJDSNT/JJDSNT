import { Component, OnInit, inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

@Component({
    selector: 'app-language-selector',
    standalone: true,
    imports: [],
    templateUrl: './language-selector.component.html',
    styleUrls: ['./language-selector.component.css']
})
export class LanguageSelectorComponent implements OnInit {
  private translocoService = inject(TranslocoService);
  currentLang: string = 'pt';
  currentImage: string = 'assets/usa-flag.png';
  isFlipped: boolean = false;

  ngOnInit() {
    this.currentLang = this.translocoService.getActiveLang();
    this.updateImage();
  }

  toggleLanguage() {
    this.isFlipped = true;
    setTimeout(() => {
      this.updateLanguage();
      this.updateImage();
      this.isFlipped = false;
    }, 300); // Ajuste o tempo da animação para o estilo de rotação
  }

  updateLanguage() {
    this.currentLang = this.currentLang === 'pt' ? 'en' : 'pt';
    this.translocoService.setActiveLang(this.currentLang);
  }

  updateImage() {
    this.currentImage =
      this.currentLang === 'pt'
        ? 'assets/usa-flag.png'
        : 'assets/brazil-flag.png';
  }
}