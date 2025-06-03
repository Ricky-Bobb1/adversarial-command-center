
import { useMemo } from 'react';

interface UsePaginationProps<T> {
  data: T[];
  itemsPerPage: number;
  currentPage: number;
}

interface UsePaginationReturn<T> {
  currentData: T[];
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export const usePagination = <T>({
  data,
  itemsPerPage,
  currentPage
}: UsePaginationProps<T>): UsePaginationReturn<T> => {
  return useMemo(() => {
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = data.slice(startIndex, endIndex);

    return {
      currentData,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    };
  }, [data, itemsPerPage, currentPage]);
};
