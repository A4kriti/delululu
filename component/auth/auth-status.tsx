

import {
  UserRole,
  AuthStatus,
  AccountStatus,
} from "./auth-enums";

type Props = {
  status: AuthStatus;
  role: UserRole;
  accountStatus: AccountStatus;
};

export default function AuthStatusBadge({
  status,
  role,
  accountStatus,
}: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <span className="rounded-full bg-violet-100 px-3 py-1 text-sm text-violet-700">
        {status}
      </span>

      <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
        {role}
      </span>

      <span
        className={`rounded-full px-3 py-1 text-sm ${
          accountStatus === AccountStatus.ACTIVE
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {accountStatus}
      </span>
    </div>
  );
}
