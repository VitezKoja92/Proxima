import { AuthenticationService } from './../../../../services/authentication.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { UserAPIService } from './../../../../api/pouchdb-service/user-api.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let userAPIServiceStub;

  class UserAPIServiceMock {
    public getAllUsers() {
      return {
        then: () => null
      };
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: UserAPIService, useClass: UserAPIServiceMock},
        AuthenticationService
      ],
      imports: [ReactiveFormsModule, MaterialModule, RouterTestingModule, BrowserAnimationsModule],
      declarations: [ LoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    userAPIServiceStub = TestBed.get(UserAPIService);
  });

  afterEach(() => {
    component = null;
  });
});
