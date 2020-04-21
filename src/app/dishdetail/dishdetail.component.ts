import { Component, OnInit, Input } from "@angular/core";
import { Dish } from "../shared/dish";
import { DishService } from "../services/dish.service";
import { Params, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { switchMap } from "rxjs/operators";
import { ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { Feedback, ContactType } from "../shared/feedback";

@Component({
  selector: "app-dishdetail",
  templateUrl: "./dishdetail.component.html",
  styleUrls: ["./dishdetail.component.scss"],
})
export class DishdetailComponent implements OnInit {
  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;

  constructor(
    private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder
  ) {
    this.createForm();
  }
  feedbackForm: FormGroup;
  feedback: Feedback;
  contactType = ContactType;
  @ViewChild("fform") feedbackFormDirective;

  formErrors = {
    firstname: "",
    lastname: "",
    telnum: "",
    email: "",
  };

  validationMessages = {
    firstname: {
      required: "First Name is required.",
      minlength: "First Name must be at least 2 characters long.",
      maxlength: "FirstName cannot be more than 25 characters long.",
    },
    lastname: {
      required: "Last Name is required.",
      minlength: "Last Name must be at least 2 characters long.",
      maxlength: "Last Name cannot be more than 25 characters long.",
    },
    telnum: {
      required: "Tel. number is required.",
      pattern: "Tel. number must contain only numbers.",
    },
    email: {
      required: "Email is required.",
      email: "Email not in valid format.",
    },
  };

  createForm() {
    this.feedbackForm = this.fb.group({
      firstname: [
        "",
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(25),
        ],
      ],
      lastname: [
        "",
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(25),
        ],
      ],
      telnum: ["", [Validators.required, Validators.pattern]],
      email: ["", [Validators.required, Validators.email]],
      agree: false,
      contacttype: "None",
      message: "",
    });
    this.feedbackForm.valueChanges.subscribe((data) =>
      this.onValueChanged(data)
    );
    this.onValueChanged();
  }
  onValueChanged(data?: any) {
    if (!this.feedbackForm) {
      return;
    }
    const form = this.feedbackForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = "";
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + " ";
            }
          }
        }
      }
    }
  }
  onSubmit() {
    this.feedback = this.feedbackForm.value;
    console.log(this.feedback);
    this.feedbackForm.reset({
      firstname: "",
      lastname: "",
      telnum: "",
      email: "",
      agree: false,
      contacttype: "None",
      message: "",
    });
    this.feedbackFormDirective.resetForm();
  }
  ngOnInit() {
    this.dishservice
      .getDishIds()
      .subscribe((dishIds) => (this.dishIds = dishIds));
    this.route.params
      .pipe(
        switchMap((params: Params) => this.dishservice.getDish(params["id"]))
      )
      .subscribe((dish) => {
        this.dish = dish;
        this.setPrevNext(dish.id);
      });
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[
      (this.dishIds.length + index - 1) % this.dishIds.length
    ];
    this.next = this.dishIds[
      (this.dishIds.length + index + 1) % this.dishIds.length
    ];
  }

  goBack(): void {
    this.location.back();
  }
}
