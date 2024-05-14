'use client';

import { Stack, Container, Typography } from '@mui/material';

import { useSettingsContext } from 'src/components/settings';

import AssignmentNewEditForm from '../assignment-new-edit-form';

// ----------------------------------------------------------------------

export default function AssignmentCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        <Typography variant="h4"> Create Assignment </Typography>
      </Stack>
      <AssignmentNewEditForm />
    </Container>
  );
}
