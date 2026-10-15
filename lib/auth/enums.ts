// String enums: the value is readable, and it is safe to store in a database
// or send as JSON ("writer" instead of a mystery number like 1).

export enum UserRole {
  Reader = "reader",
  Writer = "writer",
  Editor = "editor",
  Admin = "admin",
}

export enum AuthStatus {
  Authenticated = "authenticated",
  Unauthenticated = "unauthenticated",
  Suspended = "suspended",
}

export enum AuthError {
  InvalidCredentials = "invalid_credentials",
  EmailTaken = "email_taken",
  AccountSuspended = "account_suspended",
  Unauthenticated = "unauthenticated",
  Forbidden = "forbidden",
  SessionExpired = "session_expired",
}