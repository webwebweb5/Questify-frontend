'use client';

import { Container } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ClassroomNewEditForm from '../classroom-new-edit-form';

// ----------------------------------------------------------------------

export default function ClassroomCreateView() {
  const settings = useSettingsContext();
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new classroom"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Classroom',
            href: paths.dashboard.classroom,
          },
          { name: 'New classroom' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ClassroomNewEditForm />
    </Container>
  );
}
