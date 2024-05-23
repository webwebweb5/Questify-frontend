'use client';

import { useRouter } from 'next/navigation';

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
      <Stack spacing={2} sx={{ mb: 5 }}>
        <Typography variant="h4">Sign in to Questify</Typography>
      </Stack>

      <Stack spacing={2.5}>
        <LoadingButton
          fullWidth
          color="inherit"
          size="large"
          onClick={handleLogin}
          variant="contained"
        >
          Login with CMU Account
        </LoadingButton>
      </Stack>
    </>
  );
}
