import { promises as fs } from "fs";
import path from "path";
import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "crypto";
import { UserRole } from "./enums";
import type { AuthUser } from "./helpers";

// DEMO STORAGE: users are saved in a JSON file so they survive restarts.
// Replace this file with real database code later (Prisma, Supabase, etc.).
type StoredUser = AuthUser & { passwordHash: string };

const DATA_DIR = path.join(process.cwd(), ".data");
const FILE = path.join(DATA_DIR, "users.json");

async function readUsers(): Promise<StoredUser[]> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8")) as StoredUser[];
  } catch {
    return []; // file doesn't exist yet
  }
}

async function writeUsers(users: StoredUser[]) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(users, null, 2));
}

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const a = Buffer.from(hash, "hex");
  const b = scryptSync(password, salt, 64);
  return a.length === b.length && timingSafeEqual(a, b);
}

function toAuthUser({ passwordHash: _omit, ...user }: StoredUser): AuthUser {
  return user;
}

export async function findUserById(id: string): Promise<AuthUser | null> {
  const user = (await readUsers()).find((u) => u.id === id);
  return user ? toAuthUser(user) : null;
}

// Returns null if the email is already taken.
export async function createUser(input: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthUser | null> {
  const users = await readUsers();
  if (users.some((u) => u.email === input.email)) return null;

  const user: StoredUser = {
    id: randomUUID(),
    name: input.name,
    email: input.email,
    role: UserRole.Writer,
    passwordHash: hashPassword(input.password),
  };

  await writeUsers([...users, user]);
  return toAuthUser(user);
}

// Returns the user only if email AND password are both correct.
export async function verifyCredentials(
  email: string,
  password: string
): Promise<AuthUser | null> {
  const user = (await readUsers()).find((u) => u.email === email);
  if (!user || !verifyPassword(password, user.passwordHash)) return null;
  return toAuthUser(user);
}

// Change name, bio or avatar. Pass avatar: undefined to remove the picture.
export async function updateUser(
  id: string,
  patch: Partial<Pick<AuthUser, "name" | "bio" | "avatar">>
): Promise<AuthUser | null> {
  const users = await readUsers();
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return null;

  users[index] = { ...users[index], ...patch };
  await writeUsers(users);
  return toAuthUser(users[index]);
}

// Returns false if the current password is wrong.
export async function changePassword(
  id: string,
  currentPassword: string,
  newPassword: string
): Promise<boolean> {
  const users = await readUsers();
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return false;
  if (!verifyPassword(currentPassword, users[index].passwordHash)) return false;

  users[index] = { ...users[index], passwordHash: hashPassword(newPassword) };
  await writeUsers(users);
  return true;
}