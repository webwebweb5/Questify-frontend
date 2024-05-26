'use client';

import { useRouter } from 'next/navigation';

import { Box } from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

// ----------------------------------------------------------------------

export default function JwtLoginView() {
  const router = useRouter();

  const handleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_CMU_OAUTH_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI;
    const authorizationUrl = `https://oauth.cmu.ac.th/v1/Authorize.aspx?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=cmuitaccount.basicinfo`;
    router.push(authorizationUrl);
  };

  return (
    <>
      <Stack spacing={1} sx={{ mb: 5, mx: 6 }} alignItems="center">
        <Box sx={{ position: 'relative' }}>
          <Typography variant="h4">Sign in to Questify</Typography>
          <Box
            sx={{
              right: 0,
              bottom: 4,
              width: 70,
              height: 10,
              opacity: 0.48,
              bgcolor: 'primary.main',
              position: 'absolute',
              zIndex: -1,
            }}
          />
        </Box>
        <Typography variant="subtitle1" sx={{ color: 'text.secondary' }} textAlign="center">
          Revolutionizing software engineering education with AI, cloud computing, and modern web
          technologies!
        </Typography>
      </Stack>

      <Stack spacing={2.5}>
        <LoadingButton
          fullWidth
          color="inherit"
          size="large"
          onClick={handleLogin}
          variant="contained"
        >
          <Box
            component="div"
            sx={{
              height: 24,
              display: 'inline-flex',
              mr: 2,
            }}
          >
            <Box component="img" alt="cmu-logo" src="/assets/images/sub-logo/cmu-sub-logo.png" />
          </Box>
          Login with CMU Account
        </LoadingButton>
      </Stack>
    </>
  );
}
