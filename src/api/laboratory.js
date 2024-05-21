import useSWR from 'swr';

import { getLaboratoriesByAssignmentId } from 'src/utils/axios';

// ----------------------------------------------------------------------

export const useGetLaboratoriesByAssignmentId = (assignmentId) => {
  const { data, error, isLoading, isValidating } = useSWR(
    assignmentId ? `/laboratory/assignment?assignmentId=${assignmentId}` : null,
    () => getLaboratoriesByAssignmentId(assignmentId)
  );

  return {
    laboratories: data?.data || [],
    isLoading,
    isError: error,
    isValidating,
  };
};

// ----------------------------------------------------------------------
