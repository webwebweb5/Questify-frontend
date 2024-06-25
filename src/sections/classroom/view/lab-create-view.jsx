'use client';

import { useParams } from 'next/navigation';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import LabNewEditForm from '../lab-new-edit-form';

// ----------------------------------------------------------------------

export default function LabCreateView() {
  const params = useParams();

  return (
    <Container maxWidth={false}>
      <CustomBreadcrumbs
        heading="Create Lab"
        links={[
          {
            name: 'All Lab',
            href: paths.classroom.assignmentId(params.cid, params.aid),
          },
          { name: 'Create Lab' },
        ]}
        sx={{
          mb: 3,
        }}
      />

      <LabNewEditForm />
    </Container>
  );
}
