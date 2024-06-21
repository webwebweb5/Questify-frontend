'use client';

import { useParams } from 'next/navigation';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Stack, Button, Divider } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useCurrentRole } from 'src/hooks/use-current-role';

import { fDateTime } from 'src/utils/format-time';

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

  const role = useCurrentRole();

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
      <Stack direction="row" justifyContent="space-between">
        <Stack>
          <Typography variant="h4"> {assignment?.title} </Typography>
          <TextMaxLine variant="body2" sx={{ color: 'text.secondary' }}>
            Due to {`${fDateTime(assignment?.startTime)}` || 'none'}
          </TextMaxLine>
        </Stack>
        {role === 'ProfAcc' ? (
          <Button
            variant="contained"
            color="primary"
            sx={{ height: 'fit-content', px: 2, py: 1 }}
            startIcon={<Iconify icon="ic:outline-assignment" />}
            href={paths.classroom.assignLabs(params.cid, params.aid)}
          >
            Assign Labs
          </Button>
        ) : (
          <Stack>
            <Typography variant="subtitle1">Points</Typography>
            <TextMaxLine variant="body1" sx={{ color: 'text.secondary' }}>
              0/10
            </TextMaxLine>
          </Stack>
        )}
      </Stack>

      <Typography variant="body2" sx={{ my: 3 }}>
        {assignment?.description}
      </Typography>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <LabList labs={laboratories} />

      {role === 'ProfAcc' && (
        <Button
          variant="contained"
          sx={{ py: 1.5, mr: 2, mb: 3 }}
          href={paths.classroom.LabNew(params.cid, params.aid)}
          startIcon={<Iconify icon="mingcute:add-line" />}
          color="info"
        >
          Add New Lab
        </Button>
      )}
    </Container>
  );
}
