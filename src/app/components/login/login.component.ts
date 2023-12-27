import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { LoginData } from 'src/app/shared/user-interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isEmailPasswordInvalid = false;
  loginForm!: FormGroup;


  constructor(
    public authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  
  ngOnInit(): void {
    this.initFormGroup();
  }


  initFormGroup() {
    const savedUsername = localStorage.getItem('username');

    this.loginForm = this.formBuilder.group({
      username: [savedUsername || '', Validators.required],
      password: ['', Validators.required],
      rememberMe: [!!savedUsername],
    });
  }


  async onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    await this.performLogin();
  }  


  async performLogin() {
    try {
      const formData = this.loginForm.value;
      let resp: any = await this.authService.login(formData);
      localStorage.setItem('token', resp['token']);
      this.checkRememberMe(formData);
      this.router.navigateByUrl('/summary');
    } catch (err) {
      this.handleLoginError();
    }
  }


  checkRememberMe(formData: LoginData) {
    const username = formData.username;
    if (formData.rememberMe) {
      localStorage.setItem('username', username);
    } else {
      localStorage.removeItem('username');
    }
  }


  handleLoginError() {
    this.isEmailPasswordInvalid = true;
    setTimeout(() => {
      this.isEmailPasswordInvalid = false;
    }, 3000);
  }


}
