
import { redirect } from "next/navigation";

export default function JacketsCollectionPage() {
  redirect("/products?category=jackets");
}
