import { m } from 'framer-motion';
import PropTypes from 'prop-types';

import { Box, Stack } from '@mui/material';

import { varFade, MotionContainer } from 'src/components/animate';

// ----------------------------------------------------------------------

export default function MemberList({ users }) {
  if (users.length === 0) {
    return <Box>No User...</Box>;
  }
  return (
    <MotionContainer>
      <Stack spacing={3} sx={{ mt: 5 }}>
        {users.map((user) => (
          <Box key={user.userId} component={m.div} variants={varFade().inUp}>
            User List Here
          </Box>
        ))}
      </Stack>
    </MotionContainer>
  );
}

MemberList.propTypes = {
  users: PropTypes.array,
};
