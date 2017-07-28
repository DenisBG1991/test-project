import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'filterMaterialUploads',
    pure: false
})
export class FilterMaterialUploadsPipe implements PipeTransform {

    transform(value: Array<{
                  location: string,
                  upload: {
                      file: File,
                      progress: number
                  }
              }>, location: string): Array<{
        location: string,
        upload: {
            file: File,
            progress: number
        }
    }> {
        return value.filter(x => x.location === location);
    }

}
