import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit
} from "@angular/core";
import { AppTranslationService } from "@/app/services/app-translation.service";
import { TypewriterService } from "../typewriter/typewriter.service";
import { Observable, Subject, combineLatest, of, EMPTY } from "rxjs";
import { map, takeUntil, filter, switchMap, startWith, distinctUntilChanged } from "rxjs/operators";

@Component({
  selector: 'app-destaque',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './destaque.component.html',
  styleUrls: ['./destaque.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DestaqueComponent implements OnInit, OnDestroy {
  content$: Observable<{ title: string; description: string }> = of({ title: '', description: '' });

  private readonly typewriterService = inject(TypewriterService);
  private readonly translationService = inject(AppTranslationService);
  private readonly destroy$ = new Subject<void>();

  ngOnInit() {
    console.debug('[DestaqueComponent] Inicializando...');

    // Aguarda ambos os observables terem dados válidos
    this.content$ = this.translationService.getTitlesObservable().pipe(
      filter(titles => titles && titles.length > 0), // Só prossegue quando há títulos
      switchMap(titles => {
        console.debug('[DestaqueComponent] Títulos carregados:', titles);
        
        // Agora combina com o typewriter que já tem títulos válidos
        return combineLatest([
          this.typewriterService.getTitleObservable().pipe(
            startWith(''), // Começa com string vazia
            distinctUntilChanged()
          ),
          of(titles), // Usa os títulos já carregados
          this.translationService.getTranslationsObservable().pipe(
            filter(trans => trans && Object.keys(trans).length > 0)
          )
        ]);
      }),
      map(([currentTitle, titles, translations]) => {
        console.debug('[DestaqueComponent] Processando dados:');
        console.debug('  - Título atual:', currentTitle);
        console.debug('  - Lista de títulos:', titles);
        console.debug('  - Traduções disponíveis:', Object.keys(translations));

        // Se não há título atual, retorna vazio
        if (!currentTitle) {
          console.debug('[DestaqueComponent] Aguardando título atual...');
          return { title: '', description: '' };
        }

        const index = titles.indexOf(currentTitle);
        console.debug('[DestaqueComponent] Índice encontrado:', index);

        if (index >= 0) {
          const titleKey = `content${index}Title`;
          const descKey = `content${index}Description`; // Assumindo que é Description, não só content

          const result = {
            title: translations[titleKey] ?? `Título ${index + 1}`, // Fallback
            description: translations[descKey] ?? translations[`content${index}`] ?? `Descrição ${index + 1}` // Fallback com tentativa alternativa
          };

          console.debug('[DestaqueComponent] Conteúdo resolvido:', result);
          console.debug(`  - Buscou chaves: ${titleKey}, ${descKey}`);
          
          return result;
        }

        console.warn('[DestaqueComponent] Nenhuma correspondência encontrada para o título:', currentTitle);
        console.warn('[DestaqueComponent] Títulos disponíveis:', titles);
        
        // Fallback: usa o primeiro título se disponível
        if (titles.length > 0) {
          console.debug('[DestaqueComponent] Usando primeiro título como fallback');
          const titleKey = 'content0Title';
          const descKey = 'content0Description';
          
          return {
            title: translations[titleKey] ?? titles[0],
            description: translations[descKey] ?? translations['content0'] ?? ''
          };
        }

        return { title: '', description: '' };
      }),
      startWith({ title: '', description: '' }), // Estado inicial
      takeUntil(this.destroy$)
    );

    // Log adicional para debug
    this.content$.subscribe(content => {
      console.debug('[DestaqueComponent] Conteúdo final emitido:', content);
    });
  }

  ngOnDestroy() {
    console.debug('[DestaqueComponent] Destruindo componente');
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Método auxiliar para debug (opcional)
  debugCurrentState() {
    console.group('[DestaqueComponent] Estado Atual:');
    console.log('Títulos:', this.translationService.getCurrentTitles());
    console.log('Traduções:', this.translationService.getCurrentTranslations());
    console.log('Título do Typewriter:', this.typewriterService.getCurrentTitle?.());
    console.groupEnd();
  }
}