import type { TableData } from './table';

export interface Space {
  id: string;
  name: string;
  columns: number;
  tables: TableData[];
}
