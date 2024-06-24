import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import { Avatar, Button, useTheme, IconButton, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useParams, usePathname } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';
import { useMockedUser } from 'src/hooks/use-mocked-user';

import { bgBlur } from 'src/theme/css';
import { useGetClassroomById } from 'src/api/classroom';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { NavSectionVertical } from 'src/components/nav-section';

import { NAV, HEADER } from '../config-layout';
import { useNavData } from './config-navigation';

// ----------------------------------------------------------------------

export default function NavVerticalClassroom({ openNav, onCloseNav }) {
  const { user } = useMockedUser();

  const pathname = usePathname();

  const lgUp = useResponsive('up', 'lg');

  const navData = useNavData();

  const theme = useTheme();

  const [navOpen, setNavOpen] = useState(true);

  const params = useParams();

  const { classroom } = useGetClassroomById(params.cid);

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Button
        component={RouterLink}
        href={paths.dashboard.classroom}
        color="inherit"
        startIcon={<Iconify icon="carbon:chevron-left" />}
        sx={{ mt: 3, width: 'fit-content' }}
      >
        All Classroom
      </Button>

      <Avatar
        alt={classroom?.title?.charAt(0)}
        src=""
        variant="rounded"
        sx={{ width: 58, height: 58, mb: 1, mt: 3, ml: 3 }}
      >
        {classroom?.title?.charAt(0)}
      </Avatar>

      <Typography variant="h6" sx={{ mt: 1, ml: 3, mr: 1 }}>
        {classroom?.title}
      </Typography>

      <NavSectionVertical
        data={navData}
        slotProps={{
          currentRole: user?.role,
        }}
      />

      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  const renderNavButton = (
    <IconButton
      size="small"
      onClick={() => setNavOpen(!navOpen)}
      sx={{
        p: 0.5,
        top: 100,
        position: 'fixed',
        left: NAV.W_VERTICAL + NAV.W_MINI + 2 - (navOpen ? 0 : NAV.W_VERTICAL),
        zIndex: theme.zIndex.appBar + 1,
        border: `dashed 1px ${theme.palette.divider}`,
        ...bgBlur({ opacity: 0.48, color: theme.palette.background.default }),
        '&:hover': {
          bgcolor: 'background.default',
        },
      }}
    >
      <Iconify
        width={16}
        icon={navOpen ? 'eva:arrow-ios-back-fill' : 'eva:arrow-ios-forward-fill'}
      />
    </IconButton>
  );

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: navOpen ? NAV.W_VERTICAL : 0 },
      }}
    >
      {/* <NavToggleButton /> */}
      {lgUp && renderNavButton}

      {lgUp ? (
        <Stack
          sx={{
            top: HEADER.H_MOBILE,
            height: 1,
            position: 'fixed',
            width: navOpen ? NAV.W_VERTICAL : 0,
            // eslint-disable-next-line no-shadow
            borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {renderContent}
        </Stack>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV.W_VERTICAL,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}

NavVerticalClassroom.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};
