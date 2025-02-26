import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { loginGuard } from "./guards/login.guard";
import { TripResolver } from "./resolvers/trip.resolver";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./pages/home/home.component").then((m) => m.HomeComponent),
  },
  {
    path: "gallery",
    loadComponent: () =>
      import("./pages/gallery/gallery.component").then(
        (m) => m.GalleryComponent
      ),
  },
  {
    path: "trips",
    loadComponent: () =>
      import("./pages/trips/trips.component").then((m) => m.TripsComponent),
    resolve: [TripResolver],
  },
  {
    path: "trips/:id",
    loadComponent: () =>
      import("./pages/trip-details/trip-details.component").then(
        (m) => m.TripDetailsComponent
      ),
  },
  {
    path: "auth/login",
    loadComponent: () =>
      import("./pages/auth/login/login.component").then(
        (m) => m.LoginComponent
      ),
    canActivate: [loginGuard],
  },
  {
    path: "auth/register",
    loadComponent: () =>
      import("./pages/auth/register/register.component").then(
        (m) => m.RegisterComponent
      ),
    canActivate: [loginGuard],
  },
  {
    path: "profile",
    loadComponent: () =>
      import("./pages/profile/profile.component").then(
        (m) => m.ProfileComponent
      ),
    canActivate: [authGuard],
    children: [
      {
        path: "",
        redirectTo: "details",
        pathMatch: "full",
      },
      {
        path: "details",
        loadComponent: () =>
          import(
            "./components/profile/profile-details/profile-details.component"
          ).then((m) => m.ProfileDetailsComponent),
      },
      {
        path: "trips",
        loadComponent: () =>
          import(
            "./components/profile/profile-trips/profile-trips.component"
          ).then((m) => m.ProfileTripsComponent),
      },
      {
        path: "reservations",
        loadComponent: () =>
          import("./pages/reservations/reservations.component").then(
            (m) => m.ReservationsComponent
          ),
      },
      // {
      //   path: "invoices",
      //   loadComponent: () =>
      //     import(
      //       "./components/profile/profile-invoices/profile-invoices.component"
      //     ).then((m) => m.ProfileInvoicesComponent),
      // },
      // {
      //   path: "notifications",
      //   loadComponent: () =>
      //     import(
      //       "./components/profile/profile-notifications/profile-notifications.component"
      //     ).then((m) => m.ProfileNotificationsComponent),
      // },
      {
        path: "**",
        redirectTo: "details",
        pathMatch: "full",
      },
    ],
  },
  {
    path: "bookings",
    loadComponent: () =>
      import("./pages/bookings/bookings.component").then(
        (m) => m.BookingsComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: "reviews",
    loadComponent: () =>
      import("./pages/reviews/reviews.component").then(
        (m) => m.ReviewsComponent
      ),
  },
];