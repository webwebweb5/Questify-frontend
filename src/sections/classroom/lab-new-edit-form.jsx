import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams, useRouter } from 'next/navigation';

import { LoadingButton } from '@mui/lab';
import { Grid, Card, Stack, Divider, CardHeader, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { createLaboratory } from 'src/utils/axios';

import Markdown from 'src/components/markdown';
import { RHFTextField } from 'src/components/hook-form';
import RHFEditor from 'src/components/hook-form/rhf-editor';
import FormProvider from 'src/components/hook-form/form-provider';

export default function LabNewEditForm({ currentLab }) {
  const { enqueueSnackbar } = useSnackbar();

  const params = useParams();

  const router = useRouter();

  const NewLabSchema = Yup.object().shape({
    labTitle: Yup.string().required('Lab Title is required'),
    problemStatement: Yup.string().required('Problem Statement is required'),
  });

  const defaultValues = useMemo(
    () => ({
      labTitle: currentLab?.labTitle || '',
      description: currentLab?.description || '',
      problemStatement: currentLab?.problemStatement || '',
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

  useEffect(() => {
    if (currentLab) {
      reset({
        labTitle: currentLab.labTitle,
        description: currentLab.description,
        problemStatement: currentLab.problemStatement,
      });
    }
  }, [currentLab, reset]);

  const watchedLabTitle = watch('labTitle');
  const watchedProblemStatement = watch('problemStatement');

  const onSubmit = handleSubmit(async (data) => {
    try {
      // await new Promise((resolve) => setTimeout(resolve, 500));
      await createLaboratory(params.aid, data);
      reset();
      enqueueSnackbar(currentLab ? 'Update success!' : 'Create success!');
      router.push(paths.classroom.assignmentId(params.cid, params.aid));
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
                <Typography variant="subtitle2">Lab Title</Typography>
                <RHFTextField name="labTitle" placeholder="e.g. calculate area of triangle" />
              </Stack>

              <Stack spacing={1.5}>
                <Typography variant="subtitle2">Sub Description (Optional)</Typography>
                <RHFTextField
                  name="description"
                  placeholder="e.g. This is lab"
                  multiline
                  rows={3}
                />
              </Stack>

              <Stack spacing={1.5}>
                <Typography variant="subtitle2">Problem statement</Typography>
                <RHFEditor simple name="problemStatement" />
              </Stack>
            </Stack>
          </Card>
        </Grid>
        <Grid item>
          <Divider orientation="vertical" sx={{ borderStyle: 'dashed', mx: 2 }} />
        </Grid>
        <Grid item xs={12} md={5}>
          <Card>
            <CardHeader title={watchedLabTitle || 'Header...'} />
            <Stack spacing={3} sx={{ p: 3 }}>
              <Markdown children={watchedProblemStatement || '<p>Problem Statement...</p>'} />
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
