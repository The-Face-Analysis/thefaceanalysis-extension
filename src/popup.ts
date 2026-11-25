import { api, i18nDom, SITE, t, TOOLS, utm } from "./shared";

function open(tab: "camera" | "photo") {
  void api.tabs.create({ url: `${api.runtime.getURL("studio.html")}#${tab}` }).then(() => window.close());
}

i18nDom();
document.getElementById("openCamera")!.addEventListener("click", () => open("camera"));
document.getElementById("openPhoto")!.addEventListener("click", () => open("photo"));
const ul = document.getElementById("tools")!;
for (const tool of [...TOOLS.slice(0, 5), { slug: "online-mirror", key: "toolMirrorSite" }]) {
  const li = document.createElement("li");
  const a = document.createElement("a");
  a.href = `${SITE}/${tool.slug}?${utm("popup")}`;
  a.target = "_blank";
  a.rel = "noopener";
  a.textContent = t(tool.key);
  li.appendChild(a);
  ul.appendChild(li);
}
