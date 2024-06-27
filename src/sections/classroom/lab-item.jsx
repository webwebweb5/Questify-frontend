import { mutate } from 'swr';
import { useState } from 'react';
import { m } from 'framer-motion';
import PropTypes from 'prop-types';
import { enqueueSnackbar } from 'notistack';
import { useParams, useRouter } from 'next/navigation';

import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Link,
  Stack,
  alpha,
  Button,
  Dialog,
  Divider,
  MenuItem,
  IconButton,
  Typography,
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

import { deleteLaboratory } from 'src/utils/axios';

import Iconify from 'src/components/iconify';
import Markdown from 'src/components/markdown';
import { varFade } from 'src/components/animate';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

const truncateDescription = (description, maxLength) => {
  if (description.length <= maxLength) return description;
  return `${description.substring(0, maxLength)}...`;
};

// ----------------------------------------------------------------------

export default function LabItem({ lab, index }) {
  const { laboratoryId, labTitle, description, problemStatement, professor } = lab;

  const role = useCurrentRole();

  const popover = usePopover();

  const router = useRouter();

  const params = useParams();

  const [popupOpen, setPopupOpen] = useState(false);
  const [popupDeleteOpen, setPopupDeleteOpen] = useState(false);

  const loading = useBoolean(false);

  const OnDeleteLab = async () => {
    try {
      loading.onTrue();
      const response = await deleteLaboratory(laboratoryId);
      enqueueSnackbar(`${response.message}`);
      mutate(`/api/v1/laboratory/assignment?assignmentId=${params.aid}`);
      setPopupDeleteOpen(false);
    } catch (error) {
      loading.onFalse();
      console.error('Failed to delete Laboratory:', error);
      enqueueSnackbar(`${error.message}`, {
        variant: 'error',
      });
      setPopupDeleteOpen(false);
    }
    loading.onFalse();
  };

  const renderDialog = (
    <Dialog fullWidth maxWidth="sm" open={popupOpen} onClose={() => setPopupOpen(false)}>
      <DialogTitle id="crop-dialog-title">Lab Information</DialogTitle>
      <DialogContent dividers style={{ position: 'relative' }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {labTitle}
        </Typography>
        <Markdown children={problemStatement} />
      </DialogContent>

      <DialogActions>
        <Button
          onClick={() => setPopupOpen(false)}
          startIcon={<Iconify icon="eva:close-outline" />}
        >
          Close
        </Button>
        {role !== 'ProfAcc' && (
          <LoadingButton
            color="primary"
            variant="contained"
            onClick={() => router.push(paths.lab.question(laboratoryId))}
            startIcon={<Iconify icon="carbon:play-filled-alt" />}
            // loading={loading.value}
          >
            Start Lab
          </LoadingButton>
        )}
      </DialogActions>
    </Dialog>
  );

  const renderDelete = (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={popupDeleteOpen}
      onClose={() => setPopupDeleteOpen(false)}
    >
      <DialogTitle id="crop-dialog-title">Delete Confirmation</DialogTitle>
      <DialogContent dividers style={{ position: 'relative' }}>
        <DialogContentText id="alert-dialog-description">
          Confirm to Delete Laboratory: {labTitle}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={() => setPopupDeleteOpen(false)}
          startIcon={<Iconify icon="eva:close-outline" />}
        >
          Cancel
        </Button>
        <LoadingButton
          color="error"
          variant="contained"
          onClick={OnDeleteLab}
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
      <Card
        component={m.card}
        variants={varFade().inUp}
        sx={{ position: 'relative', overflow: 'visible' }}
      >
        {role === 'ProfAcc' && (
          <IconButton onClick={popover.onOpen} sx={{ position: 'absolute', top: 8, right: 8 }}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        )}

        <Box
          component="span"
          sx={{
            px: 1,
            top: 0,
            ml: 2.5,
            left: 0,
            py: 0.25,
            borderRadius: 2,
            position: 'absolute',
            color: 'common.black',
            bgcolor: 'common.white',
            transform: 'translateY(-50%)',
            fontSize: (theme) => theme.typography.caption.fontSize,
            fontWeight: (theme) => theme.typography.fontWeightSemiBold,
            border: (theme) => `solid 1px ${alpha(theme.palette.grey['500'], 0.24)}`,
          }}
        >
          Version {index + 1}
        </Box>

        <Stack justifyContent="space-between" sx={{ height: '100%' }}>
          <Stack spacing={1} sx={{ p: 3, pb: 2 }}>
            <ListItemText
              primary={
                <Link component={RouterLink} href="" color="inherit">
                  {labTitle}
                </Link>
              }
              secondary={truncateDescription(description, 120)}
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

            <Stack
              spacing={1}
              direction="row"
              sx={{ color: 'primary.main', typography: 'caption' }}
            >
              <Iconify width={16} icon="mdi:medal-outline" />
              <Typography variant="caption">Score 10</Typography>
            </Stack>

            <Stack
              spacing={1}
              direction="row"
              sx={{ color: 'primary.main', typography: 'caption' }}
            >
              <Iconify width={16} icon="charm:graduate-cap" />
              <Typography variant="caption">{professor.displayName}</Typography>
            </Stack>
          </Stack>

          <Box>
            <Divider sx={{ borderStyle: 'dashed' }} />

            <Box
              rowGap={1}
              columnGap={1}
              display="grid"
              gridTemplateColumns={`${role !== 'ProfAcc' && 'repeat(2, 1fr)'}`}
              sx={{ p: 3 }}
            >
              <Button
                fullWidth
                variant="contained"
                sx={{ py: 1.5 }}
                startIcon={<Iconify icon="mdi:assignment-ind-outline" />}
              >
                See Submissions
              </Button>
            </Box>
          </Box>
        </Stack>
      </Card>

      {role === 'ProfAcc' && (
        <CustomPopover
          open={popover.open}
          onClose={popover.onClose}
          arrow="right-top"
          sx={{ width: 160 }}
        >
          <MenuItem
            onClick={() => {
              router.push(paths.lab.question(lab.laboratoryId));
            }}
            sx={{ color: 'primary.main' }}
          >
            <Iconify icon="carbon:play-filled-alt" />
            Test Lab
          </MenuItem>

          <MenuItem
            onClick={() => {
              popover.onClose();
              router.push(paths.classroom.assignmentLabEdit(params.cid, params.aid, laboratoryId));
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <MenuItem
            onClick={() => {
              setPopupOpen(true);
            }}
            sx={{ color: 'info.main' }}
          >
            <Iconify icon="carbon:information-filled" />
            Info
          </MenuItem>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <MenuItem
            onClick={() => {
              setPopupDeleteOpen(true);
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </CustomPopover>
      )}

      {renderDialog}

      {renderDelete}
    </>
  );
}

LabItem.propTypes = {
  lab: PropTypes.object,
  index: PropTypes.number,
};
