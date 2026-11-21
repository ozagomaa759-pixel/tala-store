
import { redirect } from "next/navigation";

export default function SetsCollectionPage() {
  redirect("/products?category=sets");
}
