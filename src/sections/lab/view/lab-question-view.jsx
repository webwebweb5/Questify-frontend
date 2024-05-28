'use client';

import { useRef } from 'react';
import { useParams } from 'next/navigation';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Editor, loader } from '@monaco-editor/react';

import { Box, Grid, alpha } from '@mui/material';

import { useGetSubmissionsByLaboratoryId } from 'src/api/submission';

import { SplashScreen } from 'src/components/loading-screen';

export default function LabQuestionView() {
  const params = useParams();
  const editorRef = useRef(null);

  const { submissions, isLoading } = useGetSubmissionsByLaboratoryId(params.lid);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleEditorChange = (value, event) => {
    console.log('here is the current model value:', value);
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
        p: 3,
        flexShrink: { lg: 0 },
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              width: 1,
              height: 'calc(100vh - 112px)',
              borderRadius: 2,
              bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
              border: (theme) => `dashed 1px ${theme.palette.divider}`,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid container direction="column" spacing={2} sx={{ height: 'calc(100vh - 96px)' }}>
            <Grid item sx={{ flexGrow: 0, flexBasis: '60%' }}>
              <Box
                sx={{
                  width: 1,
                  height: 1,
                  borderRadius: 2,
                  py: 2,
                  bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
                  border: (theme) => `dashed 1px ${theme.palette.divider}`,
                }}
              >
                <Editor
                  options={{
                    minimap: {
                      enabled: false,
                    },
                  }}
                  theme="myTheme"
                  defaultLanguage="javascript"
                  defaultValue={submissions?.codeSnippets?.JavaScript}
                  onMount={handleEditorDidMount}
                  onChange={handleEditorChange}
                />
              </Box>
            </Grid>
            <Grid item sx={{ flexGrow: 1 }}>
              <Box
                sx={{
                  width: 1,
                  height: 1,
                  borderRadius: 2,
                  bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
                  border: (theme) => `dashed 1px ${theme.palette.divider}`,
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
