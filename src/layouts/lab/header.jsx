import PropTypes from 'prop-types';
import { useRouter } from 'next/navigation';

import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';

import { useOffSetTop } from 'src/hooks/use-off-set-top';
import { useResponsive } from 'src/hooks/use-responsive';

import { bgBlur } from 'src/theme/css';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';

import { HEADER } from '../config-layout';
import AccountPopover from '../common/account-popover';

// ----------------------------------------------------------------------

export default function Header({ onOpenNav }) {
  const theme = useTheme();

  const settings = useSettingsContext();

  const isNavHorizontal = settings.themeLayout === 'horizontal';

  const lgUp = useResponsive('up', 'lg');

  const offset = useOffSetTop(HEADER.H_DESKTOP);

  const offsetTop = offset && isNavHorizontal;

  const router = useRouter();

  const renderContent = (
    <>
      <Button
        onClick={() => {
          router.back();
        }}
        color="inherit"
        startIcon={<Iconify icon="carbon:arrow-left" />}
      >
        Back
      </Button>

      <Stack
        flexGrow={1}
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        spacing={{ xs: 0.5, sm: 1 }}
      >
        <AccountPopover />
      </Stack>
    </>
  );

  return (
    <AppBar
      sx={{
        height: HEADER.H_MOBILE,
        zIndex: theme.zIndex.appBar + 1,
        ...bgBlur({
          color: theme.palette.background.default,
        }),
        transition: theme.transitions.create(['height'], {
          duration: theme.transitions.duration.shorter,
        }),
        ...(lgUp && {
          width: 1,
          bgcolor: 'background.default',
          height: HEADER.H_DESKTOP_OFFSET,
          borderBottom: `dashed 1px ${theme.palette.divider}`,
          ...(offsetTop && {
            height: HEADER.H_DESKTOP_OFFSET,
          }),
        }),
      }}
    >
      <Toolbar
        sx={{
          height: 1,
          px: { lg: 5 },
        }}
      >
        {renderContent}
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  onOpenNav: PropTypes.func,
};
