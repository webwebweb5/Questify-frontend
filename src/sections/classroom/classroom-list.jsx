import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import EmptyContent from 'src/components/empty-content';

import ClassroomItem from './classroom-item';

// ----------------------------------------------------------------------

export default function ClassroomList({ classrooms }) {
  if (classrooms.length === 0) {
    return <EmptyContent filled title="No Classroom" sx={{ my: 3, py: 10 }} />;
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
        sx={{ mt: 5 }}
      >
        {classrooms.map((classroom) => (
          <ClassroomItem key={classroom.classroomId} classroom={classroom} />
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
