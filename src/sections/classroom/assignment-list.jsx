import { m } from 'framer-motion';
import PropTypes from 'prop-types';

import { Box, Stack } from '@mui/material';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import EmptyContent from 'src/components/empty-content';
import { varFade, MotionContainer } from 'src/components/animate';

import AssignmentItem from './assignment-item';

// ----------------------------------------------------------------------

export default function AssignmentList({ assignments }) {
  if (assignments.length === 0) {
    return <EmptyContent filled title="No Data" sx={{ my: 3, py: 10 }} />;
  }
  return (
    <>
      <MotionContainer>
        <Stack spacing={3} sx={{ mt: 5 }}>
          {assignments.map((assignment) => (
            <Box key={assignment.assignmentId} component={m.div} variants={varFade().inUp}>
              <AssignmentItem assignment={assignment} />
            </Box>
          ))}
        </Stack>
      </MotionContainer>

      {/* {assignments.length > 8 && ( */}
      <Pagination
        count={8}
        sx={{
          mt: 8,
          [`& .${paginationClasses.ul}`]: {
            justifyContent: 'center',
          },
        }}
      />
      {/* )} */}
    </>
  );
}

AssignmentList.propTypes = {
  assignments: PropTypes.array,
};
