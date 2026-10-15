import { redirect } from "next/navigation";
import { getCurrentUser } from "./session";
import { hasRole } from "./helpers";
import { UserRole } from "./enums";

// Call at the top of a server page:
//   const user = await requireRole(UserRole.Admin);
export async function requireRole(required: UserRole) {
  const user = await getCurrentUser();

  if (!user) redirect("/login");
  if (!hasRole(user.role, required)) redirect("/dashboard");

  return user;
}