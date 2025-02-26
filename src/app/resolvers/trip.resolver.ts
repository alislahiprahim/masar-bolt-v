// resolver for trips page to load trips depending on the filters of query params
import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from "@angular/router";
import { TripsStateService } from "../state/trips.state";

@Injectable({
  providedIn: "root",
})
export class TripResolver implements Resolve<void> {
  constructor(private tripsStateService: TripsStateService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): void {
    const search = route.queryParams["search"];
    const cityId = route.queryParams["cityId"];
    const minPrice = route.queryParams["minPrice"];
    const maxPrice = route.queryParams["maxPrice"];
    const sortBy = route.queryParams["sortBy"];
    const sortOrder = route.queryParams["sortOrder"];

    this.tripsStateService.updateFilters({
      search,
      cityId,
      minPrice,
      maxPrice,
      sortBy,
      sortOrder,
    });
  }
}
