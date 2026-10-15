import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type { Story, StoryInput } from "./story-status";

// DEMO STORAGE: stories are saved in a JSON file.
// Replace this file with database code later. The rest of the app stays the same.
const DATA_DIR = path.join(process.cwd(), ".data");
const FILE = path.join(DATA_DIR, "stories.json");

async function readAll(): Promise<Story[]> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8")) as Story[];
  } catch {
    return []; // file doesn't exist yet
  }
}

async function writeAll(stories: Story[]) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(stories, null, 2));
}

// READ: all stories of one user, newest first
export async function listStories(userId: string): Promise<Story[]> {
  const all = await readAll();
  return all
    .filter((s) => s.userId === userId)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

// READ: one story (only if it belongs to this user)
export async function getStory(id: string, userId: string): Promise<Story | null> {
  const all = await readAll();
  return all.find((s) => s.id === id && s.userId === userId) ?? null;
}

// CREATE
export async function createStory(userId: string, input: StoryInput): Promise<Story> {
  const all = await readAll();
  const now = new Date().toISOString();
  const story: Story = {
    id: randomUUID(),
    userId,
    ...input,
    createdAt: now,
    updatedAt: now,
  };
  await writeAll([...all, story]);
  return story;
}

// UPDATE
export async function updateStory(
  id: string,
  userId: string,
  input: StoryInput
): Promise<Story | null> {
  const all = await readAll();
  const index = all.findIndex((s) => s.id === id && s.userId === userId);
  if (index === -1) return null;

  all[index] = { ...all[index], ...input, updatedAt: new Date().toISOString() };
  await writeAll(all);
  return all[index];
}

// DELETE
export async function deleteStory(id: string, userId: string): Promise<boolean> {
  const all = await readAll();
  const rest = all.filter((s) => !(s.id === id && s.userId === userId));
  if (rest.length === all.length) return false; // nothing was deleted
  await writeAll(rest);
  return true;
}