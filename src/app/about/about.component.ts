import { Component, OnInit } from "@angular/core";
import { Leader } from "../shared/leader";
import { LeaderService } from "../services/leader.service";
import { Params, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { flyInOut, expand } from "../animations/app.animation";

@Component({
  selector: "app-about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.scss"],
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    "[@flyInOut]": "true",
    style: "display: block;",
  },
  animations: [flyInOut()],
})
export class AboutComponent implements OnInit {
  leaders: Leader[];
  leaderErrMess: string;
  constructor(private leaderService: LeaderService) {}

  ngOnInit() {
    this.leaderService.getLeaders().subscribe(
      (leaders) => (this.leaders = leaders),
      (errmess) => (this.leaderErrMess = <any>errmess)
    );
  }
}
