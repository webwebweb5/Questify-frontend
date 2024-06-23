'use client';

import { useParams } from 'next/navigation';

import { Box, Stack, Button, Container, Typography } from '@mui/material';

import { useGetStudentsByAssignmentId } from 'src/api/useUser';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import { SplashScreen } from 'src/components/loading-screen';

import AssignLabsList from '../assign-labs-list';

// ----------------------------------------------------------------------

export default function AssignLabsListView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { students, isLoading, isError } = useGetStudentsByAssignmentId(params.aid);

  if (isLoading) {
    return <SplashScreen />;
  }

  if (isError) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6" color="error">
          Error loading students.
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h4"> Assign Labs </Typography>
      </Stack>

      <Stack spacing={2} sx={{ mt: 3 }}>
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
            <Typography variant="h6">Students</Typography>
            <Label>{students?.length}</Label>
          </Stack>

          <Button variant="contained" startIcon={<Iconify icon="ic:outline-auto-awesome" />}>
            Random Assign
          </Button>
        </Stack>

        <AssignLabsList students={students} />
      </Stack>
    </Container>
  );
}
