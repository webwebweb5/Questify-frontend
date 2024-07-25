import PropTypes from 'prop-types';

import { Box, Stack, Button, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

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
    return <EmptyContent filled title="Laboratory not found" sx={{ my: 3, py: 0 }} />;
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
              // lg: 'repeat(4, 1fr)',
            }}
            sx={{ my: 5 }}
          >
            {labs.map((lab, i) => (
              <LabItem key={lab.laboratoryId} lab={lab} index={i} />
            ))}
          </Box>
        </MotionContainer>
      ) : (
        <Stack spacing={2} sx={{ mt: 4 }}>
          <Typography variant="h4" noWrap>
            {labs[0].labTitle}
          </Typography>
          <Markdown children={labs[0].problemStatement} />
          <Button
            color="primary"
            variant="contained"
            href={paths.lab.question(labs[0].laboratoryId)}
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
