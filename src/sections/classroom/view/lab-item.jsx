import { useState } from 'react';
import PropTypes from 'prop-types';
import { useParams, useRouter } from 'next/navigation';

import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Link,
  Stack,
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
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fDate } from 'src/utils/format-time';

import Iconify from 'src/components/iconify';
import Markdown from 'src/components/markdown';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function LabItem({ lab }) {
  const { laboratoryId, labTitle, description, problemStatement, endTime } = lab;

  const popover = usePopover();

  const router = useRouter();

  const params = useParams();

  const [popupOpen, setPopupOpen] = useState(false);

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
        <LoadingButton
          color="primary"
          variant="contained"
          // onClick=""
          startIcon={<Iconify icon="carbon:play-filled-alt" />}
          // loading={loading.value}
        >
          Start Lab
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );

  return (
    <>
      <Card>
        <IconButton onClick={popover.onOpen} sx={{ position: 'absolute', top: 8, right: 8 }}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>

        <Stack sx={{ p: 3, pb: 2 }}>
          <ListItemText
            sx={{ mb: 1 }}
            primary={
              <Link component={RouterLink} href="" color="inherit">
                {labTitle}
              </Link>
            }
            secondary={description}
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

          <Stack spacing={1} direction="row" sx={{ color: 'primary.main', typography: 'caption' }}>
            <Iconify width={16} icon="carbon:time-filled" />
            <Typography variant="caption">{`Due to ${fDate(endTime)}`}</Typography>
          </Stack>
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box
          rowGap={1}
          columnGap={1}
          display="grid"
          gridTemplateColumns="repeat(2, 1fr)"
          sx={{ p: 3 }}
        >
          <Button
            variant="contained"
            color="primary"
            sx={{ py: 1.5 }}
            startIcon={<Iconify icon="carbon:play-filled-alt" />}
          >
            Start Lab
          </Button>
          <Button
            variant="contained"
            color="info"
            sx={{ py: 1.5 }}
            startIcon={<Iconify icon="carbon:information-filled" />}
            onClick={() => setPopupOpen(true)}
          >
            Info
          </Button>
        </Box>
      </Card>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
            router.push(paths.classroom.assignmentLabEdit(params.cid, params.aid, laboratoryId));
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>

      {renderDialog}
    </>
  );
}

LabItem.propTypes = {
  lab: PropTypes.object,
};
