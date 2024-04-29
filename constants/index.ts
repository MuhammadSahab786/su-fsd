import { SortByType } from '@/interfaces';

export const CREATED_AT = 'createdAt';
export const FILE_NAME_ASC = 'fileNameAsc';
export const FILE_NAME_DESC = 'fileNameDes';

export const DROPDOWN_OPTIONS: { label: string; value: SortByType }[] = [
  {
    label: 'Created At',
    value: CREATED_AT,
  },
  {
    label: 'File Name Ascending',
    value: FILE_NAME_ASC,
  },
  {
    label: 'File Name Descending',
    value: FILE_NAME_DESC,
  },
];
