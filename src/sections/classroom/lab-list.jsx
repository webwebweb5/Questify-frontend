import PropTypes from 'prop-types';

import { Box, Stack, Button, Divider, Typography } from '@mui/material';

import { useCurrentRole } from 'src/hooks/use-current-role';

import Iconify from 'src/components/iconify';
import Markdown from 'src/components/markdown';
import EmptyContent from 'src/components/empty-content';
import { MotionContainer } from 'src/components/animate';

import LabItem from './lab-item';

// ----------------------------------------------------------------------

export default function LabList({ labs }) {
  const role = useCurrentRole();

  if (labs.length === 0) {
    const message =
      role === 'ProfAcc'
        ? 'No labs found, Please create a new lab to get started.'
        : 'No labs found!';

    return <EmptyContent filled title={message} sx={{ my: 3, py: 10 }} />;
  }

  return (
    <>
      {role === 'ProfAcc' ? (
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
      ) : (
        <Stack spacing={2} sx={{ mt: 4 }}>
          <Typography variant="h4" noWrap>
            Introduction to Loops
          </Typography>
          <Divider sx={{ borderStyle: 'dashed' }} />
          <Markdown children="<p>Write a program that prints numbers from 1 to 10 using both a for-loop and a while-loop.</p>" />
          <Button
            color="primary"
            variant="contained"
            sx={{ py: 1.5, mr: 2, mt: 4, width: 'fit-content' }}
            startIcon={<Iconify icon="carbon:play-filled-alt" />}
          >
            Start Lab
          </Button>
        </Stack>
      )}
    </>
  );
}

LabList.propTypes = {
  labs: PropTypes.array,
};
