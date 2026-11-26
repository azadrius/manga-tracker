import { useAuth } from "../lib/auth";
import { Library } from "./Library";
import { SignIn } from "./SignIn";

export default function Root() {
  const auth = useAuth();
  if (auth.status === "loading") return <main className="center muted">Chargement…</main>;
  if (auth.status === "signedOut") return <SignIn />;
  return <Library user={auth.user} />;
}
