'use client';

import { useParams } from 'next/navigation';

import { Stack, Button, Container, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';

import AssignmentList from '../assignment-list';

// ----------------------------------------------------------------------

const _assignments = [
  {
    id: 'e99f09a7-dd88-a1',
    labTitle: 'Conditional Programming',
    description: 'if/else',
    professor: 'Asst. Prof. Dr. Pathathai Na Lumpoon',
    startTime: 'Sun May 12 2024 21:12:02 GMT+0700 (Indochina Time)',
    endTime: 'Sun May 12 2024 22:12:02 GMT+0700 (Indochina Time)',
  },
  {
    id: 'e99f09a7-dd88-a2',
    labTitle: 'Loop Structures',
    description: 'for and while loops',
    professor: 'Asst. Prof. Dr. Pathathai Na Lumpoon',
    startTime: 'Mon May 13 2024 10:00:00 GMT+0700 (Indochina Time)',
    endTime: 'Mon May 13 2024 12:00:00 GMT+0700 (Indochina Time)',
  },
  {
    id: 'e99f09a7-dd88-a3',
    labTitle: 'Data Structures',
    description: 'Arrays and Objects',
    professor: 'Asst. Prof. Dr. Pathathai Na Lumpoon',
    startTime: 'Tue May 14 2024 13:30:00 GMT+0700 (Indochina Time)',
    endTime: 'Tue May 14 2024 15:30:00 GMT+0700 (Indochina Time)',
  },
  {
    id: 'e99f09a7-dd88-a4',
    labTitle: 'Function Definitions',
    professor: 'Asst. Prof. Dr. Pathathai Na Lumpoon',
    description: 'Creating and using functions',
    startTime: 'Wed May 15 2024 09:00:00 GMT+0700 (Indochina Time)',
    endTime: 'Wed May 15 2024 11:00:00 GMT+0700 (Indochina Time)',
  },
  {
    id: 'e99f09a7-dd88-a5',
    labTitle: 'Asynchronous JavaScript',
    description: 'Promises and async/await',
    professor: 'Asst. Prof. Dr. Pathathai Na Lumpoon',
    startTime: 'Thu May 16 2024 14:00:00 GMT+0700 (Indochina Time)',
    endTime: 'Thu May 16 2024 16:00:00 GMT+0700 (Indochina Time)',
  },
  {
    id: 'e99f09a7-dd88-a6',
    labTitle: 'API Integration',
    description: 'Fetching and displaying data',
    professor: 'Asst. Prof. Dr. Pathathai Na Lumpoon',
    startTime: 'Fri May 17 2024 08:00:00 GMT+0700 (Indochina Time)',
    endTime: 'Fri May 17 2024 10:00:00 GMT+0700 (Indochina Time)',
  },
];

// ----------------------------------------------------------------------

export default function AssignmentListView() {
  const settings = useSettingsContext();

  const params = useParams();

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

      <AssignmentList assignments={_assignments} />
    </Container>
  );
}
