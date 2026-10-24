import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl border border-neutral-200 p-8 dark:border-neutral-800">
        <h1 className="mb-6 text-xl font-semibold">Admin sign in</h1>
        <LoginForm />
      </div>
    </main>
  );
}
