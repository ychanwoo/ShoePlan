import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import HomeClient from "./HomeClient";

export default async function HomePage() {
  const cookieStore = await cookies();
  const oauthId = cookieStore.get("oauthId");

  if (!oauthId) {
    redirect("/login");
  }

  return <HomeClient />;
}
