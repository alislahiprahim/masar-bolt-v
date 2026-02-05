// generate pipe that binds the env url with the image url
import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment';

@Pipe({ name: 'imgUrl', standalone: true })
export class ImgUrlPipe implements PipeTransform {
  transform(path: string): string {
    // return `${environment.imgUrl}${path}`;
    return path;
  }
}
