'use client';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Box, Stack, alpha, Avatar, ListItemText } from '@mui/material';

import { useAuthContext } from 'src/auth/hooks';

import { useSettingsContext } from 'src/components/settings';

// ----------------------------------------------------------------------

export default function DashboardView() {
  const settings = useSettingsContext();

  const { user } = useAuthContext();

  console.log(user);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography variant="h3"> Welcome, </Typography>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 2 }}>
        <Avatar
          sx={{
            width: 36,
            height: 36,
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        >
          {user?.displayName?.charAt(0).toUpperCase()}
        </Avatar>
        <ListItemText
          primary={user?.displayName}
          secondary={user?.userId}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
            color: 'text.disabled',
          }}
        />
      </Stack>

      <Box
        sx={{
          mt: 6,
          width: 1,
          borderRadius: 2,
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
          border: (theme) => `dashed 1px ${theme.palette.divider}`,
        }}
      >
        <Stack spacing={3} sx={{ p: 3 }}>
          <Typography variant="h4"> Assignments </Typography>
          <Stack
            flexGrow={1}
            alignItems="center"
            justifyContent="center"
            sx={{
              pt: 1,
              pb: 5,
              height: 1,
            }}
          >
            <Typography
              variant="h6"
              component="span"
              sx={{ mt: 1, color: 'text.disabled', textAlign: 'center' }}
            >
              No Assignment
            </Typography>

            <Typography
              variant="caption"
              sx={{ mt: 1, color: 'success.main', textAlign: 'center' }}
            >
              Congratulation! 🎉
            </Typography>
          </Stack>
        </Stack>
      </Box>

      <Box
        sx={{
          mt: 6,
          width: 1,
          borderRadius: 2,
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
          border: (theme) => `dashed 1px ${theme.palette.divider}`,
        }}
      >
        <Stack spacing={3} sx={{ p: 3 }}>
          <Typography variant="h4"> My Classroom </Typography>
          <Stack
            flexGrow={1}
            alignItems="center"
            justifyContent="center"
            sx={{
              pt: 1,
              pb: 5,
              height: 1,
            }}
          >
            <Typography
              variant="h6"
              component="span"
              sx={{ mt: 1, color: 'text.disabled', textAlign: 'center' }}
            >
              No Classroom
            </Typography>

            <Typography variant="caption" sx={{ mt: 1, color: 'info.main', textAlign: 'center' }}>
              Join One! ➕
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Container>
  );
}
