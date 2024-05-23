import { mutate } from 'swr';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useParams, useRouter } from 'next/navigation';

import { LoadingButton } from '@mui/lab';
import {
  Card,
  Link,
  Stack,
  Avatar,
  Dialog,
  Button,
  MenuItem,
  useTheme,
  IconButton,
  DialogTitle,
  ListItemText,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';
import { useCurrentRole } from 'src/hooks/use-current-role';

import { deleteAssignment } from 'src/utils/axios';
import { fDate, fDateTime } from 'src/utils/format-time';

import Iconify from 'src/components/iconify';
import TextMaxLine from 'src/components/text-max-line';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

export default function AssignmentItem({ assignment }) {
  const theme = useTheme();

  const role = useCurrentRole();

  const popover = usePopover();

  const params = useParams();

  const router = useRouter();

  const { assignmentId, title, description, professor, startTime, endTime } = assignment;

  const [popupOpen, setPopupOpen] = useState(false);

  const loading = useBoolean(false);

  const { enqueueSnackbar } = useSnackbar();

  const OnDeleteAssignment = async () => {
    try {
      loading.onTrue();
      await deleteAssignment(assignmentId);
      enqueueSnackbar('Delete success!');
      setPopupOpen(false);
      mutate(`/assignment/classroom?classroomId=${params.cid}`);
    } catch (error) {
      loading.onFalse();
      enqueueSnackbar('Delete failed!', {
        variant: 'error',
      });
      console.error('Failed to delete Assignment:', error);
      setPopupOpen(false);
    }
    loading.onFalse();
  };

  const renderDelete = (
    <Dialog fullWidth maxWidth="sm" open={popupOpen} onClose={() => setPopupOpen(false)}>
      <DialogTitle id="crop-dialog-title">Delete Confirmation</DialogTitle>
      <DialogContent dividers style={{ position: 'relative' }}>
        <DialogContentText id="alert-dialog-description">
          Confirm to Delete Assignment: {title}
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
          onClick={OnDeleteAssignment}
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
          loading={loading.value}
        >
          Delete
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );

  return (
    <>
      <Stack component={Card} direction="row">
        {role === 'ProfAcc' && (
          <IconButton onClick={popover.onOpen} sx={{ position: 'absolute', top: 8, right: 8 }}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        )}
        <Stack
          spacing={2}
          sx={{
            p: 3,
            width: '100%',
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt="avatar" src="" />
            <ListItemText
              primary={professor.professorId}
              secondary={fDateTime(startTime)}
              secondaryTypographyProps={{
                mt: 0.5,
                component: 'span',
                typography: 'caption',
                color: 'text.disabled',
              }}
            />
          </Stack>

          <Stack
            component={Card}
            direction="row"
            sx={{ border: `dashed 1px ${theme.palette.divider}` }}
          >
            <Stack
              sx={{
                p: 3,
              }}
            >
              <Stack spacing={1} flexGrow={1}>
                <Link
                  color="inherit"
                  component={RouterLink}
                  href={paths.classroom.assignmentId(params.cid, assignmentId)}
                >
                  <TextMaxLine variant="subtitle1" line={2}>
                    {title}
                  </TextMaxLine>
                </Link>

                <TextMaxLine variant="body2" sx={{ color: 'text.secondary' }}>
                  {description}
                </TextMaxLine>

                <TextMaxLine variant="body2" sx={{ color: 'text.secondary' }}>
                  {endTime ? `Due ${fDate(endTime)}` : 'No Due Date'}
                </TextMaxLine>
              </Stack>
            </Stack>
          </Stack>
        </Stack>

        {role === 'ProfAcc' && (
          <CustomPopover
            open={popover.open}
            onClose={popover.onClose}
            arrow="right-top"
            sx={{ width: 140 }}
          >
            <MenuItem
              onClick={() => {
                popover.onClose();
                router.push(paths.classroom.assignmentEdit(params.cid, assignmentId));
              }}
            >
              <Iconify icon="solar:pen-bold" />
              Edit
            </MenuItem>

            <MenuItem
              onClick={() => {
                setPopupOpen(true);
              }}
              sx={{ color: 'error.main' }}
            >
              <Iconify icon="solar:trash-bin-trash-bold" />
              Delete
            </MenuItem>
          </CustomPopover>
        )}
      </Stack>

      {renderDelete}
    </>
  );
}

AssignmentItem.propTypes = {
  assignment: PropTypes.object,
};
