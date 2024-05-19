'use client';

import PropTypes from 'prop-types';

import Container from '@mui/material/Container';
import { Stack, Typography } from '@mui/material';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import LabEditForm from '../lab-edit-form';

// ----------------------------------------------------------------------

const _labs = {
  id: 'e99f09a7-dd88-l2',
  labTitle: 'calculate tax',
  description: '-',
  time: 'Mon May 13 2024 10:00:00 GMT+0700 (Indochina Time)',
};

// ----------------------------------------------------------------------

export default function LabEditView({ lab }) {
  return (
    <Container maxWidth={false}>
      {/* <Stack>
        <Typography variant="h4"> Edit Lab </Typography>
        <Typography variant="body1">Lab {'>'} Calculate tax </Typography>
      </Stack> */}
      <CustomBreadcrumbs
        heading="Edit Lab"
        links={[
          {
            name: 'Conditional Programming',
            href: '',
          },
          { name: 'Calculate tax' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <LabEditForm currentLab={_labs} />
    </Container>
  );
}

LabEditView.propTypes = {
  lab: PropTypes.object,
};
