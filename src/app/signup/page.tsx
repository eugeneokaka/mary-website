import { redirect } from "next/navigation";

// Passwordless sign-in creates the account automatically, so signup is
// handled entirely on the login page.
export default function SignupPage() {
  redirect("/login");
}
