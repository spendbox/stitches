import { redirect } from "next/navigation";
import { getTailorId } from "@/lib/session";

export default async function Home() {
  redirect((await getTailorId()) ? "/dashboard" : "/login");
}
