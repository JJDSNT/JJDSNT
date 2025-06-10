import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ContentComponent } from './components/content/content.component';
import { HeroComponent } from './components/hero/hero.component';
import { DestaqueComponent } from './components/destaque/destaque.component';
import { ReaderService } from './services/reader.service';
import { EpubReaderComponent } from './components/epub-reader/epub-reader.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    EpubReaderComponent,
    HeaderComponent,
    HeroComponent,
    DestaqueComponent,
    ContentComponent,
    FooterComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'JDias';
  readerVisible = false;

  constructor(private readonly reader: ReaderService) {
    this.reader.isVisible$.subscribe((v) => {
      this.readerVisible = v;
    });
  }
}
