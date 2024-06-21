'use client';

import { useParams } from 'next/navigation';

import { Stack, Button, Container, Typography } from '@mui/material';

import { useGetClassroomById } from 'src/api/classroom';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';

import MemberList from '../member-list';

// ----------------------------------------------------------------------

export default function AssignLabsListView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { classroom } = useGetClassroomById(params.cid);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h4"> Assign Labs </Typography>
      </Stack>

      <Stack spacing={2} sx={{ mt: 3 }}>
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
            <Typography variant="h6">Students</Typography>
            <Label>{classroom?.students?.length}</Label>
          </Stack>

          <Button variant="contained" startIcon={<Iconify icon="ic:outline-auto-awesome" />}>
            Random Assign
          </Button>
        </Stack>

        <MemberList users={classroom?.students} assignLab />
      </Stack>
    </Container>
  );
}
