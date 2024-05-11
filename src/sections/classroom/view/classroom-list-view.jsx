'use client';

import { Stack, Button } from '@mui/material';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { _classroom } from 'src/_mock';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';

import ClassroomList from '../classroom-list';

// ----------------------------------------------------------------------

export default function ClassroomView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h4"> Classroom </Typography>
        <Button
          component={RouterLink}
          href=""
          variant="contained"
          color="primary"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          New Classroom
        </Button>
      </Stack>

      <ClassroomList classrooms={_classroom} />
    </Container>
  );
}
