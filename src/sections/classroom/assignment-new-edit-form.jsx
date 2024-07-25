import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { LoadingButton } from '@mui/lab';
import Grid from '@mui/material/Unstable_Grid2';
import { Button, MenuItem } from '@mui/material';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { useParams, useRouter } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import { createAssignment, updateAssignment } from 'src/utils/axios';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';

import AssignmentNewEditDate from './assignment-new-edit-date';

// ----------------------------------------------------------------------

export default function AssignmentNewEditForm({ currentAssignment }) {
  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const params = useParams();

  const NewClassroomSchema = Yup.object().shape({
    title: Yup.string()
      .required('Title is required')
      .max(80, 'Assignment title must not exceed 80 characters'),
    description: Yup.string()
      .required('Description is required')
      .max(200, 'Assignment description must not exceed 200 characters'),
    startTime: Yup.mixed()
      .required('Start date is required')
      .test('date-min', 'Start date must be later or equal to current date', (value) => {
        const today = new Date();
        const startTime = new Date(value);
        today.setHours(0, 0, 0, 0);
        if (currentAssignment?.startTime) {
          return true;
        }
        return startTime >= today;
      }),
    endTime: Yup.mixed()
      .required('Due date is required')
      .test(
        'date-min',
        'Due date must be later than start date',
        (value, { parent }) => new Date(value).getTime() > new Date(parent.startTime).getTime()
      ),
    gradingCriteria: Yup.string()
      .required('Grading method is required')
      .oneOf(['AUTO', 'MANUAL', 'NOT_GRADE'], 'Invalid grading method'),
    status: Yup.string()
      .required('Status is required')
      .oneOf(['PUBLISH', 'DRAFT'], 'Invalid status'),
  });

  const defaultValues = useMemo(
    () => ({
      title: currentAssignment?.title || '',
      description: currentAssignment?.description || '',
      // isRestrict: currentAssignment?.isRestrict || false,
      startTime: currentAssignment?.startTime ? new Date(currentAssignment.startTime) : new Date(),
      endTime: currentAssignment?.endTime ? new Date(currentAssignment.endTime) : null,
      gradingCriteria: currentAssignment?.gradingCriteria || '',
      status: currentAssignment?.status || '',
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
      const st = new Date(currentAssignment.startTime);
      const et = new Date(currentAssignment.endTime);
      reset({
        title: currentAssignment.title,
        description: currentAssignment.description,
        startTime: st,
        endTime: et,
        gradingCriteria: currentAssignment.gradingCriteria,
        status: currentAssignment.status,
      });
    }
  }, [currentAssignment, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentAssignment) {
        const response = await updateAssignment(currentAssignment.assignmentId, {
          title: data.title,
          description: data.description,
          startTime: convertTime(data.startTime),
          endTime: convertTime(data.endTime),
          status: data.status,
        });
        enqueueSnackbar(`${response.message}`);
      } else {
        const response = await createAssignment(params.cid, {
          title: data.title,
          description: data.description,
          startTime: convertTime(data.startTime),
          endTime: convertTime(data.endTime),
          status: data.status,
        });
        console.log(response);
        enqueueSnackbar(`${response.message}`);
      }
      reset();
      router.back();
    } catch (error) {
      console.error(error);
      enqueueSnackbar(`${error.message}`, { variant: 'error' });
    }
  });

  const convertTime = (time) => {
    const utcDate = new Date(time.toISOString());
    const localTimeOffset = time.getTimezoneOffset() * 60000; // in milliseconds
    return new Date(utcDate.getTime() - localTimeOffset);
  };

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

            <AssignmentNewEditDate
              disableStartTime={new Date(currentAssignment?.startTime) < new Date()}
            />

            <RHFSelect name="gradingCriteria" label="Grading Method">
              <MenuItem value="AUTO">AUTO</MenuItem>
              <MenuItem value="MANUAL">MANUAL</MenuItem>
              <MenuItem value="NOT_GRADE">NOT_GRADE</MenuItem>
            </RHFSelect>

            <RHFSelect name="status" label="Status">
              <MenuItem value="PUBLISH">PUBLISH</MenuItem>
              <MenuItem value="DRAFT">DRAFT</MenuItem>
            </RHFSelect>

            {/* <Stack direction="row">
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
            </Stack> */}
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
    gradingCriteria: PropTypes.oneOf(['AUTO', 'MANUAL', 'NOT_GRADE']),
    status: PropTypes.oneOf(['PUBLISH', 'DRAFT']),
  }),
};
