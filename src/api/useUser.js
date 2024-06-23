import useSWR from 'swr';

import { endpoints, getStudentsByAssignmentId } from 'src/utils/axios';

export const useGetStudentsByAssignmentId = (assignmentId) => {
  const { data, error, isLoading, isValidating } = useSWR(
    assignmentId ? `${endpoints.user.student}?assignmentId=${assignmentId}` : null,
    () => getStudentsByAssignmentId(assignmentId)
  );

  return {
    students: data?.data || [],
    isLoading,
    isError: error,
    isValidating,
  };
};
