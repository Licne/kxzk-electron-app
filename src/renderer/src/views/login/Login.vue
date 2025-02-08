<template>
    <div>
        <div class="login " @mousedown="mousedown">
            <!--顶部-->
            <div class="login-config">
                <div class="login-config-btn">
                    <!-- 关闭 -->
                    <el-button icon="close" circle type="default" @click="closeWin"></el-button>

                    <!-- 国际化 -->
                    <el-dropdown trigger="click" @command="configLang">
    <el-button circle>
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 512 512"><path d="M478.33 433.6l-90-218a22 22 0 0 0-40.67 0l-90 218a22 22 0 1 0 40.67 16.79L316.66 406h102.67l18.33 44.39A22 22 0 0 0 458 464a22 22 0 0 0 20.32-30.4zM334.83 362L368 281.65L401.17 362z" fill="currentColor"></path><path d="M267.84 342.92a22 22 0 0 0-4.89-30.7c-.2-.15-15-11.13-36.49-34.73c39.65-53.68 62.11-114.75 71.27-143.49H330a22 22 0 0 0 0-44H214V70a22 22 0 0 0-44 0v20H54a22 22 0 0 0 0 44h197.25c-9.52 26.95-27.05 69.5-53.79 108.36c-31.41-41.68-43.08-68.65-43.17-68.87a22 22 0 0 0-40.58 17c.58 1.38 14.55 34.23 52.86 83.93c.92 1.19 1.83 2.35 2.74 3.51c-39.24 44.35-77.74 71.86-93.85 80.74a22 22 0 1 0 21.07 38.63c2.16-1.18 48.6-26.89 101.63-85.59c22.52 24.08 38 35.44 38.93 36.1a22 22 0 0 0 30.75-4.9z" fill="currentColor"></path></svg>
    </el-button>
    <template #dropdown >
        <el-dropdown-menu>
          <el-dropdown-item
          v-for="item in config.LANG"
          :key="item.value"
          :command="item"
          >{{  item.name }}</el-dropdown-item>
      </el-dropdown-menu>
    </template>
</el-dropdown>

                    <!-- 换肤 -->
                    <el-button circle @click='configDark'>
                        <el-icon v-if='dark'><Sunny /></el-icon>
                        <el-icon v-else><Moon /></el-icon>
                    </el-button>
                </div>
            </div>



            <!--左侧-->
            <div class="login_adv">

                <div class="login_adv__title">
                    <h2>{{ $t('login.name') }}</h2>
                    <h4>{{ $t('login.slogan') }}</h4>
                    <p>{{ $t('login.describe') }}</p>
                </div>

                <div class="login_adv__mask"></div>

                <div class="login_adv__image">
                    <img src="../../assets/images/data.png" width="100%">
                </div>

                <div class="login_adv__bottom">
                    © 课效智控客户管理系统 1.1.45
                </div>

            </div>

            <!--右侧-->
            <div class="login-main">
                <div class="login-form">
                    <div class="login-header">
                        <div class="login-img">
                            <img src="../../assets/images/logo.png" alt="">
                            <label>课效智控客户管理系统</label>
                        </div>
                    </div>
                    <el-tabs>
                        <el-tab-pane :label="$t('login.accountLogin')" lazy style="height: 300px;">
                            <PasswordForm></PasswordForm>


                        </el-tab-pane>
                        <el-tab-pane :label="$t('login.signInOther')" lazy style="height: 300px;">

                            <PhoneForm></PhoneForm>
                        </el-tab-pane>
                    </el-tabs>
                    <template v-if='true'>
                        <el-divider>{{ $t('login.signInOther') }}</el-divider>
                        <div class="login-oauth">
                            <!--微信按钮-->
                            <el-button type="success" circle size="large">
                                <el-icon size="large">
                                    <ChatDotRound />
                                </el-icon>
                            </el-button>
                        </div>
                    </template>

                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import PasswordForm from './components/passwordForm.vue';
import PhoneForm from './components/phoneForm.vue';
import { ComponentInternalInstance, getCurrentInstance, reactive, ref } from 'vue';

let isKeyDown = ref<boolean>(false);
let dinatesX = ref<number>(0);
let dinatesY = ref<number>(0);

const mousedown = (event) => {
    isKeyDown.value = true;
    dinatesX.value = event.x;
    dinatesY.value = event.y;

    document.onmousemove = (ev) => {
        if (isKeyDown.value) {
            const x = ev.screenX - dinatesX.value;
            const y = ev.screenY - dinatesY.value;
            //给主进程传入坐标
            let data = {
                appX: x,
                appY: y
            }
            window.electron.ipcRenderer.invoke('custom-adsorption', data);
        }
    };
    document.onmouseup = () => {
        isKeyDown.value = false
    };
}
// 关闭窗口
const closeWin = (): void => {
    window.electron.ipcRenderer.invoke('close-login')
}

// 换肤
const dark = ref<string | null>(localStorage.getItem('dark'));
const configDark = ()=>{
    const element = document.querySelector('html') as HTMLElement | null;
    if (element) {
        if( element.className == 'dark'  ){
            element.className = '';
        }else{
            element.className = 'dark';
            // console.log('執行')

        }
        dark.value = element.className;
        localStorage.setItem('dark', element.className);
    }
}

// 国际化

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const config = reactive({
    LANG:[
        {name:"中文",value:'zh-cn'},
        {name:'英文',value:'en'}
    ]
})
const configLang = ( item:any )=>{
    let val:string = item.value;
    let i18n = proxy?.$i18n;
    i18n!.locale = val;
	localStorage.setItem('lang',val);
}

</script>

<style scoped>
.login {
    width: 100vw;
    height: 100vh;
    background-color: #fff;
    display: flex;
}

.login_adv {
    background: url('../../assets/images/auth_banner.jpg') no-repeat;
    width: 40%;
    position: relative;
}

.login_adv__title {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2;
    padding: 40px;
    color: #fff;
}

.login_adv__title h2 {
    font-size: 40px;
}

.login_adv__title h4 {
    font-size: 18px;
    margin-top: 10px;
    font-weight: normal;
}

.login_adv__title p {
    font-size: 14px;
    margin-top: 10px;
    line-height: 1.8;
    color: rgba(255, 255, 255, 0.6);
}

.login_adv__image {
    position: absolute;
    left: 0px;
    right: 0px;
    bottom: 80px;
    padding: 40px;
    z-index: 3;
}

.login_adv__image img {
    width: 100%;
    height: 100%;
}

.login_adv__bottom {
    position: absolute;
    left: 0px;
    right: 0px;
    bottom: 0px;
    color: #fff;
    padding: 0 40px 40px 40px;
    background-image: linear-gradient(transparent, #000);
    z-index: 3;
}

.login_adv__mask {
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1;
}

.login-main {
    flex: 1;
    display: flex;
    overflow: auto;
}

.login-form {
    width: 400px;
    margin: auto;
    padding: 80px 0 0 0;
}

.login-header {
    margin-bottom: 40px;
}

.login-header .login-img {
    display: flex;
    justify-content: center;
    align-items: center;
}

.login-header .login-img img {
    width: 40px;
    height: 40px;
    vertical-align: bottom;
    margin-right: 10px;
}

.login-header .login-img label {
    font-size: 26px;
    font-weight: bold;
}

.login-oauth {
    display: flex;
    justify-content: space-around;
}

/* 顶部 */

.login-config {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    z-index: 9999;
}

.login-config-btn {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 120px;
    margin: 10px 10px 0 0;
    float: right;
}
</style>