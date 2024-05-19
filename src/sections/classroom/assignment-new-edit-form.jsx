import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { Tooltip } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Grid from '@mui/material/Unstable_Grid2';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { useRouter } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSwitch, RHFTextField } from 'src/components/hook-form';

import AssignmentNewEditDate from './assignment-new-edit-date';

// ----------------------------------------------------------------------

export default function AssignmentNewEditForm({ currentAssignment }) {
  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const NewClassroomSchema = Yup.object().shape({
    topic: Yup.string().required('Topic is required'),
    description: Yup.string().required('Description is required'),
    startDate: Yup.mixed()
      .required('Start date is required')
      .test('date-min', 'Start date must be later or equal to current date', (value) => {
        const today = new Date();
        const startDate = new Date(value);
        // Clear the time part to compare only the date parts
        today.setHours(0, 0, 0, 0);
        startDate.setHours(0, 0, 0, 0);
        return startDate >= today;
      }),
    dueDate: Yup.mixed()
      .required('Due date is required')
      .test(
        'date-min',
        'Due date must be later than create date',
        (value, { parent }) => value.getTime() > parent.startDate.getTime()
      ),
  });

  const defaultValues = useMemo(
    () => ({
      topic: currentAssignment?.topic || '',
      description: currentAssignment?.description || '',
      isRestrict: currentAssignment?.isRestrict || false,
      createDate: currentAssignment?.createDate || new Date(),
      dueDate: currentAssignment?.dueDate || null,
    }),
    [currentAssignment]
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
    if (currentAssignment) {
      reset({ topic: currentAssignment.topic, description: currentAssignment.description });
    }
  }, [currentAssignment, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      enqueueSnackbar(currentAssignment ? 'Update success!' : 'Create success!');
      router.back();
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
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
            Topic and description...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField
              name="topic"
              label="Assignment Topic"
              placeholder="e.g. Conditional Programming"
            />

            <RHFTextField
              name="description"
              label="Description"
              multiline
              rows={4}
              placeholder="e.g. if/else and switch case"
            />

            <Stack direction="row">
              <RHFSwitch name="isRestrict" label="Restriction" />
              <Tooltip
                title="Prevent students from copying and pasting code!"
                placement="top"
                arrow
              >
                <IconButton color="inherit" sx={{ ml: -1 }}>
                  <Iconify icon="ph:question" />
                </IconButton>
              </Tooltip>
            </Stack>

            <AssignmentNewEditDate />
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8} sx={{ display: 'flex', alignItems: 'flex-end' }}>
        <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
          {!currentAssignment ? 'Create Assignment' : 'Save Changes'}
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

AssignmentNewEditForm.propTypes = {
  currentAssignment: PropTypes.object,
};
