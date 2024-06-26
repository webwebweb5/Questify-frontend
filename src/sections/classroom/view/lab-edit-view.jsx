'use client';

import { useParams } from 'next/navigation';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useGetLaboratoryById } from 'src/api/laboratory';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import LabNewEditForm from '../lab-new-edit-form';

// ----------------------------------------------------------------------

export default function LabEditView() {
  const params = useParams();

  const { laboratory } = useGetLaboratoryById(params.lid);

  const truncateTitle = (title, maxLength) => {
    if (!title) return '';
    return title.length > maxLength ? `${title.slice(0, maxLength)}...` : title;
  };

  const truncatedLabTitle = truncateTitle(laboratory?.labTitle, 25);

  return (
    <Container maxWidth={false}>
      <CustomBreadcrumbs
        heading="Edit Lab"
        links={[
          {
            name: 'Conditional Programming (All lab)',
            href: paths.classroom.assignmentId(params.cid, params.aid),
          },
          { name: truncatedLabTitle },
        ]}
        sx={{
          mb: 3,
        }}
      />
      <LabNewEditForm currentLab={laboratory} />
    </Container>
  );
}
