import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import { Box, Tab, Tabs, Stack, styled, Typography } from '@mui/material';

import { useAuthContext } from 'src/auth/hooks';

import Iconify from 'src/components/iconify';

// Define tab labels for the main tabs
const TABS = [
  { value: 'one', label: 'Test Case' },
  { value: 'two', label: 'Terminal' },
];

// Custom Tab styling
const CustomTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  minWidth: 0,
  [theme.breakpoints.up('sm')]: { minWidth: 0 },
  fontWeight: theme.typography.fontWeightRegular,
  marginRight: theme.spacing(1),
  color: 'rgba(255, 255, 255, 0.7)',
  '&:hover': { color: '#fff', opacity: 1 },
  '&.Mui-selected': {
    color: '#fff',
    px: 2,
    backgroundColor: theme.palette.grey[500],
    borderRadius: theme.shape.borderRadius,
  },
  '&.MuiTabs-indicator': { display: 'none' },
}));

// Custom Tabs styling
const CustomTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTab-root': {
    margin: '8px 0px',
    marginRight: '8px',
    borderRadius: '6px',
    lineHeight: 0,
    minHeight: 'unset',
    padding: '16px',
    color: 'grey',
    fontWeight: 700,
    transition: 'all 0.3s ease',
  },
  '& .MuiTab-root.Mui-selected': {
    backgroundColor: '#ffffff',
    fontWeight: 700,
    color: 'black',
    transition: 'all 0.3s ease',
  },
  '& .MuiTabs-indicator': { display: 'none' },
}));

export default function LabTestCase({
  testCases,
  currentTab,
  setCurrentTab,
  result,
  isCompileError,
  isTestCaseLoading,
  isTestCaseError,
}) {
  const { user } = useAuthContext();
  const [currentTestCaseTab, setCurrentTestCaseTab] = useState(0);

  const handleChangeTab = useCallback(
    (event, newValue) => {
      setCurrentTab(newValue);
    },
    [setCurrentTab]
  );

  const handleChangeTestCaseTab = useCallback((event, newValue) => {
    setCurrentTestCaseTab(newValue);
  }, []);

  if (isTestCaseLoading) return <div>Loading...</div>;
  if (isTestCaseError) return <div>Error loading test cases.</div>;

  return (
    <>
      <Stack sx={{ px: 2, pb: 1, mb: 1, bgcolor: '#1B212A' }}>
        <Tabs value={currentTab} onChange={handleChangeTab}>
          {TABS.map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </Tabs>
      </Stack>

      {currentTab === 'one' ? (
        <>
          <Stack sx={{ px: 2, pb: 1 }}>
            <CustomTabs value={currentTestCaseTab} onChange={handleChangeTestCaseTab}>
              {testCases.map((_, index) => (
                <CustomTab key={index} value={index} label={`Case ${index + 1}`} />
              ))}
            </CustomTabs>
          </Stack>
          <Stack sx={{ px: 2, pb: 1 }}>
            {testCases.map((testCase, index) => (
              <Box key={testCase.testCaseId}>
                {currentTestCaseTab === index && (
                  <Stack spacing={1}>
                    <Typography variant="subtitle2">Input =</Typography>
                    <Box sx={{ p: 2, borderRadius: 1, bgcolor: '#1B212A' }}>{testCase.input}</Box>
                    <Typography variant="subtitle2">Expected Output =</Typography>
                    <Box sx={{ p: 2, borderRadius: 1, bgcolor: '#1B212A' }}>
                      {testCase.expectedOutput}
                    </Box>
                  </Stack>
                )}
              </Box>
            ))}
          </Stack>
        </>
      ) : (
        currentTab === 'two' && (
          <Stack>
            <Stack sx={{ pt: 1 }} direction="row">
              <Stack
                sx={{ px: 1, backgroundColor: 'primary.main', width: 'fit-content' }}
                direction="row"
                alignItems="center"
              >
                <Iconify icon="quill:folder-open" sx={{ mr: 1 }} />
                <Typography variant="body2">~/{user.userName}@questify</Typography>
              </Stack>
              <Box
                sx={{
                  width: 0,
                  height: 0,
                  borderTop: '12px solid transparent',
                  borderBottom: '12px solid transparent',
                  borderLeft: (theme) => `solid 12px ${theme.palette.primary.main}`,
                }}
              />
            </Stack>
            <Stack sx={{ px: 2, py: 1 }}>
              {result ? (
                result.map((line, i) => (
                  <p key={i} className={`${isCompileError.value ? 'text-red-500' : ''}`}>
                    &gt; {line}
                  </p>
                ))
              ) : (
                <p>&gt;</p>
              )}
            </Stack>
          </Stack>
        )
      )}
    </>
  );
}

LabTestCase.propTypes = {
  testCases: PropTypes.array,
  currentTab: PropTypes.string,
  setCurrentTab: PropTypes.func,
  result: PropTypes.array,
  isCompileError: PropTypes.bool,
  isTestCaseLoading: PropTypes.bool,
  isTestCaseError: PropTypes.bool,
};
