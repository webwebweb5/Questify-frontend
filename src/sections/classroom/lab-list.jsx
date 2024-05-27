import PropTypes from 'prop-types';

import { Box } from '@mui/material';

import EmptyContent from 'src/components/empty-content';
import { MotionContainer } from 'src/components/animate';

import LabItem from './lab-item';

// ----------------------------------------------------------------------

export default function LabList({ labs }) {
  if (labs.length === 0) {
    return <EmptyContent filled title="No Data" sx={{ my: 3 }} />;
  }

  return (
    <MotionContainer>
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
          <LabItem key={lab.laboratoryId} lab={lab} />
        ))}
      </Box>
    </MotionContainer>
  );
}

LabList.propTypes = {
  labs: PropTypes.array,
};
