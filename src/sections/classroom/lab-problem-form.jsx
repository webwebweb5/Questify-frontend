import { Card, Stack, CardHeader, Typography } from '@mui/material';

import { RHFTextField } from 'src/components/hook-form';
import RHFEditor from 'src/components/hook-form/rhf-editor';

export default function LabProblemForm() {
  return (
    <Card>
      <CardHeader title="Description" />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Lab Title</Typography>
          <RHFTextField name="labTitle" placeholder="e.g. calculate area of triangle" />
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Sub Description (Optional)</Typography>
          <RHFTextField name="description" placeholder="e.g. This is lab" multiline rows={3} />
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Problem statement</Typography>
          <RHFEditor simple name="problemStatement" />
        </Stack>
      </Stack>
    </Card>
  );
}
