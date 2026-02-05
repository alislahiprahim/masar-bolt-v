import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-breadcrump',
  template: `
    <ol class="flex">
      <li class="mr-1">
        <a [routerLink]="['/']" class="text-primary">
          {{ 'nav.home' | translate }}
        </a>
        <span class="mx-1 text-gray-500">/</span>
      </li>
      <li class="mr-1">
        <a [routerLink]="['/trips']" class="text-primary">
          {{ 'nav.trips' | translate }}
        </a>
        <span class="mx-1 text-gray-500">/</span>
      </li>
      <li>
        {{ tripName() }}
      </li>
    </ol>
  `,
  imports: [RouterLink, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumpComponent {
  tripName = input<string>();
}
