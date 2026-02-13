// Types shared across features
export const Role = {
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const;
export type Role = typeof Role[keyof typeof Role];

export interface User {
  id: number;
  role: Role;
  username: string;
  email: string;
}
