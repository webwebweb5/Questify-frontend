'use client';

import PropTypes from 'prop-types';

import { Box } from '@mui/material';

import { useResponsive } from 'src/hooks/use-responsive';

import Main from './main';
import NavHorizontal from './nav-horizontal';
import NavVerticalClassroom from './nav-vertical-classroom';

// ----------------------------------------------------------------------

export default function ClassroomLayout({ children }) {
  const renderVertical = <NavVerticalClassroom />;

  const lgUp = useResponsive('up', 'lg');

  return (
    <>
      {/* <ClassroomHeader /> */}

      <Box
        sx={{
          minHeight: 1,
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
        }}
      >
        {renderVertical}

        <Main>
          {!lgUp && <NavHorizontal />}
          {children}
        </Main>
      </Box>
    </>
  );
}

ClassroomLayout.propTypes = {
  children: PropTypes.node,
};
