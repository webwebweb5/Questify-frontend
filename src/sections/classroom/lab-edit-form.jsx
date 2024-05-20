import * as Yup from 'yup';
import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { LoadingButton } from '@mui/lab';
import { Grid, Card, Stack, Divider, CardHeader, Typography } from '@mui/material';

import Markdown from 'src/components/markdown';
import { RHFTextField } from 'src/components/hook-form';
import RHFEditor from 'src/components/hook-form/rhf-editor';
import FormProvider from 'src/components/hook-form/form-provider';

export default function LabNewEditForm({ currentLab }) {
  const { enqueueSnackbar } = useSnackbar();

  const NewLabSchema = Yup.object().shape({
    topic: Yup.string().required('Topic is required'),
    description: Yup.string().required('Description is required'),
  });

  const defaultValues = useMemo(
    () => ({
      topic: currentLab?.topic || '',
      description: currentLab?.description || '',
    }),
    [currentLab]
  );

  const methods = useForm({
    resolver: yupResolver(NewLabSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  const watchedTopic = watch('topic');
  const watchedDesc = watch('description');

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      enqueueSnackbar(currentLab ? 'Update success!' : 'Create success!');
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Description" />

            <Stack spacing={3} sx={{ p: 3 }}>
              <Stack spacing={1.5}>
                <Typography variant="subtitle2">Topic</Typography>
                <RHFTextField name="topic" placeholder="e.g. calculate area of triangle" />
              </Stack>

              <Stack spacing={1.5}>
                <Typography variant="subtitle2">Problem statement</Typography>
                <RHFEditor simple name="description" />
              </Stack>
            </Stack>
          </Card>
        </Grid>
        <Grid item>
          <Divider orientation="vertical" sx={{ borderStyle: 'dashed', mx: 2 }} />
        </Grid>
        <Grid item xs={12} md={5}>
          <Card>
            <CardHeader title={watchedTopic || 'Header...'} />
            <Stack spacing={3} sx={{ p: 3 }}>
              <Markdown children={watchedDesc || '<p>Instruction...</p>'} />
            </Stack>
          </Card>
        </Grid>
      </Grid>
      <LoadingButton
        type="submit"
        variant="contained"
        size="large"
        loading={isSubmitting}
        sx={{ mt: 3 }}
      >
        {!currentLab ? 'Create Lab' : 'Save Changes'}
      </LoadingButton>
    </FormProvider>
  );
}

LabNewEditForm.propTypes = {
  currentLab: PropTypes.object,
};
