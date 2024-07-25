'use client';

import * as Yup from 'yup';
import { mutate } from 'swr';
import { useForm } from 'react-hook-form';
import { useParams } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import { Editor, loader } from '@monaco-editor/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRef, useMemo, useState, useEffect } from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import { styled } from '@mui/system';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Stack,
  alpha,
  Button,
  Tooltip,
  MenuItem,
  IconButton,
  Typography,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

import { updateSubmission, updateAndExecuteSubmission } from 'src/utils/axios';

import { useGetSubmissionsByLaboratoryId } from 'src/api/submission';
import { useGetTestCasesByLaboratoryId } from 'src/api/useTestCases';

import Iconify from 'src/components/iconify';
import { SplashScreen } from 'src/components/loading-screen';
import FormProvider, { RHFSelect } from 'src/components/hook-form';
import { ResizablePanel, ResizableHandle, ResizablePanelGroup } from 'src/components/ui/resizable';

import LabTestCase from '../lab-testcase';
import LabProblemStatement from '../lab-problem-statement';

// ----------------------------------------------------------------------

const CustomResizablePanel = styled(ResizablePanel)(({ theme }) => ({
  borderRadius: 8,
  bgcolor: alpha(theme.palette.grey[500], 0.04),
  border: `dashed 1px ${theme.palette.divider}`,
}));

// ----------------------------------------------------------------------

export default function LabQuestionView() {
  const params = useParams();
  const editorRef = useRef(null);

  const lgUp = useResponsive('up', 'lg');

  const panelRef = useRef(null);

  const { submissions, isLoading } = useGetSubmissionsByLaboratoryId(params.lid);

  const loading = useBoolean(false);

  const [results, setResults] = useState([]);
  const [comparedResults, setComparedResults] = useState([]);

  const isError = useBoolean(false);

  const [currentLanguage, setCurrentLanguage] = useState('Java');

  const [currentTab, setCurrentTab] = useState('one');

  const { testCases, isTestCaseLoading, isTestCaseError } = useGetTestCasesByLaboratoryId(
    params.lid
  );

  const [errorMessage, setErrorMessage] = useState('');

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleEditorChange = (value, event) => {
    if (value.length > 3000) {
      setErrorMessage('Code cannot exceed 3000 characters');
    } else {
      setErrorMessage('');
    }
  };

  const collapsePanel = () => {
    const panel = panelRef.current;
    if (panel) {
      panel.collapse();
    }
  };

  const handleExecute = async () => {
    const code = editorRef?.current?.getValue();
    if (code.length > 3000) {
      enqueueSnackbar('Code cannot exceed 3000 characters', { variant: 'error' });
      return;
    }

    loading.onTrue();
    setResults([]);
    setComparedResults([]);

    try {
      await updateSubmission(params.lid, currentLanguage, code);

      const newResults = [];
      let alert = '';
      // eslint-disable-next-line no-restricted-syntax
      for (const testCase of testCases) {
        // eslint-disable-next-line no-await-in-loop
        const response = await updateAndExecuteSubmission(
          params.lid,
          testCase.testCaseId,
          currentLanguage,
          code
        );
        alert = response.message;
        newResults.push(response.data.output.trim());
      }

      setResults(newResults);

      const comparisonResults = newResults.map((output, index) => ({
        testCaseId: testCases[index].testCaseId,
        input: testCases[index].input,
        expectedOutput: testCases[index].expectedOutput,
        actualOutput: output,
        isEqual: output === testCases[index].expectedOutput,
      }));

      setComparedResults(comparisonResults);
      enqueueSnackbar(`${alert}`, { variant: 'success' });
      setCurrentTab('two');
    } catch (error) {
      console.error(error);
      enqueueSnackbar(`${error.message}`, { variant: 'error' });
    } finally {
      loading.onFalse();
    }
  };

  const handleUpdateCode = async () => {
    const code = editorRef?.current?.getValue();
    if (code.length > 3000) {
      enqueueSnackbar('Code cannot exceed 3000 characters', { variant: 'error' });
      return;
    }
    loading.onTrue();
    try {
      const response = await updateSubmission(params.lid, currentLanguage, code);
      enqueueSnackbar(`${response.message}`, { variant: 'success' });
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
      loading.onTrue();
      reset({
        language: currentLanguage,
      });
      mutate(`api/v1/submission?laboratoryId=${params.lid}`);
      loading.onFalse();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  if (isLoading || isTestCaseLoading) {
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
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ p: 1, pr: 2 }}
                >
                  <FormProvider methods={methods}>
                    <Stack sx={{ width: 'fit-content', minWidth: 112 }}>
                      <RHFSelect
                        name="language"
                        onChange={handleLanguageChange}
                        disabled={loading.value}
                      >
                        <MenuItem value="Java">Java</MenuItem>
                        <MenuItem value="JavaScript">JavaScript</MenuItem>
                        <MenuItem value="Python">Python</MenuItem>
                        <MenuItem value="C">C</MenuItem>
                      </RHFSelect>
                    </Stack>
                  </FormProvider>
                  <Tooltip title="Save" placement="top" arrow>
                    <IconButton sx={{ height: 'fit-content' }} onClick={handleUpdateCode}>
                      <Iconify icon="fluent:save-sync-20-regular" />
                    </IconButton>
                  </Tooltip>
                </Stack>
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
                  defaultValue={submissions?.codeSnippets?.Java || ''}
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
                  {errorMessage && (
                    <Typography color="error" variant="caption" sx={{ p: 1 }}>
                      {errorMessage}
                    </Typography>
                  )}
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
              <LabTestCase
                testCases={testCases}
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
                results={comparedResults}
                isResultLoading={loading.value}
                isCompileError={isError.value}
                isTestCaseLoading={isTestCaseLoading}
                isTestCaseError={isTestCaseError}
              />
            </CustomResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </Box>
  );
}
