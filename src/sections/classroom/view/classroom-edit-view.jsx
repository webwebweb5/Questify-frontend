'use client';

import { Container } from '@mui/material';

import { paths } from 'src/routes/paths';

import { _classroom } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ClassroomNewEditForm from '../classroom-new-edit-form';

// ----------------------------------------------------------------------

export default function ClassroomEditView() {
  const settings = useSettingsContext();
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

      <ClassroomNewEditForm currentClassroom={_classroom[0]} />
    </Container>
  );
}
