import * as Yup from 'yup';
import { mutate } from 'swr';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';

import { LoadingButton } from '@mui/lab';
import {
  Box,
  Stack,
  Table,
  Avatar,
  Button,
  Dialog,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableContainer,
  DialogContentText,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

import { endpoints, assignLaboratory, unassignLaboratory } from 'src/utils/axios';

import { useGetLaboratoriesByAssignmentId } from 'src/api/laboratory';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { SplashScreen } from 'src/components/loading-screen';
import FormProvider, { RHFSelect } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', minWidth: 180, width: { xs: 300, lg: 450 } },
  { id: 'mail', label: 'Email' },
  { id: 'assign-lab', label: 'Assign' },
  { id: 'actions', label: '', align: 'right' },
];

// ----------------------------------------------------------------------

export default function AssignLabsList({ students }) {
  const mdUp = useResponsive('up', 'md');

  const params = useParams();

  const { laboratories, isLoading } = useGetLaboratoriesByAssignmentId(params.aid);

  const loading = useBoolean(false);
  const { enqueueSnackbar } = useSnackbar();
  const [popupOpen, setPopupOpen] = useState(false);

  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const LabVersionSchema = Yup.object().shape({
    labVersion: Yup.string()
      .required('Lab version is required')
      .oneOf(
        laboratories.map((lab) => lab.laboratoryId),
        'Invalid lab ID'
      ),
  });

  const defaultValues = useMemo(() => {
    const values = {};
    students?.forEach((student) => {
      values[`labVersion-${student.studentId}`] = student.laboratoryId;
    });
    return values;
  }, [students]);

  const methods = useForm({
    resolver: yupResolver(LabVersionSchema),
    defaultValues,
  });

  const { setValue, watch } = methods;

  const handleLabVersionChange = async (studentId, labId) => {
    loading.onTrue();
    try {
      await assignLaboratory(params.aid, studentId, labId);
      enqueueSnackbar('Laboratory assigned successfully!', { variant: 'success' });
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Assignment failed! Please try again.', { variant: 'error' });
    } finally {
      loading.onFalse();
    }
  };

  const handleSelectChange = (studentId, labId) => {
    setValue(`labVersion-${studentId}`, labId);
    handleLabVersionChange(studentId, labId);
  };

  const handleUnassign = async () => {
    loading.onTrue();
    try {
      const response = await unassignLaboratory(params.aid, selectedStudentId);
      enqueueSnackbar(`${response.message}`, { variant: 'success' });
      mutate(`${endpoints.user.student}?assignmentId=${params.aid}`);
      setValue(`labVersion-${selectedStudentId}`, '');
      setSelectedStudentId(null); // Clear selected studentId after unassign
    } catch (error) {
      console.error(error);
      enqueueSnackbar(`${error.message}`, { variant: 'error' });
    } finally {
      loading.onFalse();
      setPopupOpen(false);
    }
  };

  const renderUnAssignConfirmation = (
    <Dialog fullWidth maxWidth="sm" open={popupOpen} onClose={() => setPopupOpen(false)}>
      <DialogTitle id="crop-dialog-title">Unassign Laboratory Confirmation</DialogTitle>
      <DialogContent dividers style={{ position: 'relative' }}>
        <DialogContentText id="alert-dialog-description">
          Confirm to Unassign Laboratory for Student ID: {selectedStudentId}
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
          color="error"
          variant="contained"
          onClick={handleUnassign}
          startIcon={<Iconify icon="material-symbols:label-off-outline" />}
          loading={loading.value}
        >
          Unassign
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );

  if (students.length === 0) {
    return <Box>No User...</Box>;
  }

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <>
      <Box sx={{ maxWidth: 1227.33 }}>
        <TableContainer sx={{ overflow: 'unset' }}>
          <Scrollbar>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  {TABLE_HEAD.map((headCell) => (
                    <TableCell
                      key={headCell.id}
                      align={headCell.align || 'left'}
                      sx={{
                        backgroundColor: 'transparent',
                        minWidth: headCell.minWidth,
                        // eslint-disable-next-line no-nested-ternary
                        width: headCell.width
                          ? mdUp
                            ? headCell.width.lg
                            : headCell.width.xs
                          : 'auto',
                      }}
                    >
                      {headCell.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.studentId}>
                    <TableCell sx={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar sx={{ width: 36, height: 36 }}>
                          {student.firstName_EN.charAt(0)}
                        </Avatar>
                        <Box
                          sx={{ display: 'flex', flexDirection: 'column', width: 'fit-content' }}
                        >
                          <Typography sx={{ width: 'fit-content' }}>
                            {student.displayName
                              .toLowerCase()
                              .split(' ')
                              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(' ')}
                          </Typography>
                          <Typography
                            component="span"
                            variant="caption"
                            color="text.disabled"
                            sx={{ mt: 0.5, width: 'fit-content' }}
                          >
                            {student.studentId}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell align="left" sx={{ borderRadius: 0 }}>
                      <Typography>{student.email}</Typography>
                    </TableCell>
                    <TableCell>
                      <FormProvider methods={methods}>
                        <Stack sx={{ width: 'fit-content', minWidth: 200, maxWidth: 200 }}>
                          <RHFSelect
                            name={`labVersion-${student.studentId}`}
                            label="Lab Version"
                            value={watch(`labVersion-${student.studentId}`)}
                            onChange={(e) => handleSelectChange(student.studentId, e.target.value)}
                            disabled={loading.value}
                          >
                            {laboratories.map((lab) => (
                              <MenuItem key={lab.laboratoryId} value={lab.laboratoryId}>
                                {lab.labTitle}
                              </MenuItem>
                            ))}
                          </RHFSelect>
                        </Stack>
                      </FormProvider>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="error"
                        startIcon={<Iconify icon="material-symbols:label-off-outline" />}
                        onClick={() => {
                          setSelectedStudentId(student.studentId);
                          setPopupOpen(true);
                        }}
                      >
                        Unassign
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
      </Box>

      {renderUnAssignConfirmation}
    </>
  );
}

AssignLabsList.propTypes = {
  students: PropTypes.array.isRequired,
};
