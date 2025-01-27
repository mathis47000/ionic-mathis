
import { Pipe, PipeTransform } from '@angular/core';



@Pipe({

  name: 'dateDiff'

})

export class DateDiffPipe implements PipeTransform {

    transform(dueDate: any): string {
        const date = dueDate instanceof Date ? dueDate : new Date(dueDate);
        const diff = date.getTime() - new Date().getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        const hours = Math.ceil(diff / (1000 * 60 * 60));
        const minutes = Math.ceil(diff / (1000 * 60));
        console.log(days, hours, minutes);
        return days > 1 ? `${days} j` : 
        hours < 24 && hours > 1 ? `${hours} h` : 
        minutes < 60 && minutes > 0 ?`${minutes} m`: 
        `${days} j`;
      }
}