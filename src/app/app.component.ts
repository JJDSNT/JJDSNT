import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ContentComponent } from "./components/content/content.component";
import { HeroComponent } from './components/hero/hero.component';
import { DestaqueComponent } from './components/destaque/destaque.component';


@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
    HeaderComponent,
    HeroComponent,
    DestaqueComponent,
    ContentComponent,
    FooterComponent,

],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'JDias';
}