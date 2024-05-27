import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import { useResponsive } from 'src/hooks/use-responsive';

import { HEADER } from '../config-layout';

// ----------------------------------------------------------------------

export default function Main({ children }) {
  const lgUp = useResponsive('up', 'lg');

  return (
    <Box
      component="main"
      sx={{
        minHeight: 1,
        display: 'flex',
        flexDirection: 'column',
        pt: `${HEADER.H_MOBILE}px`,
        ...(lgUp && {
          pt: `${HEADER.H_MOBILE}px`,
        }),
      }}
    >
      {children}
    </Box>
  );
}

Main.propTypes = {
  children: PropTypes.node,
};
