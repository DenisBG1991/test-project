import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
    transform(value: string, length?: number, endWith?: string): string {
        const limit = length || 20;
        const trail = endWith || '...';
        if (!value) {
            value = '';
        }
        return value.length > limit ? value.substring(0, limit) + trail : value;
    }
}
