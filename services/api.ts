import { SortByType } from '@/interfaces';

export const fetchOptions = {
  headers: {
    'Content-Type': 'application/json',
  },
};

export async function fetchSortedData(sortBy?: SortByType) {
  const queryParams = sortBy ? `?sortBy=${sortBy}` : '';
  const response = await fetch(`/api${queryParams}`, {
    ...fetchOptions,
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

export async function fetchSortedDataServer(sortBy?: SortByType) {
  const queryParams = sortBy ? `?sortBy=${sortBy}` : '';
  const response = await fetch(`${process.env.URL}/api${queryParams}`, {
    ...fetchOptions,
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}
