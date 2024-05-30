'use client';

import { useParams } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import { useRef, useState, useCallback } from 'react';
import { Editor, loader } from '@monaco-editor/react';

// eslint-disable-next-line import/no-extraneous-dependencies
import { styled } from '@mui/system';
import { LoadingButton } from '@mui/lab';
import { Box, Tab, Tabs, Stack, alpha, Button, Typography } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

import { updateAndExecuteSubmission } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { useGetSubmissionsByLaboratoryId } from 'src/api/submission';

import Iconify from 'src/components/iconify';
import { SplashScreen } from 'src/components/loading-screen';
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

  const { user } = useAuthContext();

  const lgUp = useResponsive('up', 'lg');

  const panelRef = useRef(null);

  const { submissions, isLoading } = useGetSubmissionsByLaboratoryId(params.lid);

  const loading = useBoolean(false);

  const [result, setResult] = useState(null);

  const [currentTab, setCurrentTab] = useState('one');

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
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
      const response = await updateAndExecuteSubmission(params.lid, 'JavaScript', code);
      const filteredOutput = response.data.output.split('\n').filter((line) => line.trim() !== '');
      setResult(filteredOutput);
      enqueueSnackbar(`${response.message}`, { variant: 'success' });
      setCurrentTab('two');
    } catch (error) {
      console.error(error);
      enqueueSnackbar(`${error.message}`, { variant: 'error' });
    } finally {
      loading.onFalse();
    }
  };

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

  console.log(currentTab);

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
            <CustomResizablePanel defaultSize={60} minSize={60} className="bg-[#1B212A]">
              <Stack sx={{ height: '100%', position: 'relative', mt: 1 }}>
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
                  defaultLanguage="javascript"
                  defaultValue={submissions?.codeSnippets?.JavaScript}
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
                  <Button variant="contained">Submit</Button>
                </Stack>
              </Stack>
            </CustomResizablePanel>
            <ResizableHandle withHandle />
            {/* 292A35 */}
            <CustomResizablePanel defaultSize={40} className="bg-[#1c1d24] !overflow-auto">
              <Stack sx={{ px: 2, pb: 1 }}>
                <Tabs value={currentTab} onChange={handleChangeTab}>
                  {TABS.slice(0, 3).map((tab) => (
                    <Tab key={tab.value} value={tab.value} label={tab.label} />
                  ))}
                </Tabs>
              </Stack>
              {currentTab === 'one' ? (
                <Stack sx={{ px: 2, pt: 1 }}>This is Test case</Stack>
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
                      {result ? result.map((line, i) => <p key={i}>&gt; {line}</p>) : <p>&gt;</p>}
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
