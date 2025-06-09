import { inject, Injectable, isDevMode } from "@angular/core";
import { Translation, TranslocoLoader } from "@jsverse/transloco";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
    private readonly http = inject(HttpClient);

    getTranslation(lang: string) {
        const basePath = isDevMode() ? './' : '/';
        console.log ('basePath: '+basePath)
        return this.http.get<Translation>(`${basePath}assets/i18n/${lang}.json`);
    }
}