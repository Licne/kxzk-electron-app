<template>
    <div class="user-bar">
        <!--退出登录-->
        <el-dropdown class="panel-item">
            <div class="user-avatar">
                <el-avatar :size="30" :src="userInfo.avatar" />
                <el-icon><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item @click="outLogin()">退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
        
        <!--消息-->
        <div class="panel-item">
            <el-icon><ChatDotRound /></el-icon>
        </div>

        <!--下载-->
        <div class="panel-item">
            <el-icon><Download /></el-icon>
        </div>

        <!--缩小-->
        <div class="panel-item" @click="minWin()">
            <el-icon><Minus /></el-icon>
        </div>

        <!--放大-->
        <div class="panel-item" @click="maxWin()">
            <el-icon><FullScreen /></el-icon>
        </div>

        <!--关闭-->
        <div class="panel-item" @click="winClose()">
            <el-icon><Close /></el-icon>
        </div>

    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@store/useUserStore';
import { ElMessage, ElMessageBox } from 'element-plus';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);
const router = useRouter()
// console.log(userInfo)

// 退出应用
const winClose = ()=>{
    ElMessageBox.confirm("确认",'是否退出?',{
        type:'warning',
        confirmButtonText:'退出'
    }).then(()=>{
        // window.electron.ipcRenderer.invoke('win-close');
        window.electron.ipcRenderer.invoke('renderer-to-main', {
                name:'win-close'
            });
    }).catch(()=>{
        ElMessage({
            type:'info',
            message:'取消退出'
        })
    })
}
// 退出登录
const outLogin = () => {
    ElMessageBox.confirm("确认","是否退出誊录",{
        type:'warning',
        confirmButtonText:'退出',
    }).then(()=> {
        ElMessage({
            type:'success',
            message:'退出登录'
        })
        // window.electron.ipcRenderer.invoke('out-login');
        window.electron.ipcRenderer.invoke('renderer-to-main', {
                name:'out-login'
            });
        localStorage.setItem('TOKEN','')
        router.replace({
            path:'/login'
        });
    }).catch(()=>{
        ElMessage({
            type:'info',
            message:'取消退出'
        })
    })
}

// 最小化
const minWin = () => {
    // window.electron.ipcRenderer.invoke('min-win');
    window.electron.ipcRenderer.invoke('renderer-to-main', {
                name:'min-win'
            });
}
// 全屏
const maxWin = () => {
    // window.electron.ipcRenderer.invoke('max-win');
    window.electron.ipcRenderer.invoke('renderer-to-main', {
                name:'max-win'
            });
}
</script>

<style scoped lang="scss">
.user-bar{
    display: flex;
    align-items: center;
    height: 100%;
    .panel-item{
        display: flex;
        align-items: center;
        padding: 0 10px;
        height: 100%;
        cursor: pointer;
        .user-avatar{
            display: flex;
            align-items: center;
        }
        &:hover{
            background-color: rgba(0,0,0,0.1);
        }
    }
}
</style>