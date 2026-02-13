import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import HomeClient from "./HomeClient";

export default async function HomePage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId");

  if (!userId) {
    redirect("/login");
  }

  return <HomeClient />;
}
