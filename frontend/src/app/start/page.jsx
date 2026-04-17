import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function StartPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (token) {
    redirect("/dashboard");
  }

  redirect("/login");
}
