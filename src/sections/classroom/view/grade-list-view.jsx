'use client';

import { useParams } from 'next/navigation';

import { Stack, Container, Typography } from '@mui/material';

import { useCurrentRole } from 'src/hooks/use-current-role';

import { useGetAssignments } from 'src/api/assignment';

import { useSettingsContext } from 'src/components/settings';

import GradeListStudent from '../grade-list-student';
import GradeListProfessor from '../grade-list-professor';

// ----------------------------------------------------------------------

export default function GradeListView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { assignments } = useGetAssignments(params.cid);

  const role = useCurrentRole();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Stack spacing={2} sx={{ mb: 6 }}>
        <Typography variant="h4">Grade</Typography>
        {role === 'ProfAcc' && <GradeListProfessor assignments={assignments} />}
        {role === 'StdAcc' && <GradeListStudent assignments={assignments} />}
      </Stack>
    </Container>
  );
}
