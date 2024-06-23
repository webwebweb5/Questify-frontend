import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { code } = await req.json();

  if (!code) {
    return new Response('Code not found', { status: 400 });
  }

  const tokenUrl = 'https://oauth.cmu.ac.th/v1/GetToken.aspx';
  const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI;
  const clientId = process.env.NEXT_PUBLIC_CMU_OAUTH_CLIENT_ID;
  const clientSecret = process.env.NEXT_PUBLIC_CMU_OAUTH_CLIENT_SECRET;

  try {
    const tokenResponse = await axios.post(tokenUrl, null, {
      params: {
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token: accessToken } = await tokenResponse.data;

    const questifyToken = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/api/v1/auth/login`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const { token } = await questifyToken.data.data;

    const getProfile = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/api/v1/auth/profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const user = await getProfile.data.data;

    return NextResponse.json({ accessToken: token, user });
  } catch (error) {
    return NextResponse.json({ error });
  }
}
