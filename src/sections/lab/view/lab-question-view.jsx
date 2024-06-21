'use client';

import * as Yup from 'yup';
import { mutate } from 'swr';
import { useForm } from 'react-hook-form';
import { useParams } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import { Editor, loader } from '@monaco-editor/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRef, useMemo, useState, useEffect, useCallback } from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import { styled } from '@mui/system';
import { LoadingButton } from '@mui/lab';
import { Box, Tab, Tabs, Stack, alpha, Button, MenuItem, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

import { updateAndExecuteSubmission } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { useGetSubmissionsByLaboratoryId } from 'src/api/submission';

import Iconify from 'src/components/iconify';
import { SplashScreen } from 'src/components/loading-screen';
import FormProvider, { RHFSelect } from 'src/components/hook-form';
import { ResizablePanel, ResizableHandle, ResizablePanelGroup } from 'src/components/ui/resizable';

import LabProblemStatement from '../lab-problem-statement';

// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'one',
    label: 'Test Case',
  },
  {
    value: 'two',
    label: 'Terminal',
  },
];

const TESTCASE_TABS = [
  {
    value: 'one',
    label: 'Case 1',
  },
  {
    value: 'two',
    label: 'Case 2',
  },
  {
    value: 'three',
    label: 'Case 3',
  },
];

// ----------------------------------------------------------------------

// Custom styled Tab component
const CustomTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  minWidth: 0,

  [theme.breakpoints.up('sm')]: {
    minWidth: 0,
  },
  fontWeight: theme.typography.fontWeightRegular,
  marginRight: theme.spacing(1),
  color: 'rgba(255, 255, 255, 0.7)',
  '&:hover': {
    color: '#fff',
    opacity: 1,
  },
  '&.Mui-selected': {
    color: '#fff',
    px: 2,
    backgroundColor: theme.palette.grey[500],
    borderRadius: theme.shape.borderRadius,
  },
  '&.MuiTabs-indicator': {
    display: 'none',
  },
}));

const CustomTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTab-root': {
    margin: '8px 5px 8px 5px',
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
  '& .MuiTabs-indicator': {
    display: 'none', // Hide the indicator
  },
}));

const CustomResizablePanel = styled(ResizablePanel)(({ theme }) => ({
  borderRadius: 8,
  bgcolor: alpha(theme.palette.grey[500], 0.04),
  border: `dashed 1px ${theme.palette.divider}`,
}));

// ----------------------------------------------------------------------

export default function LabQuestionView() {
  const params = useParams();
  const editorRef = useRef(null);

  const { user } = useAuthContext();

  const lgUp = useResponsive('up', 'lg');

  const panelRef = useRef(null);

  const { submissions, isLoading } = useGetSubmissionsByLaboratoryId(params.lid);

  const loading = useBoolean(false);

  const [result, setResult] = useState(null);

  const isError = useBoolean(false);

  const [currentLanguage, setCurrentLanguage] = useState('JavaScript');

  const [currentTab, setCurrentTab] = useState('one');
  const [currentTestCaseTab, setCurrentTestCaseTab] = useState('one');

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);
  const handleChangeTestCaseTab = useCallback((event, newValue) => {
    setCurrentTestCaseTab(newValue);
  }, []);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleEditorChange = (value, event) => {
    console.log('here is the current model value:', value);
  };

  const collapsePanel = () => {
    const panel = panelRef.current;
    if (panel) {
      panel.collapse();
    }
  };

  const handleExecute = async () => {
    const code = editorRef?.current?.getValue();
    loading.onTrue();
    try {
      const response = await updateAndExecuteSubmission(params.lid, currentLanguage, code);
      const filteredOutput = response.data.output.split('\n').filter((line) => line.trim() !== '');
      setResult(filteredOutput);
      enqueueSnackbar(`${response.message}`, { variant: 'success' });
      // eslint-disable-next-line no-unused-expressions
      response.data.stdErr ? isError.onTrue() : isError.onFalse();
      setCurrentTab('two');
    } catch (error) {
      console.error(error);
      enqueueSnackbar(`${error.message}`, { variant: 'error' });
    } finally {
      loading.onFalse();
    }
  };

  const ChangeLanguageSchema = Yup.object().shape({
    language: Yup.string()
      .required('language is required')
      .oneOf(['Java', 'JavaScript', 'Python', 'C'], 'Invalid language'),
  });

  const defaultValues = useMemo(
    () => ({
      language: '',
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(ChangeLanguageSchema),
    defaultValues,
  });

  const { reset } = methods;

  const handleLanguageChange = (e) => {
    setCurrentLanguage(e.target.value);
  };

  useEffect(() => {
    if (currentLanguage) {
      reset({
        language: currentLanguage,
      });
      mutate(`/submission?laboratoryId=${params.lid}`);
    }
  }, [currentLanguage, params.lid, reset]);

  loader.init().then((monaco) => {
    monaco.editor.defineTheme('myTheme', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#1B212A',
      },
    });
  });

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Box
      sx={{
        height: 'calc(100vh - 64px)',
        p: 2,
        ...(!lgUp && {
          p: 0,
          px: 1,
          pb: 1,
        }),
      }}
    >
      <ResizablePanelGroup direction="horizontal" className="gap-2">
        <CustomResizablePanel
          defaultSize={40}
          collapsedSize={0}
          collapsible
          minSize={5}
          className="bg-[#1B212A]"
          ref={panelRef}
        >
          <LabProblemStatement submissions={submissions} />
        </CustomResizablePanel>
        <ResizableHandle withHandle onDoubleClick={collapsePanel} />
        <ResizablePanel defaultSize={60}>
          <ResizablePanelGroup direction="vertical" className="gap-2">
            <CustomResizablePanel defaultSize={60} className="bg-[#1B212A]">
              <Stack sx={{ height: '100%', position: 'relative' }}>
                <FormProvider methods={methods}>
                  <Stack sx={{ width: 'fit-content', mb: 1, minWidth: 112 }}>
                    <RHFSelect name="language" onChange={handleLanguageChange}>
                      <MenuItem value="JavaScript">JavaScript</MenuItem>
                      <MenuItem value="Java">Java</MenuItem>
                      <MenuItem value="Python">Python</MenuItem>
                      <MenuItem value="C">C</MenuItem>
                    </RHFSelect>
                  </Stack>
                </FormProvider>
                <Editor
                  options={{
                    minimap: {
                      enabled: false,
                    },
                    lineDecorationsWidth: 0,
                    lineNumbersMinChars: 3,
                    wordWrap: 'on',
                  }}
                  theme="myTheme"
                  defaultLanguage={currentLanguage.toLowerCase()}
                  defaultValue={submissions?.codeSnippets?.JavaScript || ''}
                  language={currentLanguage.toLowerCase()}
                  value={submissions?.codeSnippets?.[currentLanguage]}
                  onMount={handleEditorDidMount}
                  onChange={handleEditorChange}
                />
                <Stack
                  spacing={2}
                  direction="row"
                  sx={{
                    position: 'absolute',
                    bottom: 16,
                    right: 18,
                  }}
                >
                  <LoadingButton
                    variant="outlined"
                    onClick={handleExecute}
                    startIcon={<Iconify icon="carbon:play-filled-alt" />}
                    loading={loading.value}
                  >
                    Run
                  </LoadingButton>
                  <Button
                    variant="contained"
                    href={paths.lab.result(submissions?.laboratory?.laboratoryId)}
                  >
                    Submit
                  </Button>
                </Stack>
              </Stack>
            </CustomResizablePanel>
            <ResizableHandle withHandle />
            {/* 292A35 */}
            <CustomResizablePanel defaultSize={40} className="bg-[#1c1d24] !overflow-auto">
              <Stack sx={{ px: 2, pb: 1, mb: 1, bgcolor: '#1B212A' }}>
                <Tabs value={currentTab} onChange={handleChangeTab}>
                  {TABS.slice(0, 3).map((tab) => (
                    <Tab key={tab.value} value={tab.value} label={tab.label} />
                  ))}
                </Tabs>
              </Stack>
              {currentTab === 'one' ? (
                <>
                  <Stack sx={{ px: 2, pb: 1 }}>
                    <CustomTabs value={currentTestCaseTab} onChange={handleChangeTestCaseTab}>
                      {TESTCASE_TABS.map((tab) => (
                        <CustomTab key={tab.value} value={tab.value} label={tab.label} />
                      ))}
                    </CustomTabs>
                  </Stack>
                  <Stack sx={{ px: 2, pb: 1 }}>
                    {currentTestCaseTab === 'one' && (
                      <Stack spacing={1}>
                        <Typography variant="subtitle2">nums =</Typography>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 1,
                            bgcolor: '#1B212A',
                          }}
                        >
                          [2, 7, 11, 15]
                        </Box>
                        <Typography variant="subtitle2">target =</Typography>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 1,
                            bgcolor: '#1B212A',
                          }}
                        >
                          9
                        </Box>
                      </Stack>
                    )}
                    {currentTestCaseTab === 'two' && (
                      <Stack spacing={1}>
                        <Typography variant="subtitle2">nums =</Typography>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 1,
                            bgcolor: '#1B212A',
                          }}
                        >
                          [3, 2, 4]
                        </Box>
                        <Typography variant="subtitle2">target =</Typography>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 1,
                            bgcolor: '#1B212A',
                          }}
                        >
                          6
                        </Box>
                      </Stack>
                    )}
                    {currentTestCaseTab === 'three' && (
                      <Stack spacing={1}>
                        <Typography variant="subtitle2">nums =</Typography>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 1,
                            bgcolor: '#1B212A',
                          }}
                        >
                          [3, 3, 7, 8]
                        </Box>
                        <Typography variant="subtitle2">target =</Typography>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 1,
                            bgcolor: '#1B212A',
                          }}
                        >
                          10
                        </Box>
                      </Stack>
                    )}
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
                          <p key={i} className={`${isError.value ? 'text-red-500' : ''}`}>
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
            </CustomResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </Box>
  );
}
