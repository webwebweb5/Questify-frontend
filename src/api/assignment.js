import useSWR from 'swr';

import { getAssignments, getAssignmentById } from 'src/utils/axios';

// ----------------------------------------------------------------------

export const useGetAssignments = (classroomId) => {
  const { data, error, isLoading, isValidating } = useSWR(
    classroomId ? `/assignment/classroom?classroomId=${classroomId}` : null,
    () => getAssignments(classroomId)
  );

  return {
    assignments: data?.data || [],
    isLoading,
    isError: error,
    isValidating,
  };
};

// ----------------------------------------------------------------------

export const useGetAssignmentById = (assignmentId) => {
  const { data, error, isLoading, isValidating } = useSWR(
    assignmentId ? `/assignment?assignmentId=${assignmentId}` : null,
    () => getAssignmentById(assignmentId)
  );

  return {
    assignment: data?.data || null,
    isLoading,
    isError: error,
    isValidating,
  };
};

// ----------------------------------------------------------------------
