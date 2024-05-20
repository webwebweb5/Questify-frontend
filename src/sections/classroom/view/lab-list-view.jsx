'use client';

import { useParams } from 'next/navigation';

import { Stack, Button } from '@mui/material';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fDate } from 'src/utils/format-time';

import Iconify from 'src/components/iconify';
import TextMaxLine from 'src/components/text-max-line';
import { useSettingsContext } from 'src/components/settings';

import LabList from '../lab-list';

// ----------------------------------------------------------------------

const _labs = [
  {
    id: 'e99f09a7-dd88-l1',
    topic: 'calculate triangle space',
    description: '-',
    time: 'Sun May 12 2024 21:12:02 GMT+0700 (Indochina Time)',
  },
  {
    id: 'e99f09a7-dd88-l2',
    topic: 'calculate tax',
    description: '-',
    time: 'Mon May 13 2024 10:00:00 GMT+0700 (Indochina Time)',
  },
  {
    id: 'e99f09a7-dd88-l3',
    topic: 'calculate BMI',
    description: 'Arrays and Objects',
    time: 'Tue May 14 2024 13:30:00 GMT+0700 (Indochina Time)',
  },
];

// ----------------------------------------------------------------------

export default function LabListView() {
  const settings = useSettingsContext();

  const params = useParams();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Button
        component={RouterLink}
        href={paths.classroom.assignment(params.cid)}
        color="inherit"
        startIcon={<Iconify icon="carbon:chevron-left" />}
        sx={{ mb: 3 }}
      >
        Back to all assignment
      </Button>
      <Stack>
        <Typography variant="h4"> Conditional Programming </Typography>
        <TextMaxLine variant="body2" sx={{ color: 'text.secondary' }}>
          Due to {fDate('Fri May 17 2024 08:00:00 GMT+0700 (Indochina Time)')}
        </TextMaxLine>
      </Stack>

      <LabList labs={_labs} />
    </Container>
  );
}
