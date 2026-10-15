export enum StoryStatus {
  Draft = "draft",
  Published = "published",
}

export function isStoryStatus(value: unknown): value is StoryStatus {
  return Object.values(StoryStatus).includes(value as StoryStatus);
}

export type Story = {
  id: string;
  userId: string;
  title: string;
  content: string;
  status: StoryStatus;
  createdAt: string; // date as text (ISO)
  updatedAt: string;
};

export type StoryInput = {
  title: string;
  content: string;
  status: StoryStatus;
};