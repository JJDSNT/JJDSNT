import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { AppTranslationService } from '@/app/services/app-translation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [CommonModule, TranslocoModule],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css',
})
export class ContentComponent implements AfterViewInit, OnDestroy {
  @ViewChild('audioRef') audioElementRef!: ElementRef<HTMLAudioElement>;

  private readonly amazonBrazilUrl = 'https://a.co/d/004Eaw6s';
  private readonly sub = new Subscription();

  constructor(
    private readonly translationService: AppTranslationService,
    private readonly transloco: TranslocoService
  ) {
    this.sub.add(
      this.transloco.langChanges$.subscribe(() => {
        // dispara change detection se necessário
      })
    );
  }
  ngAfterViewInit(): void {
    this.sub.add(
      this.transloco.langChanges$.subscribe(() => {
        this.updateAudioSource();
      })
    );
  }

    updateAudioSource(): void {
    if (this.audioElementRef?.nativeElement) {
      this.audioElementRef.nativeElement.load(); // força recarregamento
    }
  }

  abrirLivro(): void {
    if (this.translationService.getCurrentLang().startsWith('pt')) {
      window.open(this.amazonBrazilUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    const message = this.translationService.getTranslationValue('livro.lancamentoIngles');
    if (message) {
      alert(message);
    }
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
