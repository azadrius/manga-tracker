import { useState } from "react";
import { signInWithGoogle } from "../lib/auth";

export function SignIn() {
  const [error, setError] = useState<string | null>(null);
  return (
    <main className="center">
      <img src={`${import.meta.env.BASE_URL}icon.svg`} alt="" width={96} height={96} />
      <h1>Manga Tracker</h1>
      <p className="muted">Retrouve où tu en es dans tous tes mangas, sur PC comme sur iPhone.</p>
      <button className="primary" onClick={() => signInWithGoogle().catch((e: Error) => setError(e.message))}>
        Se connecter avec Google
      </button>
      {error && <p className="error">{error}</p>}
    </main>
  );
}
