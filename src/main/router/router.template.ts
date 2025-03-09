import EventRoute from './EventRoute'
const routers = new Array();
/*
 * 关闭软件
 */
routers.push(
    new EventRoute('close-login',(api,data)=>{
        api.mainWindow.close();
    })    
)

/*
 * 拖拽窗口
 */
routers.push(
    new EventRoute('custom-adsorption',(api,{data})=>{
        let x = data.appX;
        let y = data.appY;
        api.mainWindow.setPosition( x , y );
        
        if(api.mainWindow.oldBounds == undefined){
            api.mainWindow.oldBounds = api.mainWindow.getBounds();
        }
        // 解决windows 125%窗口会出现变大的情况
        api.mainWindow.oldBounds.x = x
        api.mainWindow.oldBounds.y = y
        api.mainWindow.setBounds(api.mainWindow.oldBounds, true)
    })    
)

/*
 * 最小化
 */
routers.push(
    new EventRoute('min-win',(api,data)=>{
        api.mainWindow.minimize();
    })    
)

/*
 * 最大化
 */
routers.push(
    new EventRoute('max-win',(api,data)=>{
        if( api.mainWindow.isFullScreen() ){
            api.mainWindow.setFullScreen(false);
        }else{
            api.mainWindow.setFullScreen(true);
         }
    })    
)

/*
 * 退出软件
 */
routers.push(
    new EventRoute('win-close',(api,data)=>{
        api.app.exit();
    })    
)

/*
 * 退出登录
 */
routers.push(
    new EventRoute('out-login',(api,data)=>{
        //窗口大小
        api.mainWindow.setSize(900, 670);
        //窗口居中
        api.mainWindow.center();
        //窗口大小可以修改
        api.mainWindow.setResizable(false);
    })    
)


/*
 * 进入后台管理系统首页
 */
routers.push(
    new EventRoute('resize-window',(api,data)=>{
        //窗口大小
        api.mainWindow.setSize(1200, 720);
        //窗口最小值
        api.mainWindow.setMinimumSize(1000, 500);
        //窗口居中
        api.mainWindow.center();
        //窗口大小可以修改
        api.mainWindow.setResizable(true);
    })    
)


export default routers;