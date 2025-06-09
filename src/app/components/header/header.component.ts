import { Component } from '@angular/core';
import { TranslocoService, TranslocoModule } from '@jsverse/transloco';
import { CommonModule } from '@angular/common';
import { TypewriterComponent } from "../typewriter/typewriter.component";
import { LanguageSelectorComponent } from "../language-selector/language-selector.component";

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, TranslocoModule, TypewriterComponent, LanguageSelectorComponent],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private readonly translocoService: TranslocoService) {}
}