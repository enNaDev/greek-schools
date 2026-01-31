export interface TableFilterColumn {
  fieldName: string;
  values: string[];
}

export interface TableFilters {
  globalSearch: string;
  columns: TableFilterColumn[];
}

export const DEFAULT_TABLE_FILTERS: TableFilters = {
  globalSearch: '',
  columns: [],
};
