import { createStoryAction } from "@/app/actions/stories";
import StoryForm from "../story-form";

export default function NewStoryPage() {
  return (
    <div className="mx-auto w-full max-w-5xl">
      <StoryForm
        action={createStoryAction}
        heading="Write a story"
        subtitle="Start with a title. Save it as a draft and finish later."
        submitLabel="Save story"
      />
    </div>
  );
}