import {Pipe, PipeTransform} from '@angular/core';
import {IMaterialRef} from '@app/store/material';

@Pipe({
    name: 'filterVersionUploads',
    pure: false
})
export class FilterVersionUploadsPipe implements PipeTransform {

    transform(value: Array<{
                  material: IMaterialRef,
                  upload: {
                      file: File,
                      progress: number
                  }
              }>, material: IMaterialRef): Array<{
        material: IMaterialRef,
        upload: {
            file: File,
            progress: number
        }
    }> {
        return value.filter(x => x.material.id === material.id);
    }

}
