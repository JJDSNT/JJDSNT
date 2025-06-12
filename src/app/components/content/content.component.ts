import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { ReaderService } from '@/app/services/reader.service';
import { AppTranslationService } from '@/app/services/app-translation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [CommonModule, TranslocoModule],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css',
})
export class ContentComponent implements OnDestroy {
  private readonly sub = new Subscription();

  constructor(
    public readerService: ReaderService,
    private readonly translationService: AppTranslationService,
    private readonly transloco: TranslocoService
  ) {
    this.sub.add(
      this.transloco.langChanges$.subscribe(() => {
        // dispara change detection se necessário
      })
    );
  }

  abrirLeitor() {
    this.readerService.show();
  }

  alerta(formato: 'pdf' | 'epub') {
    const chave = formato === 'pdf' ? 'livro.alertaPdf' : 'livro.alertaEpub';
    const msg = this.translationService.getTranslationValue(chave);
    if (msg) alert(msg);
  }

  get coverSrc(): string {
    return this.translationService.getAssetPath('cover');
  }

  get pdfSrc(): string {
    return this.translationService.getAssetPath('pdf');
  }

  get epubSrc(): string {
    return this.translationService.getAssetPath('epub');
  }

  get audioSrc(): string {
    return this.translationService.getAssetPath('audio');
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
