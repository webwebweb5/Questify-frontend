import PropTypes from 'prop-types';

import {
  Box,
  Card,
  Link,
  Stack,
  Button,
  Divider,
  MenuItem,
  IconButton,
  Typography,
  ListItemText,
} from '@mui/material';

import { RouterLink } from 'src/routes/components';

import { fDate } from 'src/utils/format-time';

import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function LabItem({ lab }) {
  const { labTitle, time } = lab;

  const popover = usePopover();

  return (
    <>
      <Card>
        <IconButton onClick={popover.onOpen} sx={{ position: 'absolute', top: 8, right: 8 }}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>

        <Stack sx={{ p: 3, pb: 2 }}>
          {/* <Avatar alt={title} src="" variant="rounded" sx={{ width: 48, height: 48, mb: 2 }}>
            {title?.charAt(0).toUpperCase()}
          </Avatar> */}

          <ListItemText
            sx={{ mb: 1 }}
            primary={
              <Link component={RouterLink} href="" color="inherit">
                {labTitle}
              </Link>
            }
            secondary={`Due to ${fDate(time)}`}
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
            spacing={0.5}
            direction="row"
            alignItems="center"
            sx={{ color: 'primary.main', typography: 'caption' }}
          >
            <Iconify width={16} icon="carbon:location-star-filled" />
            <Typography variant="caption" noWrap>
              Match all the test cases Lorem ipsum dolor sit amet.
            </Typography>
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
    </>
  );
}

LabItem.propTypes = {
  lab: PropTypes.object,
};
