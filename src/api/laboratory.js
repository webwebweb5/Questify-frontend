import useSWR from 'swr';

import { endpoints, getLaboratoryById, getLaboratoriesByAssignmentId } from 'src/utils/axios';

// ----------------------------------------------------------------------

export const useGetLaboratoriesByAssignmentId = (assignmentId) => {
  const { data, error, isLoading, isValidating } = useSWR(
    assignmentId ? `${endpoints.lab.crud}/assignment?assignmentId=${assignmentId}` : null,
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

export const useGetLaboratoryById = (laboratoryId) => {
  const { data, error, isLoading, isValidating } = useSWR(
    laboratoryId ? `${endpoints.lab.crud}?laboratoryId=${laboratoryId}` : null,
    () => getLaboratoryById(laboratoryId)
  );

  return {
    laboratory: data?.data || null,
    isLoading,
    isError: error,
    isValidating,
  };
};

// ----------------------------------------------------------------------
