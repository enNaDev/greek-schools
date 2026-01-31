import { School } from '../../../services/school-list.service';
import { StepperFilters } from '../models';

// to move them
type SchoolKey = Extract<keyof School, string>;
type GreekLocale = 'el' | 'en';

export function normalize(value: unknown): string {
  return String(value ?? '').trim();
}

export function applyStepperFilters(schools: School[], f: StepperFilters): School[] {
  const regional = f.regionalUnit;
  const municipals = f.municipalUnits;

  if (!regional || municipals.length === 0) {
    return [];
  }

  let list = [...schools].filter((s) => normalize(s.regional_unit) === regional);
  const allowed = new Set(municipals);
  return list.filter((s) => allowed.has(normalize(s.municipal_unit)));
}

export function sanitizeStepperFilters(filters: StepperFilters): StepperFilters {
  const { regionalUnit, municipalUnits } = filters;
  return {
    regionalUnit: regionalUnit || null,
    municipalUnits: Array.isArray(municipalUnits) ? municipalUnits.filter(Boolean) : [],
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

export function pickUniqueSorted(
  list: School[],
  key: SchoolKey,
  locale: GreekLocale = 'el',
): string[] {
  const values = new Set<string>();
  for (const item of list) {
    const v = normalize(item[key]);
    if (v) values.add(v);
  }
  return [...values].sort((a, b) => a.localeCompare(b, locale));
}
