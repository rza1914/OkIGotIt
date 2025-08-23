import { useEffect } from "react";

export default function ClickInspector() {
  useEffect(() => {
    const log = (label: string, e: any) => {
      const t = e.target as HTMLElement;
      const path = (e.composedPath?.() || []);
      // کم‌حجم و مفید: نوع عنصر + data-attributes مهم
      const info = path.slice(0, 6).map((el: any) => {
        if (!(el instanceof HTMLElement)) return String(el?.nodeName || el);
        const tag = el.tagName.toLowerCase();
        const id = el.id ? `#${el.id}` : "";
        const cls = el.className ? `.${String(el.className).split(" ").filter(Boolean).slice(0,3).join(".")}` : "";
        const allow = el.closest?.("[data-allow-nav]") ? " allow" : "";
        const noNav = el.closest?.("[data-no-nav]") ? " noNav" : "";
        const banner = el.closest?.("[data-banner]") ? " banner" : "";
        return `${tag}${id}${cls}${allow}${noNav}${banner}`;
      });
      console.log(`[CAPTURE ${label}]`, { key: e.key, target: t, path: info });
    };

    const pd = (e: Event) => log("pointerdown", e);
    const ck = (e: Event) => log("click", e);
    const kd = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") log("keydown", e);
    };

    window.addEventListener("pointerdown", pd, true);
    window.addEventListener("click", ck, true);
    window.addEventListener("keydown", kd, true);
    return () => {
      window.removeEventListener("pointerdown", pd, true);
      window.removeEventListener("click", ck, true);
      window.removeEventListener("keydown", kd, true);
    };
  }, []);
  return null;
}