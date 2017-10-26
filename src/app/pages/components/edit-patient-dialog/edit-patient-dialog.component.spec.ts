import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPatientDialogComponent } from './edit-patient-dialog.component';

describe('EditPatientDialogComponent', () => {
  let component: EditPatientDialogComponent;
  let fixture: ComponentFixture<EditPatientDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPatientDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPatientDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
