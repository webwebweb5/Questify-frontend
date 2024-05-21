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

import { useParams, useRouter } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import { createAssignment, updateAssignment } from 'src/utils/axios';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSwitch, RHFTextField } from 'src/components/hook-form';

import AssignmentNewEditDate from './assignment-new-edit-date';

// ----------------------------------------------------------------------

export default function AssignmentNewEditForm({ currentAssignment }) {
  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const params = useParams();

  const NewClassroomSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    startTime: Yup.mixed()
      .required('Start date is required')
      .test('date-min', 'Start date must be later or equal to current date', (value) => {
        const today = new Date();
        const startTime = new Date(value);
        // Clear the time part to compare only the date parts
        today.setHours(0, 0, 0, 0);
        startTime.setHours(0, 0, 0, 0);
        return startTime >= today;
      }),
    endTime: Yup.mixed()
      .required('Due date is required')
      .test(
        'date-min',
        'Due date must be later than create date',
        (value, { parent }) => value.getTime() > parent.startTime.getTime()
      ),
  });

  const defaultValues = useMemo(
    () => ({
      title: currentAssignment?.title || '',
      description: currentAssignment?.description || '',
      // isRestrict: currentAssignment?.isRestrict || false,
      startTime: currentAssignment?.startTime || new Date(),
      endTime: currentAssignment?.endTime || null,
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
      reset({ title: currentAssignment.title, description: currentAssignment.description });
    }
  }, [currentAssignment, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentAssignment) {
        await updateAssignment(currentAssignment.assignmentId, data);
        enqueueSnackbar('Update success!');
      } else {
        await createAssignment(params.cid, data);
        enqueueSnackbar('Create success!');
      }
      reset();
      router.back();
    } catch (error) {
      console.error(error);
      if (currentAssignment) {
        enqueueSnackbar('Update failed!', { variant: 'error' });
      } else {
        enqueueSnackbar('Create failed!', { variant: 'error' });
      }
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
            Title and description...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField
              name="title"
              label="Assignment Title"
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
  currentAssignment: PropTypes.shape({
    assignmentId: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    isRestrict: PropTypes.bool,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
  }),
};
