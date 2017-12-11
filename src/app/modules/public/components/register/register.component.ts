import { Subscription } from 'rxjs/Subscription';
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';

import { UserAPIService } from '../../../../api/pouchdb-service/user-api.service';
import { User } from '../../../../api/models/index';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent implements OnDestroy {

  form: FormGroup;
  subs: Subscription[] = [];

  constructor(
    private Router: Router,
    private UserAPIService: UserAPIService,
    private FormBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.form = this.FormBuilder.group({
      'username': [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(20)])],
      'password': [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(20)])],
      'name': [null, Validators.required],
      'surname': [null, Validators.required],
      'email': [null, Validators.compose([Validators.required, Validators.email])],
      'phoneNr': [null]
    });
  }

  addUser(data: any) {
    const newUser = new User(data.username, data.password, data.name, data.surname, data.email, data.phoneNr);
    this.subs.push(this.UserAPIService.addUser(newUser)
    .subscribe((id: string): void => {
      // localStorage.setItem('currentUser', id);
      // login
      this.changeDetectorRef.detectChanges();
    }));
  }

  ngOnDestroy(): void {
    this.changeDetectorRef.detach();
    this.subs.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }
}
