import { Pipe, Injectable, PipeTransform } from '@angular/core';

@Pipe({
    name: 'search'
})

@Injectable()
export class SearchFilterPipe implements PipeTransform {
    transform(categories: any[], searchText: any): any {
        if (searchText == null) { return categories; }
        return categories.filter((category: any) => {
            console.log(category);
          return category.personalInfo.name.toLowerCase().indexOf(searchText.toLowerCase()) > -1 ||
          category.personalInfo.surname.toLowerCase().indexOf(searchText.toLowerCase()) > -1;
        });
      }
}
