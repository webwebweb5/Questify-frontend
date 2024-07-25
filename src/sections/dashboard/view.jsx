'use client';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Box, Stack, alpha, Avatar, Button, ListItemText } from '@mui/material';

import { useCurrentRole } from 'src/hooks/use-current-role';

import { useAuthContext } from 'src/auth/hooks';
import { useGetClassroom } from 'src/api/classroom';

import { useSettingsContext } from 'src/components/settings';

import ClassroomItem from '../classroom/classroom-item';

// ----------------------------------------------------------------------

export default function DashboardView() {
  const settings = useSettingsContext();

  const { user } = useAuthContext();

  const role = useCurrentRole();

  const { classroom: classrooms } = useGetClassroom();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography variant="h3"> Welcome, </Typography>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 2 }}>
        <Avatar
          alt={user?.displayName}
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

      {role !== 'ProfAcc' && (
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

            {/* <Box
              gap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
              }}
              sx={{ mt: 5 }}
            >
              {classrooms.map((classroom) => (
                <Box key={classroom.classroomId}>
                  <ClassroomItem key={classroom.classroomId} classroom={classroom} />
                </Box>
              ))}
            </Box> */}
          </Stack>
        </Box>
      )}

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
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h4"> My Classroom </Typography>
            <Button>See All</Button>
          </Stack>
          {classrooms.length === 0 && (
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
                {role !== 'ProfAcc' ? 'Join One! ➕' : 'Create One! ➕'}
              </Typography>
            </Stack>
          )}

          <Box sx={{ display: 'flex', overflowX: 'auto', overflowY: 'hidden', width: '100%' }}>
            {classrooms.map((classroom) => (
              <Box
                key={classroom.classroomId}
                sx={{ height: 'max-content', width: '100%', maxWidth: '350px', mx: 1 }}
              >
                <ClassroomItem key={classroom.classroomId} classroom={classroom} />
              </Box>
            ))}
          </Box>
        </Stack>
      </Box>
    </Container>
  );
}
