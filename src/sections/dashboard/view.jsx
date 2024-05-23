'use client';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useAuthContext } from 'src/auth/hooks';

import { useSettingsContext } from 'src/components/settings';

// ----------------------------------------------------------------------

export default function DashboardView() {
  const settings = useSettingsContext();

  const { user } = useAuthContext();

  console.log(user);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography variant="h4"> Dashboard </Typography>
      <Typography variant="h4"> User Id: {user?.userId} </Typography>

      {/* <Box
        sx={{
          mt: 5,
          width: 1,
          height: 320,
          borderRadius: 2,
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
          border: (theme) => `dashed 1px ${theme.palette.divider}`,
        }}
      /> */}
    </Container>
  );
}
