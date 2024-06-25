import useSWR from 'swr';

import { endpoints, getTestCasesByLaboratoryId } from 'src/utils/axios';

export const useGetTestCasesByLaboratoryId = (laboratoryId) => {
  const { data, error, isLoading, isValidating } = useSWR(
    laboratoryId ? `${endpoints.testCase.getAll}?laboratoryId=${laboratoryId}` : null,
    () => getTestCasesByLaboratoryId(laboratoryId)
  );

  return {
    testCases: data?.data || [],
    isTestCaseLoading: isLoading,
    isTestCaseError: error,
    isValidating,
  };
};
