import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { RegisterComponent } from './register.component';
import { MaterialModule } from './../../../material.module';
import { PouchDbBootService } from './../../../../api/pouchdb-service/pouchdb-boot.service';
import { UserAPIService } from './../../../../api/pouchdb-service/user-api.service';
import { User } from '../../../../api/models/index';

describe('RegisterComponent', () => {

  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  let titleDe: DebugElement;
  let titleEl: HTMLElement;

  const data = {
    username: 'username',
    password: 'password',
    name: 'name',
    surname: 'surname',
    email: 'email',
    phoneNr: 'phoneNr'
  };

  class UserAPIServiceMock {
    public addUser() {
      return {
        then: () => null
      };
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: UserAPIService, useClass: UserAPIServiceMock }
      ],
      imports: [ReactiveFormsModule, MaterialModule, RouterTestingModule, BrowserAnimationsModule],
      declarations: [RegisterComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;

    titleDe = fixture.debugElement.query(By.css('h3'));
    titleEl = titleDe.nativeElement;
  });

  afterEach(() => {
    component = null;
  });

  // ***** Methods to test: *****
  // - addUser(data: any) - creates the user and calls the addUser method from UserAPIService - check if it calls that method

  it('should display the title', () => {
    fixture.detectChanges();
    expect(titleEl.textContent).toContain('Register');
  });

  it('should call addUser method from the UserAPIService', inject([UserAPIService], (UserAPIService: UserAPIService) => {
    spyOn(UserAPIService, 'addUser').and.callThrough();
    component.addUser(data);
    expect(UserAPIService.addUser).toHaveBeenCalled();
  }));
});
