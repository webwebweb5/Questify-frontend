'use client';

import { mutate } from 'swr';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useParams } from 'next/navigation';

import { LoadingButton } from '@mui/lab';
import {
  Box,
  Stack,
  Table,
  Avatar,
  Dialog,
  Button,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  TableHead,
  IconButton,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableContainer,
  DialogContentText,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

import { removeStudentFromClassroom } from 'src/utils/axios';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', minWidth: 180, width: { xs: 300, lg: 450 } },
  { id: 'mail', label: 'Email', align: 'left' },
  { id: 'actions', label: '', align: 'right' },
];

// ----------------------------------------------------------------------

export default function MemberList({ users }) {
  const mdUp = useResponsive('up', 'md');

  const popover = usePopover();

  const [popupOpen, setPopupOpen] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState(null);

  const loading = useBoolean(false);

  const { enqueueSnackbar } = useSnackbar();

  const params = useParams();

  const OnRemoveStudent = async () => {
    if (!selectedStudent) return;

    loading.onTrue();
    try {
      const response = await removeStudentFromClassroom(params.cid, selectedStudent.studentId);
      enqueueSnackbar(`${response.message}`, { variant: 'success' });
      mutate(`api/v1/classroom?classroomId=${params.cid}`); // Refetch students
      setPopupOpen(false);
    } catch (error) {
      enqueueSnackbar(`${error.message}`, { variant: 'error' });
      console.error('Failed to remove student:', error);
    } finally {
      loading.onFalse();
    }
  };

  const handleRemoveClick = (student) => {
    setSelectedStudent(student);
    setPopupOpen(true);
  };

  const renderRemove = (
    <Dialog fullWidth maxWidth="sm" open={popupOpen} onClose={() => setPopupOpen(false)}>
      <DialogTitle>Remove Confirmation</DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
          Confirm to remove student: {selectedStudent?.displayName} ({selectedStudent?.studentId})
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
          onClick={OnRemoveStudent}
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
          loading={loading.value}
        >
          Remove
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );

  if (users?.length === 0) {
    return <Box>Student not found</Box>;
  }

  return (
    <>
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
              {users?.map((user) => (
                <TableRow key={user.studentId}>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar alt={user.firstName_EN} sx={{ width: 36, height: 36 }}>
                        {user.firstName_EN.charAt(0)}
                      </Avatar>
                      <Box sx={{ display: 'flex', flexDirection: 'column', width: 'fit-content' }}>
                        <Typography sx={{ width: 'fit-content' }}>
                          {user.displayName
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
                          {user.studentId}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell align="left">
                    <Typography>{user.email}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={(e) => {
                        popover.onOpen(e);
                        setSelectedStudent(user);
                      }}
                    >
                      <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem onClick={() => popover.onClose()} sx={{ color: 'primary.main' }}>
          <Iconify icon="carbon:chart-histogram" />
          Grades
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
            handleRemoveClick(selectedStudent);
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Remove
        </MenuItem>
      </CustomPopover>

      {renderRemove}
    </>
  );
}

MemberList.propTypes = {
  users: PropTypes.array,
};
