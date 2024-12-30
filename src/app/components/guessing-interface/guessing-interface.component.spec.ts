import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuessingInterfaceComponent } from './guessing-interface.component';

describe('GuessingInterfaceComponent', () => {
  let component: GuessingInterfaceComponent;
  let fixture: ComponentFixture<GuessingInterfaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuessingInterfaceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GuessingInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
