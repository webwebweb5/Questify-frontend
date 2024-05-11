import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import ClassroomItem from './classroom-item';

// ----------------------------------------------------------------------

export default function ClassroomList({ classrooms }) {
  return (
    <>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          // lg: 'repeat(4, 1fr)',
        }}
        sx={{ mt: 5 }}
      >
        {classrooms.map((classroom) => (
          <ClassroomItem key={classroom.id} classroom={classroom} />
        ))}
      </Box>

      {classrooms.length > 8 && (
        <Pagination
          count={8}
          sx={{
            mt: 8,
            [`& .${paginationClasses.ul}`]: {
              justifyContent: 'center',
            },
          }}
        />
      )}
    </>
  );
}

ClassroomList.propTypes = {
  classrooms: PropTypes.array,
};
