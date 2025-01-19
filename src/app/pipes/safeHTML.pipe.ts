import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safeHTML',
  standalone: true,
})
export class SafeHTMLPipe implements PipeTransform {
  #sanitizer = inject(DomSanitizer);
  transform(value: any) {
    return this.#sanitizer.bypassSecurityTrustHtml(value);
  }
}
