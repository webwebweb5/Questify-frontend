import { m } from 'framer-motion';
import PropTypes from 'prop-types';

import IconButton from '@mui/material/IconButton';
import Badge, { badgeClasses } from '@mui/material/Badge';

import Iconify from 'src/components/iconify';
import { varHover } from 'src/components/animate';
import { useSettingsContext } from 'src/components/settings';

// ----------------------------------------------------------------------

export default function SettingsButton({ sx }) {
  const settings = useSettingsContext();

  return (
    <Badge
      color="error"
      variant="dot"
      invisible={!settings.canReset}
      sx={{
        [`& .${badgeClasses.badge}`]: {
          top: 8,
          right: 8,
        },
        ...sx,
      }}
    >
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        aria-label="settings"
        onClick={settings.onToggle}
        sx={{
          width: 40,
          height: 40,
        }}
      >
        <Iconify icon="solar:settings-bold-duotone" width={24} />
      </IconButton>
    </Badge>
  );
}

SettingsButton.propTypes = {
  sx: PropTypes.object,
};
