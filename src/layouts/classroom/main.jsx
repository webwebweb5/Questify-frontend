import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import { useResponsive } from 'src/hooks/use-responsive';

import { useSettingsContext } from 'src/components/settings';

import { NAV } from '../config-layout';

// ----------------------------------------------------------------------

// const SPACING = 8;

export default function Main({ children, sx, ...other }) {
  const settings = useSettingsContext();

  const lgUp = useResponsive('up', 'lg');

  const isNavMini = settings.themeLayout === 'mini';

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        minHeight: 1,
        display: 'flex',
        flexDirection: 'column',
        ...(lgUp && {
          px: 2,
          width: `calc(100% - ${NAV.W_VERTICAL}px)`,
          ...(isNavMini && {
            width: `calc(100% - ${NAV.W_MINI}px)`,
          }),
        }),
        ...(!lgUp && {
          mt: -4,
        }),
        ...sx,
      }}
      {...other}
    >
      {children}
    </Box>
  );
}

Main.propTypes = {
  children: PropTypes.node,
  sx: PropTypes.object,
};
