'use client';

import { useRef } from 'react';
import { useParams } from 'next/navigation';
import { Editor, loader } from '@monaco-editor/react';

// eslint-disable-next-line import/no-extraneous-dependencies
import { styled } from '@mui/system';
import { Box, Stack, alpha, Typography } from '@mui/material';

import { useResponsive } from 'src/hooks/use-responsive';

import { useGetSubmissionsByLaboratoryId } from 'src/api/submission';

import { SplashScreen } from 'src/components/loading-screen';
import { ResizablePanel, ResizableHandle, ResizablePanelGroup } from 'src/components/ui/resizable';

const CustomResizablePanel = styled(ResizablePanel)(({ theme }) => ({
  borderRadius: 8,
  bgcolor: alpha(theme.palette.grey[500], 0.04),
  border: `dashed 1px ${theme.palette.divider}`,
}));

export default function LabQuestionView() {
  const params = useParams();
  const editorRef = useRef(null);

  const lgUp = useResponsive('up', 'lg');

  const panelRef = useRef(null);

  const { submissions, isLoading } = useGetSubmissionsByLaboratoryId(params.lid);

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
          defaultSize={0}
          collapsedSize={0}
          collapsible
          minSize={3}
          className="bg-[#1B212A]"
          ref={panelRef}
        >
          <Stack spacing={3} sx={{ p: 2 }}>
            <Typography variant="h4" noWrap>
              {submissions?.laboratory?.labTitle}
            </Typography>
          </Stack>
        </CustomResizablePanel>
        <ResizableHandle withHandle onDoubleClick={collapsePanel} />
        <ResizablePanel defaultSize={50}>
          <ResizablePanelGroup direction="vertical" className="gap-2">
            <CustomResizablePanel defaultSize={65} minSize={60} className="bg-[#1B212A]">
              <div className="h-full">
                <Editor
                  options={{
                    minimap: {
                      enabled: false,
                    },
                    lineDecorationsWidth: 0,
                    lineNumbersMinChars: 3,
                  }}
                  theme="myTheme"
                  defaultLanguage="javascript"
                  defaultValue={submissions?.codeSnippets?.JavaScript}
                  onMount={handleEditorDidMount}
                  onChange={handleEditorChange}
                />
              </div>
            </CustomResizablePanel>
            <ResizableHandle withHandle />
            <CustomResizablePanel defaultSize={35} className="bg-[#1B212A]">
              This is Test case
            </CustomResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </Box>
  );
}
