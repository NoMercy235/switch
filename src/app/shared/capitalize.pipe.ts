import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'swCapitalize'
})
export class CapitalizePipe implements PipeTransform {

    transform(value: string, args: any[]): string {
        if (value === null) return '';
        return value.charAt(0).toUpperCase() + value.slice(1);
    }

}
