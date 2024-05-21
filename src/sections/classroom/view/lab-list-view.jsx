'use client';

import { useParams } from 'next/navigation';

import { Stack, Button } from '@mui/material';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useGetAssignmentById } from 'src/api/assignment';
import { useGetLaboratoriesByAssignmentId } from 'src/api/laboratory';

import Iconify from 'src/components/iconify';
import TextMaxLine from 'src/components/text-max-line';
import { useSettingsContext } from 'src/components/settings';

import LabList from '../lab-list';

// ----------------------------------------------------------------------

export default function LabListView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { laboratories } = useGetLaboratoriesByAssignmentId(params.aid);
  const { assignment } = useGetAssignmentById(params.aid);

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
        <Typography variant="h4"> {assignment?.title} </Typography>
        <TextMaxLine variant="body2" sx={{ color: 'text.secondary' }}>
          Due to {assignment?.startTime || 'none'}
        </TextMaxLine>
      </Stack>

      <LabList labs={laboratories} />
    </Container>
  );
}
