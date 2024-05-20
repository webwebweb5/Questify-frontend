import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetClassroom() {
  const URL = endpoints.classroom.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      classroom: data?.data || [],
      classroomLoading: isLoading,
      classroomError: error,
      classroomValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetClassroomById(classroomId) {
  const URL = classroomId ? [endpoints.classroom.details, { params: { classroomId } }] : '';

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      classroom: data?.data || {},
      classroomLoading: isLoading,
      classroomError: error,
      classroomValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------
