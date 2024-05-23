'use client';

import { Stack, Button } from '@mui/material';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useCurrentRole } from 'src/hooks/use-current-role';

import { useGetClassroom } from 'src/api/classroom';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';

import ClassroomList from '../classroom-list';

// ----------------------------------------------------------------------

export default function ClassroomListView() {
  const settings = useSettingsContext();

  const { classroom } = useGetClassroom();

  const role = useCurrentRole();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h4"> Classroom </Typography>

        {role === 'ProfAcc' && (
          <Button
            component={RouterLink}
            href={paths.classroom.new}
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Classroom
          </Button>
        )}
      </Stack>

      <ClassroomList classrooms={classroom} />
    </Container>
  );
}
