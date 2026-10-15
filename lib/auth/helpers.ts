import { AuthError, UserRole } from "./enums";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  bio?: string;
  avatar?: string; // Uploadcare CDN URL
};

// Either it worked and you get a user, or it failed and you get an AuthError.
export type AuthResult =
  | { ok: true; user: AuthUser }
  | { ok: false; error: AuthError };

// Record<AuthError, string> means TypeScript gives a compile error
// if you add a new AuthError and forget to write its message here.
export const authErrorMessages: Record<AuthError, string> = {
  [AuthError.InvalidCredentials]: "Email or password is incorrect.",
  [AuthError.EmailTaken]: "An account with this email already exists.",
  [AuthError.AccountSuspended]: "This account has been suspended.",
  [AuthError.Unauthenticated]: "Please log in to continue.",
  [AuthError.Forbidden]: "You don't have permission to view this page.",
  [AuthError.SessionExpired]: "Your session has expired. Please log in again.",
};

// Higher number = more access.
const roleRank: Record<UserRole, number> = {
  [UserRole.Reader]: 0,
  [UserRole.Writer]: 1,
  [UserRole.Editor]: 2,
  [UserRole.Admin]: 3,
};

export function hasRole(userRole: UserRole, required: UserRole): boolean {
  return roleRank[userRole] >= roleRank[required];
}

// Use this when a role comes from outside (database, cookie, form),
// because outside data is just a string until you check it.
export function isUserRole(value: unknown): value is UserRole {
  return Object.values(UserRole).includes(value as UserRole);
}

// State returned by form server actions (used with useActionState)
export type FormState = { error?: string; success?: boolean };