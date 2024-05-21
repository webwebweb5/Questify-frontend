'use client';

import { useParams } from 'next/navigation';

import { Container } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useGetAssignmentById } from 'src/api/assignment';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import AssignmentNewEditForm from '../assignment-new-edit-form';

// ----------------------------------------------------------------------

export default function AssignmentEditView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { assignment } = useGetAssignmentById(params.aid);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit Assignment"
        links={[
          {
            name: 'Assignment',
            href: paths.classroom.assignment(params.cid),
          },
          { name: 'Edit assignment' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <AssignmentNewEditForm currentAssignment={assignment} />
    </Container>
  );
}
