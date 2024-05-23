import { useAuthContext } from 'src/auth/hooks';

export function useCurrentRole() {
  const { user } = useAuthContext();

  return user?.role;
}
