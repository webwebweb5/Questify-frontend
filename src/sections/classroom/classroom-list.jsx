import { useState } from 'react';
import { m } from 'framer-motion';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import EmptyContent from 'src/components/empty-content';
import { varFade, MotionContainer } from 'src/components/animate';

import ClassroomItem from './classroom-item';

// ----------------------------------------------------------------------

const maxPerPage = 12;

// ----------------------------------------------------------------------

export default function ClassroomList({ classrooms }) {
  const [currentPage, setCurrentPage] = useState(1);

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  const startIndex = (currentPage - 1) * maxPerPage;
  const currentClassrooms = classrooms.slice(startIndex, startIndex + maxPerPage);

  if (classrooms.length === 0) {
    return <EmptyContent filled title="No Classroom" />;
  }

  return (
    <>
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
          sx={{ mt: 5 }}
        >
          {currentClassrooms.map((classroom) => (
            <Box key={classroom.classroomId} component={m.div} variants={varFade().inUp}>
              <ClassroomItem key={classroom.classroomId} classroom={classroom} />
            </Box>
          ))}
        </Box>
      </MotionContainer>

      {classrooms.length > maxPerPage && (
        <Pagination
          count={Math.ceil(classrooms.length / maxPerPage)}
          onChange={handleChangePage}
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
