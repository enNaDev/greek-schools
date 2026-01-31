export interface TableFilterColumn {
  fieldName: string;
  values: string[];
}

export interface TableFiltersState {
  globalSearch: string;
  columns: TableFilterColumn[];
}

export const DEFAULT_TABLE_FILTERS: TableFiltersState = {
  globalSearch: '',
  columns: [],
};
