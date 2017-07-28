import {Injectable} from '@angular/core';

@Injectable()
export class UploadService {
    /**
     * Загружает файл по указанному URL.
     * Метод вынесен в отдельный сервис, т.к. остальные сервисы являются частью отдельного модуля взаимодействия с API
     * и не используются напрямую в компонентах, в то время как этот используется.
     * @param url
     * @param file
     * @param onProgress
     */
    upload(url: string, file: File, onProgress: (event: any) => void): Promise<any> {
        return new Promise((resolve, reject) => {
            let formData = new FormData();

            formData.append(`attachment`, file, file.name);

            let xhr = new XMLHttpRequest();

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(xhr.response);
                    }
                }
            };

            xhr.upload.onprogress = onProgress;

            xhr.withCredentials = true;
            xhr.open('POST', url, true);
            xhr.send(formData);
        });
    }
}
