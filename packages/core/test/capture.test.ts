import { describe, expect, it, vi } from "vitest";
import { detectChapter, formatCaptureKey, generateSecret, parseCaptureKey, sendCapture } from "../src";

const key = { uid: "abcDEF123456", secret: generateSecret() };
const capture = detectChapter({ url: "https://manhuaus.com/manga/martial-peak/chapter-3800/" })!;
const target = { projectId: "demo", apiKey: "k" };

describe("clé de capture", () => {
  it("fait l'aller-retour texte ↔ objet", () => {
    expect(parseCaptureKey(` ${formatCaptureKey(key)} `)).toEqual(key);
  });

  it("refuse une clé mal formée", () => {
    expect(parseCaptureKey("")).toBeNull();
    expect(parseCaptureKey("mt1.uid")).toBeNull();
    expect(parseCaptureKey(`mt2.${key.uid}.${key.secret}`)).toBeNull();
    expect(parseCaptureKey(`mt1.${key.uid}.court`)).toBeNull();
  });

  it("génère des secrets différents et assez longs", () => {
    expect(generateSecret()).not.toBe(generateSecret());
    expect(generateSecret().length).toBeGreaterThanOrEqual(43);
  });
});

describe("sendCapture", () => {
  it("dépose la capture dans users/{uid}/inbox", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
    expect(await sendCapture(target, key, capture, fetchMock)).toBe("saved");
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe(
      `https://firestore.googleapis.com/v1/projects/demo/databases/(default)/documents/users/${key.uid}/inbox?key=k`,
    );
    const body = JSON.parse(init.body);
    expect(body.fields.chapter).toEqual({ doubleValue: 3800 });
    expect(body.fields.captureKey).toEqual({ stringValue: key.secret });
  });

  it("signale une clé refusée", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}", { status: 403 }));
    expect(await sendCapture(target, key, capture, fetchMock)).toBe("invalid-key");
  });

  it("signale une erreur réseau", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new TypeError("offline"));
    expect(await sendCapture(target, key, capture, fetchMock)).toBe("error");
  });
});
