import { mutate } from 'swr';
import { useState } from 'react';
import { m } from 'framer-motion';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { LoadingButton } from '@mui/lab';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import {
  Button,
  Dialog,
  Tooltip,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';
import { useCurrentRole } from 'src/hooks/use-current-role';

import { endpoints, deleteClassroom } from 'src/utils/axios';

import Iconify from 'src/components/iconify';
import { varHover } from 'src/components/animate';
import TextMaxLine from 'src/components/text-max-line';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function ClassroomItem({ classroom }) {
  const popover = usePopover();

  const role = useCurrentRole();

  const { classroomId, professor, title, description, studentQuantity } = classroom;

  const router = useRouter();

  const [popupOpen, setPopupOpen] = useState(false);

  const loading = useBoolean(false);

  const { enqueueSnackbar } = useSnackbar();

  const OnDeleteClassroom = async () => {
    loading.onTrue();
    try {
      const response = await deleteClassroom(classroomId);
      enqueueSnackbar(`${response.message}`);
      mutate(endpoints.classroom.list);
      setPopupOpen(false);
    } catch (error) {
      loading.onFalse();
      enqueueSnackbar(`${error.message}`, {
        variant: 'error',
      });
      console.error('Failed to delete Classroom:', error);
      setPopupOpen(false);
    }
    loading.onFalse();
  };

  const renderDelete = (
    <Dialog fullWidth maxWidth="sm" open={popupOpen} onClose={() => setPopupOpen(false)}>
      <DialogTitle id="crop-dialog-title">Delete Confirmation</DialogTitle>
      <DialogContent dividers style={{ position: 'relative' }}>
        <DialogContentText id="alert-dialog-description">
          Confirm to Delete Classroom: {title}
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
          onClick={OnDeleteClassroom}
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
      <Link
        component={m.div}
        onClick={() => {
          router.push(paths.classroom.general(classroomId));
        }}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.02, 0.99)}
        underline="none"
        sx={{ cursor: 'pointer' }}
      >
        <Tooltip title={title} placement="top" arrow>
          <Card
            sx={{
              '&:hover': {
                backgroundColor: (theme) => theme.palette.action.hover,
              },
            }}
          >
            {role === 'ProfAcc' && (
              <IconButton
                onClick={(event) => {
                  event.stopPropagation();
                  popover.onOpen(event);
                }}
                sx={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}
              >
                <Iconify icon="eva:more-vertical-fill" />
              </IconButton>
            )}

            <Stack sx={{ p: 3, pb: 2 }}>
              <Avatar alt={title} src="" variant="rounded" sx={{ width: 48, height: 48, mb: 2 }}>
                {title?.charAt(0).toUpperCase()}
              </Avatar>

              <ListItemText
                sx={{ mb: 1 }}
                primary={
                  <TextMaxLine variant="subtitle1" line={1}>
                    {title}
                  </TextMaxLine>
                }
                secondary={
                  <TextMaxLine variant="caption" line={2}>
                    {description}
                  </TextMaxLine>
                }
                primaryTypographyProps={{
                  typography: 'subtitle1',
                }}
                secondaryTypographyProps={{
                  mt: 1,
                  component: 'span',
                  typography: 'caption',
                  color: 'text.disabled',
                }}
              />
            </Stack>

            <Divider sx={{ borderStyle: 'dashed' }} />

            <Box rowGap={1.5} display="grid" gridTemplateColumns="repeat(2, 1fr)" sx={{ p: 3 }}>
              {[
                {
                  label: `${professor.professorId}`,
                  icon: <Iconify width={16} icon="mdi:teacher" sx={{ flexShrink: 0 }} />,
                },
                {
                  label: `${studentQuantity} Member${studentQuantity > 0 ? 's' : ''}`,
                  icon: (
                    <Iconify
                      width={16}
                      icon="solar:users-group-rounded-bold"
                      sx={{ flexShrink: 0 }}
                    />
                  ),
                },
              ].map((item) => (
                <Stack
                  key={item.label}
                  spacing={0.5}
                  flexShrink={0}
                  direction="row"
                  alignItems="center"
                  sx={{ color: 'primary.main', minWidth: 0 }}
                >
                  {item.icon}
                  <Typography variant="caption" noWrap>
                    {item.label}
                  </Typography>
                </Stack>
              ))}
            </Box>
          </Card>
        </Tooltip>
      </Link>

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
              router.push(paths.classroom.edit(classroomId));
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

      {renderDelete}
    </>
  );
}

ClassroomItem.propTypes = {
  classroom: PropTypes.object,
};
