import { Component, OnInit, Inject } from "@angular/core";
import { Dish } from "../shared/dish";
import { DishService } from "../services/dish.service";
import { baseURL } from "../shared/baseurl";
import { BasePortalOutlet } from "@angular/cdk/portal";
import { flyInOut, expand } from "../animations/app.animation";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.scss"],
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    "[@flyInOut]": "true",
    style: "display: block;",
  },
  animations: [flyInOut(), expand()],
})
export class MenuComponent implements OnInit {
  dishes: Dish[];
  errMess: string;
  baseURL = "http://localhost:3000/";
  constructor(private dishService: DishService) {}

  ngOnInit() {
    this.dishService.getDishes().subscribe(
      (dishes) => (this.dishes = dishes),
      (errmess) => (this.errMess = <any>errmess)
    );
  }
}
