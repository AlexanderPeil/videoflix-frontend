import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  userAlreadyExists = false;
  signUpForm!: FormGroup;
  submitted = false;
  signedUpInfo!: boolean;
  isButtonDisabled = false;


  constructor(
    public authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }


  ngOnInit() {
    this.initFormGroup();
  }


  initFormGroup() {
    this.signUpForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['']
    }, { validators: this.checkPasswords } as AbstractControlOptions);
  }


  checkPasswords(group: FormGroup): ValidationErrors | null {
    if (!group) {
      return null;
    }

    let pass = group.get('password')?.value;
    let confirmPass = group.get('confirmPassword')?.value;
    return pass === confirmPass ? null : { notSame: true }
  }


  async onSubmit() {
    this.submitted = true;

    if (this.signUpForm.invalid) {
      return;
    }
    await this.performSignup();
  }


  async performSignup() {
    try {
      const formData = this.signUpForm.value;
      let resp: any = await this.authService.signup(formData);
      localStorage.setItem('token', resp.token);
      this.signedUpInfo = true;
      this.isButtonDisabled = true;
      setTimeout(() => {
        this.router.navigateByUrl('/browse');
      }, 3000);
    } catch (err) {
      this.handlySignUpError();
    }
  }


  handlySignUpError() {
    this.userAlreadyExists = true;
    setTimeout(() => {
      this.userAlreadyExists = false;
    }, 3000);
  }

}
