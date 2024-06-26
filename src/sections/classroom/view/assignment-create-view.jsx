'use client';

import { useParams } from 'next/navigation';

import { Container } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import AssignmentNewEditForm from '../assignment-new-edit-form';

// ----------------------------------------------------------------------

export default function AssignmentCreateView() {
  const settings = useSettingsContext();

  const params = useParams();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Create Assignment"
        links={[
          {
            name: 'Assignment',
            href: paths.classroom.assignment(params.cid),
          },
          { name: 'Create assignment' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <AssignmentNewEditForm />
    </Container>
  );
}
