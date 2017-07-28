import {Pipe, PipeTransform} from '@angular/core';
import {MultilingualTextDto} from '@app/shared/api';
import {MultilingualService} from '@app/presentation/localization/multilingual.service';

@Pipe({name: 'multilingual', pure: false})
export class MultilingualPipe implements PipeTransform {
    constructor(private multilingualService: MultilingualService) {
    }

    transform(value: MultilingualTextDto, lang: string): string {
        return this.multilingualService.getTranslation(value, lang);
    }
}
