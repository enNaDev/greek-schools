import { StepperFilters } from '../models';
import { applyStepperFilters } from './stepper-filters.utils';

describe('applyStepperFilters', () => {
  const schools: any[] = [
    { regional_unit: 'Α', municipal_unit: 'Μ1', name: 's1' },
    { regional_unit: 'Α', municipal_unit: 'Μ2', name: 's2' },
    { regional_unit: 'Β', municipal_unit: 'Μ3', name: 's3' },
  ];

  it('returns all when no filters', () => {
    const f: StepperFilters = { regionalUnit: null, municipalUnits: [] };
    expect(applyStepperFilters(schools as any, f).length).toBe(3);
  });

  it('filters by regional unit', () => {
    const f: StepperFilters = { regionalUnit: 'Α', municipalUnits: [] };
    expect(applyStepperFilters(schools as any, f).map((s) => s.school_name)).toEqual(['s1', 's2']);
  });

  it('filters by municipal units after regional', () => {
    const f: StepperFilters = { regionalUnit: 'Α', municipalUnits: ['Μ2'] };
    expect(applyStepperFilters(schools as any, f).map((s) => s.school_name)).toEqual(['s2']);
  });
});
