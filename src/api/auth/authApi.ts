import { client, extractData } from '@/api/client';
import { useAuthStore } from '@/stores/authStore';

interface LoginPayload {
  username: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
}

/** POST /auth/login */
export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const res = await client.post<unknown>('/auth/login', payload);
  const data = extractData<LoginResponse>(res.data);
  useAuthStore.getState().setAccessToken(data.accessToken);
  return data;
}

/** POST /auth/logout */
export async function logout(): Promise<void> {
  try {
    await client.post('/auth/logout');
  } finally {
    useAuthStore.getState().logout();
  }
}
