'use client';

import PropTypes from 'prop-types';
import { useParams } from 'next/navigation';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import LabNewEditForm from '../lab-new-edit-form';

// ----------------------------------------------------------------------

const _labs = {
  id: 'e99f09a7-dd88-l2',
  topic: 'calculate tax',
  description: '<p>Do something...</p>',
  time: 'Mon May 13 2024 10:00:00 GMT+0700 (Indochina Time)',
};

// ----------------------------------------------------------------------

export default function LabEditView({ lab }) {
  const params = useParams();

  return (
    <Container maxWidth={false}>
      <CustomBreadcrumbs
        heading="Edit Lab"
        links={[
          {
            name: 'Conditional Programming (All lab)',
            href: paths.classroom.assignmentId(params.cid, params.aid),
          },
          { name: 'Calculate tax' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <LabNewEditForm currentLab={_labs} />
    </Container>
  );
}

LabEditView.propTypes = {
  lab: PropTypes.object,
};
