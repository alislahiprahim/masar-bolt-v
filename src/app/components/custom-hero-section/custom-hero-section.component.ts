import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-custom-hero-section',
  imports: [],
  template: `
    <div class="relative h-[60vh] min-h-[400px] overflow-hidden">
      <!-- Background Image -->
      <div class="absolute inset-0">
        <img [src]="bannerImg()" [alt]="title()" class="w-full h-full object-cover" />
        <!-- Overlay -->
        <div
          class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent"></div>
      </div>

      <!-- Hero Content -->
      <div
        class="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center text-center">
        <h1 class="text-5xl md:text-6xl font-bold text-white mb-6 animate-float font-poppins">
          {{ title() }}
        </h1>
        <p class="text-xl text-white/90 max-w-2xl">
          {{ subTitle() }}
        </p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomHeroSectionComponent {
  bannerImg = input('https://images.unsplash.com/photo-1488085061387-422e29b40080');
  title = input('');
  subTitle = input('');
}
