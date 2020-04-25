import { Injectable } from "@angular/core";
import { Dish } from "../shared/dish";
import { Observable, of } from "rxjs";
import { delay } from "rxjs/operators";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { baseURL } from "../shared/baseurl";
import { map, catchError } from "rxjs/operators";
import { ProcessHTTPMsgService } from "./process-httpmsg.service";
import { Feedback } from "../shared/feedback";

@Injectable({
  providedIn: "root",
})
export class FeedbackService {
  constructor(
    private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService
  ) {}
  feedback: Feedback;
  /* feedbackcopy = {
    firstname: "hans",
    lastname: "hokka",
    telnum: 1234,
    email: "hans.hokka@gmail.com",
    agree: true,
    contacttype: "Tel",
    message: "message here",
  }; */
  submitFeedback(feedback: Feedback): Observable<Dish> {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
    alert("In feedbackService");
    return this.http
      .post<Dish>(baseURL + "feedback/", feedback, httpOptions)
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }
}
