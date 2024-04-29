import { CREATED_AT, FILE_NAME_ASC, FILE_NAME_DESC } from '@/constants';

export interface IFilePayload {
  createdAt: string;
  fileName: string;
}

interface DropdownItemProps {
  label: string;
  value: SortByType;
}

export interface DropdownProps {
  buttonLabel: string;
  items: DropdownItemProps[];
  selectedValue: SortByType | '';
  onClick: (term: SortByType) => Promise<void>;
}

export type SortByType =
  | typeof CREATED_AT
  | typeof FILE_NAME_ASC
  | typeof FILE_NAME_DESC;

export interface IResponse<T> {
  status: boolean;
  data: T;
  message: string;
}
