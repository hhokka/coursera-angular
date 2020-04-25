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
  submitFeedback(feedback: Feedback): Observable<Dish> {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
      }),
    };
    return this.http
      .post<Dish>(baseURL + "feedback/" + feedback, httpOptions)
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }
}
