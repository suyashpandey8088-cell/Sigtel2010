import { revalidatePath } from "next/cache";

/** Refresh the public pages that render the works register after an admin change. */
export function revalidatePublicContent() {
  ["/", "/projects", "/infrastructure", "/signalling", "/telecommunications", "/sitemap.xml"].forEach((path) => {
    revalidatePath(path);
  });
}
