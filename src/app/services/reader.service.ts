// reader.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReaderService {
  private readonly visible$ = new BehaviorSubject<boolean>(false);
  isVisible$ = this.visible$.asObservable();

  show() {
    this.visible$.next(true);
  }

  hide() {
    this.visible$.next(false);
  }
}
