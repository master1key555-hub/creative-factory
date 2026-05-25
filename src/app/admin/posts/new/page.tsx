import { PostForm } from "@/components/admin/post-form";

export const metadata = { title: "Admin · New post" };

export default function NewPost() {
  return (
    <div>
      <header className="mb-6">
        <h2 className="serif text-2xl font-semibold">New post</h2>
      </header>
      <PostForm />
    </div>
  );
}
