/* TODO: Melhorias e funcionalidades do EPUB Reader

✅ MVP já funcional:
- Leitura básica via ePub.js
- Navegação entre páginas (← Anterior / Próxima →)
- Botão “Voltar” para retornar à tela anterior
- Estilo fullscreen com visual limpo e responsivo

🛠️ Próximas melhorias:

[ ] TOC (Sumário de capítulos)
    - Exibir lista de capítulos com navegação via `book.navigation`
    - Botão lateral para abrir/fechar TOC
    - Destacar capítulo atual na leitura

[ ] Posição e progresso de leitura
    - Mostrar: “Capítulo X — Página 3 de 9”
    - Usar `rendition.location.start` e `book.locations`
    - Exibir barra de progresso no rodapé (linear)

[ ] Suporte a marcação e persistência de posição
    - Gravar último local lido (cfi) em `localStorage` ou IndexedDB
    - Restaurar leitura a partir da última posição ao abrir

[ ] Suporte completo a touch
    - Swipe para navegar (mobile)
    - Touch-friendly buttons e TOC
    - Considerar suporte a zoom e ajuste de fonte (futuro)

[ ] Modo escuro / claro
    - Alternância de tema com botão
    - Usar `.themes.default()` e `.themes.register()` do ePub.js

[ ] Suporte futuro a PWA
    - Tornar o app installable (manifest + service worker)
    - Funcionar offline com cache do EPUB
    - Detectar estado de conexão (online/offline)
    - Adicionar splash screen personalizada

🧠 Extras possíveis:
[ ] Notas e marcações por trecho
[ ] Pesquisa no conteúdo
[ ] Leitura em voz alta (Web Speech API)
[ ] Exibição de metadados do livro

Adicionar suporte ao Google Analytics(para rastrear eventos de leitura também)

*/


import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import ePub from 'epubjs';
import { ReaderService } from '@/app/services/reader.service';

@Component({
  selector: 'app-epub-reader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './epub-reader.component.html',
  styleUrls: ['./epub-reader.component.css']
})
export class EpubReaderComponent implements OnInit {
  @ViewChild('viewer', { static: true }) viewerRef!: ElementRef;
  private book: any;
  private rendition: any;

 constructor(private readonly readerService: ReaderService) {}

  ngOnInit(): void {
    this.book = ePub('assets/livro.epub'); // ou use um @Input() futuramente
    this.rendition = this.book.renderTo(this.viewerRef.nativeElement, {
      width: '100%',
      height: '100%',
    });
    this.rendition.display();
  }

  nextPage() {
    this.rendition?.next();
  }

  prevPage() {
    this.rendition?.prev();
  }
  fechar() {
    this.readerService.hide();
  }

}
