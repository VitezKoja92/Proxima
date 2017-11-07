import { AuthenticationService } from './../../../../services/authentication.service';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { UserAPIService } from './../../../../api/pouchdb-service/user-api.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

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
  });

  // ***** Methods to test: *****
  // - getUsers() - calls the getAllUsers method from UserAPIService - check if it calls that method
  // - login(data: any) - provides AuthenticationService with the data and calls its
  //   login(username, password) method - check if it calls that method

  it('should call getAllUsers method from the UserAPIService', inject([UserAPIService], (UserAPIService: UserAPIService) => {
    spyOn(UserAPIService, 'getAllUsers').and.callThrough();
    component.getUsers();
    expect(UserAPIService.getAllUsers).toHaveBeenCalled();
  }));
});
