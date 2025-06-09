import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, concat, from, of } from 'rxjs';
import {
  map,
  take,
  delay,
  ignoreElements,
  concatMap,
  repeat,
} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TypewriterService {
  private readonly titleSubject = new BehaviorSubject<string>('');

  setTitle(title: string) {
    this.titleSubject.next(title);
  }

  getTitleObservable() {
    return this.titleSubject.asObservable();
  }

  private type({
    word,
    speed,
    backwards = false,
  }: {
    word: string;
    speed: number;
    backwards?: boolean;
  }) {
    return interval(speed).pipe(
      map((x) =>
        backwards
          ? word.substring(0, word.length - x)
          : word.substring(0, x + 1)
      ),
      take(word.length + 1)
    );
  }

  typeEffect(word: string) {
    return concat(
      this.type({ word, speed: 50 }),
      of('').pipe(delay(1200), ignoreElements()),
      this.type({ word, speed: 30, backwards: true }),
      of('').pipe(delay(300), ignoreElements())
    );
  }

  getTypewriterEffect(titles: string[]) {
    return from(titles).pipe(
      concatMap((title) => this.typeEffect(title)),
      repeat()
    );
  }
}