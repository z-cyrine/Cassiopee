import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(items: any[], filters: any): any[] {
    if (!items || !filters) {
      return items;
    }

    return items.filter(item => {
      let match = true;

      // Filtrer par affectation
      if (filters.affectation && filters.affectation !== 'Tous' && item.affectation !== filters.affectation) {
        match = false;
      }

      // Filtrer par nom
      if (filters.name && !item.nom.toLowerCase().includes(filters.name.toLowerCase())) {
        match = false;
      }

      // Filtrer par département
      if (filters.dep && filters.dep !== 'Tous' && item.departementRattachement !== filters.dep) {
        match = false;
      }

      return match;
    });
  }
}
