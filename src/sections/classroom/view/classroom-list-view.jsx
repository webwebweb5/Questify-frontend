'use client';

import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { LoadingButton } from '@mui/lab';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Stack, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useCurrentRole } from 'src/hooks/use-current-role';

import { joinClassroom } from 'src/utils/axios';

import { useGetClassroom } from 'src/api/classroom';

import Iconify from 'src/components/iconify';
import { RHFTextField } from 'src/components/hook-form';
import { useSettingsContext } from 'src/components/settings';
import FormProvider from 'src/components/hook-form/form-provider';

import ClassroomList from '../classroom-list';

// ----------------------------------------------------------------------

export default function ClassroomListView() {
  const settings = useSettingsContext();

  const { classroom } = useGetClassroom();

  const role = useCurrentRole();

  const [popupOpen, setPopupOpen] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const InvitationCodeSchema = Yup.object().shape({
    invitationCode: Yup.string().required('Invitation Code is required'),
  });

  const defaultValues = useMemo(
    () => ({
      invitationCode: '',
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(InvitationCodeSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await joinClassroom(data.invitationCode);
      enqueueSnackbar(`${response.data.message}`);
      setPopupOpen(false);
      reset();
    } catch (error) {
      console.error(error);
      // 'There is no such invitation code, Please try again'
      enqueueSnackbar(`${error.message}`, {
        variant: 'error',
      });
    }
  });

  const renderJoinClassroom = (
    <Dialog fullWidth maxWidth="sm" open={popupOpen} onClose={() => setPopupOpen(false)}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle id="crop-dialog-title">Join Classroom</DialogTitle>
        <DialogContent dividers style={{ position: 'relative' }}>
          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Invitation Code</Typography>
            <RHFTextField name="invitationCode" placeholder="e.g. 123456" />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              setPopupOpen(false);
              reset();
            }}
            startIcon={<Iconify icon="eva:close-outline" />}
          >
            Cancel
          </Button>
          <LoadingButton
            color="primary"
            variant="contained"
            type="submit"
            startIcon={<Iconify icon="carbon:login" />}
            loading={isSubmitting}
          >
            Join
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h4"> Classroom </Typography>

          {role === 'ProfAcc' ? (
            <Button
              component={RouterLink}
              href={paths.classroom.new}
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Classroom
            </Button>
          ) : (
            <Button
              onClick={() => {
                setPopupOpen(true);
              }}
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Join Classroom
            </Button>
          )}
        </Stack>

        <ClassroomList classrooms={classroom} />
      </Container>

      {renderJoinClassroom}
    </>
  );
}
