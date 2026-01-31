import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterSummaryComponent } from './filter-summary.component';


describe('FilterSummaryComponent', () => {
  let component: FilterSummaryComponent;
  let fixture: ComponentFixture<FilterSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterSummaryComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
