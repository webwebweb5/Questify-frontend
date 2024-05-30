import PropTypes from 'prop-types';

import { Stack, Divider, Typography } from '@mui/material';

import Markdown from 'src/components/markdown/markdown';

export default function LabProblemStatement({ submissions }) {
  return (
    <Stack spacing={2} sx={{ p: 2 }}>
      <Typography variant="h4" noWrap>
        {submissions?.laboratory?.labTitle}
      </Typography>
      <Divider sx={{ borderStyle: 'dashed' }} />
      <Markdown children={submissions?.laboratory?.problemStatement || '<p>No Instruction</p>'} />
    </Stack>
  );
}

LabProblemStatement.propTypes = {
  submissions: PropTypes.shape({
    laboratory: PropTypes.shape({
      labTitle: PropTypes.string,
      problemStatement: PropTypes.string,
    }),
  }),
};
