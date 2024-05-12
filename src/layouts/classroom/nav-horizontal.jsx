import { memo } from 'react';

import { Box, Stack } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';

import { useMockedUser } from 'src/hooks/use-mocked-user';

import { bgBlur } from 'src/theme/css';

import { NavSectionHorizontal } from 'src/components/nav-section';

import { HEADER } from '../config-layout';
import { useNavData } from './config-navigation';
import HeaderShadow from '../common/header-shadow';

// ----------------------------------------------------------------------

function NavHorizontal() {
  const theme = useTheme();

  const { user } = useMockedUser();

  const navData = useNavData();

  return (
    <Stack
      sx={{
        top: HEADER.H_MOBILE_OFFSET,
        borderBottom: `dashed 1px ${theme.palette.divider}`,
      }}
    >
      <Toolbar
        sx={{
          ...bgBlur({
            color: theme.palette.background.default,
          }),
        }}
      >
        {/* <Scrollbar> */}
        <Box sx={{ overflow: 'auto' }}>
          <NavSectionHorizontal
            data={navData}
            slotProps={{
              currentRole: user?.role,
            }}
            sx={{
              ...theme.mixins.toolbar,
            }}
          />
        </Box>
        {/* </Scrollbar> */}
      </Toolbar>

      <HeaderShadow />
    </Stack>
  );
}

export default memo(NavHorizontal);
