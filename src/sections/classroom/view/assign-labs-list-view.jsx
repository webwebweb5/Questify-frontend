'use client';

import { mutate } from 'swr';
import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { useParams } from 'next/navigation';

import { LoadingButton } from '@mui/lab';
import {
  Box,
  Stack,
  Button,
  Dialog,
  Container,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { endpoints, unassignAllLaboratories, assignLaboratoriesRandomly } from 'src/utils/axios';

import { useGetStudentsByAssignmentId } from 'src/api/useUser';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import { SplashScreen } from 'src/components/loading-screen';

import AssignLabsList from '../assign-labs-list';

// ----------------------------------------------------------------------

export default function AssignLabsListView() {
  const settings = useSettingsContext();

  const params = useParams();

  const { students, isLoading, isError } = useGetStudentsByAssignmentId(params.aid);

  const loading = useBoolean(false);

  const { enqueueSnackbar } = useSnackbar();

  const [popupOpen, setPopupOpen] = useState(false);
  const [unAssignPopupOpen, setUnAssignPopupOpen] = useState(false);

  const handleRandomAssign = async () => {
    loading.onTrue();
    try {
      const response = await assignLaboratoriesRandomly(params.aid);
      enqueueSnackbar(`${response.message}`, { variant: 'success' });
      mutate(`${endpoints.user.student}?assignmentId=${params.aid}`);
      // window.location.reload();
    } catch (error) {
      console.error(error);
      enqueueSnackbar(`${error.message}`, { variant: 'error' });
    } finally {
      loading.onFalse();
      setPopupOpen(false);
    }
  };

  const renderRandomConfirmation = (
    <Dialog fullWidth maxWidth="sm" open={popupOpen} onClose={() => setPopupOpen(false)}>
      <DialogTitle id="crop-dialog-title">Laboratory Assign Randomly Confirmation</DialogTitle>
      <DialogContent dividers style={{ position: 'relative' }}>
        <DialogContentText id="alert-dialog-description">
          Confirm to Laboratory Assign Randomly
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={() => setPopupOpen(false)}
          startIcon={<Iconify icon="eva:close-outline" />}
        >
          Cancel
        </Button>
        <LoadingButton
          color="primary"
          variant="contained"
          onClick={handleRandomAssign}
          startIcon={<Iconify icon="ic:outline-auto-awesome" />}
          loading={loading.value}
        >
          Random
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );

  const handleUnAssignAll = async () => {
    loading.onTrue();
    try {
      const response = await unassignAllLaboratories(params.aid);
      enqueueSnackbar(`${response.message}`, { variant: 'success' });
      mutate(`${endpoints.user.student}?assignmentId=${params.aid}`);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(`${error.message}`, { variant: 'error' });
    } finally {
      loading.onFalse();
      setUnAssignPopupOpen(false);
    }
  };

  const renderUnAssignAllConfirmation = (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={unAssignPopupOpen}
      onClose={() => setUnAssignPopupOpen(false)}
    >
      <DialogTitle id="crop-dialog-title">Unassign All Laboratory Confirmation</DialogTitle>
      <DialogContent dividers style={{ position: 'relative' }}>
        <DialogContentText id="alert-dialog-description">
          Confirm to Unassign All Laboratory From Students
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={() => setUnAssignPopupOpen(false)}
          startIcon={<Iconify icon="eva:close-outline" />}
        >
          Cancel
        </Button>
        <LoadingButton
          color="error"
          variant="contained"
          onClick={handleUnAssignAll}
          startIcon={<Iconify icon="material-symbols:playlist-remove" />}
          loading={loading.value}
        >
          Confirm
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );

  if (isLoading) {
    return <SplashScreen />;
  }

  if (isError) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6" color="error">
          Student not found
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Button
          component={RouterLink}
          href={paths.classroom.assignmentId(params.cid, params.aid)}
          color="inherit"
          startIcon={<Iconify icon="carbon:chevron-left" />}
          sx={{ mb: 3 }}
        >
          Back to all labs
        </Button>

        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h4"> Assign Labs </Typography>
        </Stack>

        <Stack spacing={2} sx={{ mt: 3 }}>
          <Stack direction="row" justifyContent="space-between">
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
              <Typography variant="h6">Students</Typography>
              <Label>{students?.length}</Label>
            </Stack>

            <Stack spacing={2} direction="row">
              <Button
                variant="contained"
                color="error"
                startIcon={<Iconify icon="material-symbols:playlist-remove" />}
                onClick={() => {
                  setUnAssignPopupOpen(true);
                }}
              >
                Unassign All
              </Button>
              <Button
                variant="contained"
                startIcon={<Iconify icon="ic:outline-auto-awesome" />}
                onClick={() => {
                  setPopupOpen(true);
                }}
              >
                Random Assign
              </Button>
            </Stack>
          </Stack>

          <AssignLabsList students={students} />
        </Stack>
      </Container>

      {renderRandomConfirmation}

      {renderUnAssignAllConfirmation}
    </>
  );
}
