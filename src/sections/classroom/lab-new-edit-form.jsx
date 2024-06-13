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

import { createLaboratory, updateLaboratory } from 'src/utils/axios';

import Markdown from 'src/components/markdown';
import { RHFTextField } from 'src/components/hook-form';
import RHFEditor from 'src/components/hook-form/rhf-editor';
import FormProvider from 'src/components/hook-form/form-provider';

export default function LabNewEditForm({ currentLab }) {
  const { enqueueSnackbar } = useSnackbar();

  const params = useParams();

  const router = useRouter();

  const NewLabSchema = Yup.object().shape({
    labTitle: Yup.string()
      .required('Lab Title is required')
      .max(80, 'Lab title must not exceed 80 characters'),
    description: Yup.string().max(200, 'Lab description must not exceed 200 characters'),
    problemStatement: Yup.string()
      .required('Problem Statement is required')
      .max(1250, 'Lab Problem Statement must not exceed 1250 characters'),
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
      if (currentLab) {
        await updateLaboratory(params.lid, data);
        enqueueSnackbar('Update success!');
      } else {
        await createLaboratory(params.aid, data);
        enqueueSnackbar('Create success!');
      }
      reset();
      router.push(paths.classroom.assignmentId(params.cid, params.aid));
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error.message, { variant: 'error' });
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
          <LoadingButton
            type="submit"
            variant="contained"
            size="large"
            loading={isSubmitting}
            sx={{ mt: 3 }}
          >
            {!currentLab ? 'Create Lab' : 'Save Changes'}
          </LoadingButton>
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
    </FormProvider>
  );
}

LabNewEditForm.propTypes = {
  currentLab: PropTypes.object,
};
