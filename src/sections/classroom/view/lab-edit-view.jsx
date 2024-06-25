'use client';

import PropTypes from 'prop-types';
import { useParams } from 'next/navigation';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useGetLaboratoryById } from 'src/api/laboratory';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import LabNewEditForm from '../lab-new-edit-form';

// ----------------------------------------------------------------------

export default function LabEditView({ lab }) {
  const params = useParams();

  const { laboratory } = useGetLaboratoryById(params.lid);

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
          mb: 3,
        }}
      />
      <LabNewEditForm currentLab={laboratory} />
    </Container>
  );
}

LabEditView.propTypes = {
  lab: PropTypes.object,
};
