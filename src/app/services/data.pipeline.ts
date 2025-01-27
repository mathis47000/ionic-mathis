
import { Pipe, PipeTransform } from '@angular/core';



@Pipe({

  name: 'dateDiff'

})

export class DateDiffPipe implements PipeTransform {

    transform(dueDate: any): string {
        const date = dueDate instanceof Date ? dueDate : new Date(dueDate);
        const diff = date.getTime() - new Date().getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days > 0 ? `${days} j` : 'Expirée';
      }
}