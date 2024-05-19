import PropTypes from 'prop-types';

import { Box, Button } from '@mui/material';

import EmptyContent from 'src/components/empty-content';

import LabItem from './view/lab-item';

// ----------------------------------------------------------------------

export default function LabList({ labs }) {
  if (labs.length === 0) {
    return <EmptyContent filled title="No Data" sx={{ my: 3, py: 10 }} />;
  }
  return (
    <>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
        }}
        sx={{ my: 5 }}
      >
        {labs.map((lab) => (
          <LabItem lab={lab} />
        ))}
      </Box>

      <Button variant="contained" sx={{ py: 1.5, mr: 2 }}>
        Add New Lab (Manual)
      </Button>
      <Button variant="contained" color="primary" sx={{ py: 1.5 }}>
        Add New Lab (AI gen)
      </Button>
    </>
  );
}

LabList.propTypes = {
  labs: PropTypes.array,
};
