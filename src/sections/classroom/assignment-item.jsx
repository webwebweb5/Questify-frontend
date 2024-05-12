import PropTypes from 'prop-types';

import {
  Card,
  Avatar,
  IconButton,
  Link,
  ListItemText,
  MenuItem,
  Stack,
  useTheme,
} from '@mui/material';

import { RouterLink } from 'src/routes/components';

import { fDate, fDateTime } from 'src/utils/format-time';

import Iconify from 'src/components/iconify';
import TextMaxLine from 'src/components/text-max-line';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

export default function AssignmentItem({ assignment }) {
  const theme = useTheme();

  const popover = usePopover();

  const { labTitle, description, professor, startTime, endTime } = assignment;
  return (
    <Stack component={Card} direction="row">
      <IconButton onClick={popover.onOpen} sx={{ position: 'absolute', top: 8, right: 8 }}>
        <Iconify icon="eva:more-vertical-fill" />
      </IconButton>
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
            primary={professor}
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
              <Link color="inherit" component={RouterLink} href="">
                <TextMaxLine variant="subtitle1" line={2}>
                  {labTitle}
                </TextMaxLine>
              </Link>

              <TextMaxLine variant="body2" sx={{ color: 'text.secondary' }}>
                {description}
              </TextMaxLine>

              <TextMaxLine variant="body2" sx={{ color: 'text.secondary' }}>
                Due {fDate(endTime)}
              </TextMaxLine>
            </Stack>
          </Stack>
        </Stack>
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

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
    </Stack>
  );
}

AssignmentItem.propTypes = {
  assignment: PropTypes.object,
};
