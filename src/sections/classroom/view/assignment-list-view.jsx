'use client';

import { useParams } from 'next/navigation';

import { Stack, Button, Container, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useGetAssignments } from 'src/api/assignment';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';

import AssignmentList from '../assignment-list';

// ----------------------------------------------------------------------

export default function AssignmentListView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { assignments } = useGetAssignments(params.cid);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h4"> Assignment </Typography>
        <Button
          component={RouterLink}
          href={paths.classroom.assignmentNew(params.cid)}
          variant="contained"
          color="primary"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          New Assignment
        </Button>
      </Stack>

      <AssignmentList assignments={assignments} />
    </Container>
  );
}
