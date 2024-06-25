import PropTypes from 'prop-types';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { Box, Card, Stack, Divider, CardHeader, Typography, IconButton } from '@mui/material';

import Iconify from 'src/components/iconify';
import Markdown from 'src/components/markdown';

export default function LabSummaryForm({ title, problemStatement, setActiveStep }) {
  const { control } = useFormContext();
  const { fields } = useFieldArray({
    control,
    name: 'testCases',
  });

  return (
    <Card>
      <CardHeader title={title || 'Type Header'} />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Markdown children={problemStatement || '<p>Problem Statement</p>'} />
      </Stack>
      <Box
        sx={{ mx: 3, mb: 3, mt: 2 }}
        gap={2}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
      >
        {fields.map((testCase, index) => (
          <Card key={index} sx={{ bgcolor: '#1B212A' }}>
            <Stack spacing={0.5} sx={{ p: 2.5, px: 3, pr: 2.5 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="h6">{`Test Case ${index + 1}`}</Typography>
                <Stack direction="row">
                  <IconButton color="info" aria-label="edit" onClick={() => setActiveStep(1)}>
                    <Iconify icon="solar:pen-bold" />
                  </IconButton>
                  <IconButton color="error" aria-label="delete" onClick={() => setActiveStep(1)}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Stack>
              </Stack>
              <Divider sx={{ borderStyle: 'dashed', mb: 1 }} />
              <Typography variant="body2">{`Input: ${testCase.input}`}</Typography>
              <Typography variant="body2">{`Expected Output: ${testCase.expectedOutput}`}</Typography>
            </Stack>
          </Card>
        ))}
      </Box>
    </Card>
  );
}

LabSummaryForm.propTypes = {
  title: PropTypes.string,
  problemStatement: PropTypes.string,
  setActiveStep: PropTypes.func,
};
