import { shell, BrowserWindow } from 'electron'
import icon from '../../../resources/icon.png?asset'
import { is } from '@electron-toolkit/utils'
import { join } from 'path'
export default class MainFrame{
    #frame:any = null;
    #width = 900;
    #heihgt = 670;

    // 解决windows125%窗口兼容问题
    oldBounds = null;
    // isoldBoundsSet = false;
    //创建窗口
    create(){
        this.#frame = new BrowserWindow({
            width: this.#width,
            height: this.#heihgt,
            show: false,
            frame:false, //无边框窗口
            resizable:false,//无法调整窗口大小
            autoHideMenuBar: true,
            ...(process.platform === 'linux' ? { icon } : {}),
            webPreferences: {
              preload: join(__dirname, '../preload/index.js'),
              sandbox: false
            }
          })
        
        this.#frame.on('ready-to-show', () => {
            this.#frame.show()
        })
        
        this.#frame.webContents.setWindowOpenHandler((details) => {
            shell.openExternal(details.url)
            return { action: 'deny' }
        })
          
        if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
            this.#frame.loadURL(process.env['ELECTRON_RENDERER_URL'])
        } else {
            this.#frame.loadFile(join(__dirname, '../renderer/index.html'))
        }
    }
    //隐藏窗口
    hide(){
        this.#frame.hide();
    }
    //关闭窗口
    close(){
        this.#frame.close();
    }
    //设置窗口位置 
    getBounds(){
        return this.#frame.getBounds();
    }
    setBounds( bounds , bool ){
        this.#frame.setBounds(bounds, bool);
    }
    setPosition( x, y ){
        this.#frame.setPosition(x , y);
    }
    //最小化窗口
    minimize(){
        this.#frame.minimize();
    }
    //判断是否最大化
    isFullScreen(){
       return this.#frame.isFullScreen();
    }
    //放大 & 缩小
    setFullScreen( bool ){
        this.#frame.setFullScreen( bool );
    }
    //设置窗口大小
    setSize( w , h ){
        this.#frame.setSize( w , h );
    }
    //窗口居中
    center(){
        this.#frame.center();
    }   
    //窗口是否可以改变 
    setResizable(bool){
        this.#frame.setResizable( bool );
    }
    //窗口最小值
    setMinimumSize( w , h  ){
        this.#frame.setMinimumSize( w, h );
    }
}
