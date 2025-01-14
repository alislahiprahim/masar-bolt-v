import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ToastComponent } from "./components/toast/toast.component";
import { DialogComponent } from "./components/dialog/dialog.component";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, NavbarComponent, FooterComponent, DialogComponent],
  template: `
    <div class="min-h-screen flex flex-col">
      <app-navbar></app-navbar>
      <main class="flex-grow">
        <router-outlet></router-outlet>
      </main>
      @defer(on viewport){
      <app-footer></app-footer>
      }@placeholder {
      <div></div>
      }
    </div>
    <app-dialog></app-dialog>
  `,
})
export class AppComponent {
  title = "TravelPro";
}