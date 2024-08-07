import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Card from '@mui/material/Card';
import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import { LoadingButton } from '@mui/lab';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import { createClassroom, updateClassroom } from 'src/utils/axios';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function ClassroomNewEditForm({ currentClassroom }) {
  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const NewClassroomSchema = Yup.object().shape({
    title: Yup.string()
      .required('Classroom title is required')
      .max(80, 'Classroom title must not exceed 80 characters'),
    description: Yup.string()
      .required('Description is required')
      .max(200, 'Description must not exceed 200 characters'),
  });

  const defaultValues = useMemo(
    () => ({
      title: '',
      description: '',
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(NewClassroomSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentClassroom) {
      reset({
        title: currentClassroom.title,
        description: currentClassroom.description,
      });
    }
  }, [currentClassroom, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentClassroom) {
        const response = await updateClassroom(currentClassroom.classroomId, data);
        enqueueSnackbar(`${response.message}`);
      } else {
        const response = await createClassroom(data);
        enqueueSnackbar(`${response.message}`);
      }
      reset();
      router.push(paths.dashboard.classroom);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(`${error.message}`, { variant: 'error' });
    }
  });

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Details
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Title and short description...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField
              name="title"
              label="Classroom Title"
              placeholder="e.g. 953881 - Software Engineer"
            />

            <RHFTextField
              name="description"
              label="Description"
              multiline
              rows={4}
              placeholder="e.g. Fundamental of Software Engineer"
            />
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8} sx={{ display: 'flex', alignItems: 'flex-end' }} gap={2}>
        <Button variant="contained" size="large" color="error" onClick={() => router.back()}>
          Cancel
        </Button>
        <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
          {!currentClassroom ? 'Create Classroom' : 'Save Changes'}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}

        {renderActions}
      </Grid>
    </FormProvider>
  );
}

ClassroomNewEditForm.propTypes = {
  currentClassroom: PropTypes.shape({
    classroomId: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
  }),
};
