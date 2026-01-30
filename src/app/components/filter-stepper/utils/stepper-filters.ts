import { School } from "../../../services/school-list.service";

export interface StepperFilters {
  regionalUnit: string | null;
  municipalUnits: string[];
}

export const DEFAULT_STEPPER_FILTERS: StepperFilters = {
  regionalUnit: null,
  municipalUnits: [],
};

export function normalize(value: unknown): string {
  return String(value ?? '').trim();
}

export function applyStepperFilters(schools: School[], f: StepperFilters): School[] {
  const regional = f.regionalUnit;
  const municipals = f.municipalUnits;

  if (!regional || municipals.length === 0) {
    return [];
  }

  let list = schools;
  list = list.filter((s) => normalize(s.regional_unit) === regional);
  const allowed = new Set(municipals);
  list = list.filter((s) => allowed.has(normalize(s.municipal_unit)));

  return list;
}

export function sanitizeStepperFilters(f: StepperFilters): StepperFilters {
  return {
    regionalUnit: f.regionalUnit ? f.regionalUnit : null,
    municipalUnits: Array.isArray(f.municipalUnits) ? f.municipalUnits.filter(Boolean) : [],
  };
}

/**
 * If regionalUnit is cleared, municipalUnits must also be cleared.
 */
export function cascadeStepperFilters(prev: StepperFilters, next: StepperFilters): StepperFilters {
  const prevRegional = prev.regionalUnit;
  const nextRegional = next.regionalUnit;

  if (prevRegional && !nextRegional) {
    return { ...next, municipalUnits: [] };
  }

  return next;
}
