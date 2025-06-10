import { ReaderService } from '@/app/services/reader.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-content',
  imports: [CommonModule],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css',
})
export class ContentComponent {
  constructor(public readerService: ReaderService) {}

  abrirLeitor() {
    this.readerService.show();
  }
}
