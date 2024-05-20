'use client';

import { useParams } from 'next/navigation';

import { Container } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useGetClassroomById } from 'src/api/classroom';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ClassroomNewEditForm from '../classroom-new-edit-form';

// ----------------------------------------------------------------------

export default function ClassroomEditView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { classroom } = useGetClassroomById(params.cid);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit classroom"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Classroom',
            href: paths.dashboard.classroom,
          },
          { name: 'Edit classroom' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ClassroomNewEditForm currentClassroom={classroom} />
    </Container>
  );
}
