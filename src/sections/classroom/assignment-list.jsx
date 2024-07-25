import { useState } from 'react';
import { m } from 'framer-motion';
import PropTypes from 'prop-types';

import { Box, Stack } from '@mui/material';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import EmptyContent from 'src/components/empty-content';
import { varFade, MotionContainer } from 'src/components/animate';

import AssignmentItem from './assignment-item';

// ----------------------------------------------------------------------

const maxPerPage = 6;

// ----------------------------------------------------------------------

export default function AssignmentList({ assignments }) {
  const [currentPage, setCurrentPage] = useState(1);

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  const startIndex = (currentPage - 1) * maxPerPage;
  const currentAssignments = assignments.slice(startIndex, startIndex + maxPerPage);

  if (assignments.length === 0) {
    return <EmptyContent filled title="Assignment not found" sx={{ my: 3, py: 10 }} />;
  }
  return (
    <>
      <MotionContainer>
        <Stack spacing={3} sx={{ mt: 5 }}>
          {currentAssignments.map((assignment) => (
            <Box key={assignment.assignmentId} component={m.div} variants={varFade().inUp}>
              <AssignmentItem assignment={assignment} />
            </Box>
          ))}
        </Stack>
      </MotionContainer>

      {assignments.length > maxPerPage && (
        <Pagination
          count={Math.ceil(assignments.length / maxPerPage)}
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

AssignmentList.propTypes = {
  assignments: PropTypes.array,
};
