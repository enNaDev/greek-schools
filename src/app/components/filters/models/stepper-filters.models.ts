
export interface StepperFilters {
  regionalUnit: string | null;
  municipalUnits: string[];
}

export const DEFAULT_STEPPER_FILTERS: StepperFilters = {
  regionalUnit: null,
  municipalUnits: [],
};
