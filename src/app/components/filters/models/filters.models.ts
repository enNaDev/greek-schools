import { StepperFilters, DEFAULT_STEPPER_FILTERS } from './stepper-filters.models';
import { TableFilters, DEFAULT_TABLE_FILTERS } from './table-filters.models';

export interface Filters {
  tableFilters: TableFilters;
  stepperFilters: StepperFilters;
}

export const DEFAULT_FILTERS: Filters = {
  tableFilters: DEFAULT_TABLE_FILTERS,
  stepperFilters: DEFAULT_STEPPER_FILTERS,
};
