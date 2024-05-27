'use client';

import { Box, Grid, alpha } from '@mui/material';

export default function LabQuestionView() {
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
                  bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
                  border: (theme) => `dashed 1px ${theme.palette.divider}`,
                }}
              />
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
