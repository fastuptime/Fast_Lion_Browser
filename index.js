process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const electron = require("electron");
const { webFrame } = require("electron");
const { app, BrowserWindow, Menu, globalShortcut, ipcMain, session } = electron;
const isOnline = require("is-online");
const url = require("url");
const path = require("path");

let win;
console.log("Node version: " + process.versions.node);
console.log(`
███████╗░█████╗░░██████╗████████╗██╗░░░██╗██████╗░████████╗██╗███╗░░░███╗███████╗░░░░█████╗░░█████╗░███╗░░░███╗
██╔════╝██╔══██╗██╔════╝╚══██╔══╝██║░░░██║██╔══██╗╚══██╔══╝██║████╗░████║██╔════╝░░░██╔══██╗██╔══██╗████╗░████║
█████╗░░███████║╚█████╗░░░░██║░░░██║░░░██║██████╔╝░░░██║░░░██║██╔████╔██║█████╗░░░░░██║░░╚═╝██║░░██║██╔████╔██║
██╔══╝░░██╔══██║░╚═══██╗░░░██║░░░██║░░░██║██╔═══╝░░░░██║░░░██║██║╚██╔╝██║██╔══╝░░░░░██║░░██╗██║░░██║██║╚██╔╝██║
██║░░░░░██║░░██║██████╔╝░░░██║░░░╚██████╔╝██║░░░░░░░░██║░░░██║██║░╚═╝░██║███████╗██╗╚█████╔╝╚█████╔╝██║░╚═╝░██║
╚═╝░░░░░╚═╝░░╚═╝╚═════╝░░░░╚═╝░░░░╚═════╝░╚═╝░░░░░░░░╚═╝░░░╚═╝╚═╝░░░░░╚═╝╚══════╝╚═╝░╚════╝░░╚════╝░╚═╝░░░░░╚═╝`);
let site = "https://google.com";
async function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, "./256x256.ico"),
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      zoomFactor: 1.0,
    },
  });

  let online = await isOnline();
  if (online == true) {
    win.loadURL(site);
    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
  } else {
    win.loadURL(
      url.format({
        pathname: path.join(__dirname, "/offline.html"),
        protocol: "file:",
        slashes: true,
      })
    );
    Menu.setApplicationMenu(null);
  }
}
let menuTemplate = [
  {
    label: "Geri Git",
    accelerator: "CmdOrCtrl+Left",
    click() {
      win.webContents.goBack();
    }
  },
  {
    label: "İleri Git",
    accelerator: "CmdOrCtrl+Right",
    click() {
      win.webContents.goForward();
    }
  },
  {
    label: "Yenile",
    accelerator: "CmdOrCtrl+R",
    click() {
      win.webContents.reload();
    }
  },
  {
    label: "Ana Sayfa",
    click() {
      win.loadURL(site);
    }
  },
  {
    label: "Eylemler",
    submenu: [
      {
        label: "Çerezleri Temizle",
        click() {
          session.defaultSession.clearStorageData({
            storages: ["cookies"]
          });
        }
      },
      {
        label: "Uygulamayı Kapat",
        click() {
          app.quit();
        }
      }
    ]
  },

  {
    label: "Görünüm",
    submenu: [
      {
        label: "Tam ekran",
        accelerator: "F11",
        click() {
          win.setFullScreen(!win.isFullScreen());
        }
      },
      {
        label: "Küçült",
        accelerator: "CmdOrCtrl+M",
        click() {
          win.isNormal() ? win.maximize() : win.unmaximize();
        }
      },
      {
        label: "Alt Ekran",
        accelerator: "CmdOrCtrl+Shift+M",
        click() {
          win.minimize();
        }
      },
      {
        label: "Zoom",
        submenu: [
          {
            label: "Zoom +",
            accelerator: "CmdOrCtrl+=",
            click() {
              win.webContents.zoomFactor += 0.1;
            }
          },
          {
            label: "Zoom -",
            accelerator: "CmdOrCtrl+-",
            click() {
              win.webContents.zoomFactor -= 0.1;
            }
          },
          {
            label: "Zoom Reset",
            accelerator: "CmdOrCtrl+0",
            click() {
              win.webContents.zoomFactor = 1;
            }
          }
        ]
      },
      {
        type: "separator"
      },
      {
        label: "Geliştirici Modu",
        accelerator: "CmdOrCtrl+Shift+I",
        click() {
          win.webContents.toggleDevTools();
        }
      }
    ]
  },
  {
    label: `${site}`,
    enabled: false 
  }
];

app.whenReady().then(() => {
  win.webContents.on('did-navigate', (event, url) => {
    menuTemplate[menuTemplate.length - 1].label = url;
    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
  });
});

app.on("ready", createWindow);