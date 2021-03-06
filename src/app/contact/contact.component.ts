import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { Feedback, ContactType } from "../shared/feedback";
import { FeedbackService } from "../services/feedback.service";
import { visibility } from "../animations/app.animation";

@Component({
  selector: "app-contact",
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.scss"],
  animations: [visibility()],
})
export class ContactComponent implements OnInit {
  feedbackForm: FormGroup;
  feedback: Feedback;
  /* contactType: ContactType; */
  feedbackcopy: Feedback;
  errMess: string;
  hideMatSpinner: boolean;
  hideData: boolean;

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
  constructor(
    private fb: FormBuilder,
    private feedbackService: FeedbackService
  ) {
    this.createForm();
  }
  visibility = "shown";

  ngOnInit() {}

  createForm() {
    this.hideData=true;
    this.hideMatSpinner=true;
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
    setTimeout(() => this.hideData = true),5000);
    this.hideMatSpinner = false;
    this.feedback = this.feedbackForm.value;
    console.log(this.feedback);
    this.feedbackcopy = {
      firstname: this.feedbackForm.value.firstname,
      lastname: this.feedbackForm.value.lastname,
      telnum: this.feedbackForm.value.telnum,
      email: this.feedbackForm.value.email,
      agree: this.feedbackForm.value.agree,
      contacttype: this.feedbackForm.value.contacttype,
      message: this.feedbackForm.value.message,
    };
    this.visibility = "hidden";
    this.feedbackService.submitFeedback(this.feedbackcopy).subscribe(
      (feedback) => {
        /* this.feedback = feedback;
        this.feedbackcopy = feedback; */
       /*  alert("this.visibility shown"); */
        this.hideMatSpinner = true;
        this.hideData = false;
        setTimeout(() => (this.visibility = "shown",this.hideData=true), 5000);
      },
      (errmess) => {
        this.feedback = null;
        this.feedbackcopy = null;
        this.errMess = <any>errmess;
        alert("errmess on contact");
      }
    );
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
}
