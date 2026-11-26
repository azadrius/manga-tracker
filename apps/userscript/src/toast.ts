/** Petite notification discrète en bas de l'écran. */
export function toast(message: string, options: { error?: boolean; link?: { href: string; text: string }; duration?: number } = {}) {
  const host = document.createElement("div");
  const shadow = host.attachShadow({ mode: "closed" });
  shadow.innerHTML = `
    <style>
      div {
        position: fixed; left: 50%; bottom: max(16px, env(safe-area-inset-bottom)); transform: translateX(-50%);
        z-index: 2147483647; max-width: calc(100vw - 32px);
        font: 600 14px/1.4 -apple-system, system-ui, sans-serif; color: #fff;
        background: ${options.error ? "#c62a2f" : "#1f2329"}; border-radius: 12px; padding: 10px 14px;
        box-shadow: 0 6px 24px rgba(0,0,0,.35); transition: opacity .3s;
      }
      a { color: #ffd166; margin-left: 8px; }
    </style>
    <div role="status"></div>`;
  const box = shadow.querySelector("div")!;
  box.textContent = message;
  if (options.link) {
    const a = document.createElement("a");
    a.href = options.link.href;
    a.textContent = options.link.text;
    a.target = "_blank";
    box.append(a);
  }
  document.documentElement.append(host);
  setTimeout(() => {
    box.style.opacity = "0";
    setTimeout(() => host.remove(), 400);
  }, options.duration ?? 2500);
}
