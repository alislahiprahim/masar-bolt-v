import { Component, inject, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { FooterComponent } from "./components/footer/footer.component";
import { ToastComponent } from "./components/toast/toast.component";
import { DialogComponent } from "./components/dialog/dialog.component";
import { SecondaryNavbarComponent } from "./components/secondary-navbar/secondary-navbar.component";
import { CitiesService } from "./services/cities.service";
@Component({
  selector: "app-root",
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    DialogComponent,
    ToastComponent,
    SecondaryNavbarComponent,
  ],
  template: `
    <div class="min-h-screen flex flex-col">
      <div class="fixed top-0 left-0 right-0 z-50">
        <app-secondary-navbar />
        <app-navbar />
      </div>
      <div class="h-[6.5rem]"></div>
      <main class="flex-grow">
        <router-outlet></router-outlet>
      </main>
      @defer(on viewport){
      <app-footer />
      }@placeholder {
      <div></div>
      }
    </div>
    <app-dialog />
    <app-toast />
  `,
})
export class AppComponent implements OnInit {
  title = "TravelPro";
  protected citiesService = inject(CitiesService);
  ngOnInit() {
    this.citiesService.loadDestinations();
  }
}
