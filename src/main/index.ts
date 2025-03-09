import { app, BrowserWindow , ipcMain } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'

import MainFrame from './frame/MainFrame'
import routers from './router/router.template'
import EventRouter from './router/EventRouter'

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  const eventRouter = new EventRouter();

  let mainWindow = new MainFrame();
  mainWindow.create();

  eventRouter.addApi('mainWindow',mainWindow);
  eventRouter.addApi('app',app);
  eventRouter.addRouters(routers);

  //渲染进程 向 主进程通信
  ipcMain.handle('renderer-to-main',(e,data)=>{
    eventRouter.router( data );
  })

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) mainWindow.create();
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})