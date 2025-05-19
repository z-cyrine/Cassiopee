import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatName',
  standalone: true
})
export class FormatNamePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';
    
    // Supprime les espaces au début et à la fin
    let formatted = value.trim();
    
    // Met la première lettre en majuscule et le reste en minuscules
    formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1).toLowerCase();
    
    // Gère les noms composés (ex: Jean-Pierre, Marie-Claire)
    formatted = formatted.replace(/-([a-z])/g, (match, letter) => '-' + letter.toUpperCase());
    
    // Gère les espaces multiples
    formatted = formatted.replace(/\s+/g, ' ');
    
    return formatted;
  }
} 