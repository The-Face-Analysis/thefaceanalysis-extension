import { api, SITE, utm } from "./shared";

api.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    api.tabs.create({ url: `${SITE}/extension?installed=1&${utm("install")}` });
  }
  api.runtime.setUninstallURL(`${SITE}/extension?uninstalled=1&${utm("uninstall")}`);
});

export async function openStudio(tab?: "camera" | "photo") {
  const base = api.runtime.getURL("studio.html");
  await api.tabs.create({ url: tab ? `${base}#${tab}` : base });
}

api.commands.onCommand.addListener((command) => {
  if (command === "open-studio") void openStudio("camera");
});

api.runtime.onMessage.addListener((msg: { type: string; tab?: "camera" | "photo" }, _s, reply) => {
  if (msg.type === "openStudio") {
    void openStudio(msg.tab).then(() => reply(true));
    return true;
  }
  return false;
});
