import { async, ComponentFixture, TestBed, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { Router } from '@angular/router';

import { SideMenuComponent } from './side-menu.component';
import { AuthenticationService } from '../../../../services/authentication.service';
import { AuthenticationServiceMock } from '../../../../services/authentication.service.mock';
import { UserAPIService } from '../../../../api/pouchdb-service/user-api.service';

describe('SideMenuComponent', () => {
  let component: SideMenuComponent;
  let fixture: ComponentFixture<SideMenuComponent>;
  let routerMock;
  let userAPIServiceStub;
  let authenticationServiceStub;

  beforeEach(async(() => {
    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };
    TestBed.configureTestingModule({
      declarations: [SideMenuComponent],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: AuthenticationService, useClass: AuthenticationServiceMock },
        { provide: ComponentFixtureAutoDetect, useValue: true },
        { provide: UserAPIService, useValue: userAPIServiceStub }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideMenuComponent);
    component = fixture.componentInstance;
    userAPIServiceStub = TestBed.get(UserAPIService);
    authenticationServiceStub = TestBed.get(AuthenticationService);
  });

  it('should open login page when button is clicked', () => {
    component.logout();
    expect(routerMock.navigate).toHaveBeenCalledWith(['login']);
  });

  it('should call logout function from AuthenticationService', () => {
      spyOn(authenticationServiceStub, 'logout').and.callThrough();
      component.logout();
      expect(authenticationServiceStub.logout).toHaveBeenCalled();
    });
});
