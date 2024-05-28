import useSWR from 'swr';

import { getSubmissionsByLaboratoryId } from 'src/utils/axios';

export const useGetSubmissionsByLaboratoryId = (laboratoryId) => {
  const { data, error, isLoading, isValidating } = useSWR(
    laboratoryId ? `/submission?laboratoryId=${laboratoryId}` : null,
    () => getSubmissionsByLaboratoryId(laboratoryId)
  );

  return {
    submissions: data?.data || [],
    isLoading,
    isError: error,
    isValidating,
  };
};
