<template>
    <section class="aminui-wrapper">
        <!--1级菜单-->
        <div class="aminui-side-split">
            <!-- 图标 -->
            <div class="aminui-side-split-top">
                <router-link to="/">
                    <img class="logo" src="../assets/images/logo-r.png">
                </router-link>
            </div>
            <!-- 列表 -->
            <div class="adminui-side-split-scroll">
                <el-scrollbar>
                    <ul>
                        <li v-for="item in menu" :key="item.id" :class="item.path == pmenu.path ? 'active' : ''"
                            @click="tabMenu(item)">
                            <el-icon>
                                <component
                                    :is="item.meta?.title == '小鹿线' ? 'House' : item.meta?.icon.replace('el-icon-', '')" />
                            </el-icon>
                            <p>{{ item.name == '小鹿线' ? '课效智控' : item.name}}</p>
                        </li>
                    </ul>
                </el-scrollbar>
            </div>
        </div>
        <!--2级菜单-->
        <div :class=" menuIsCollapse ? 'aminui-side isCollapse':'aminui-side' ">
            <div class="adminui-side-top" v-if="menuIsCollapse">
                <h2>{{ pmenu.name }}</h2>
            </div>
            <div class="adminui-side-scroll">
                <el-scrollbar>
                    <el-menu router :default-active="route.path" :collapse="menuIsCollapse">
                        <NavMenu :nextMenu="nextMenu"></NavMenu>
                    </el-menu>
                </el-scrollbar>
            </div>
            <div class="adminui-side-bottom" @click="toggle_menuIsCollapse">
                <el-icon>
                    <el-icon-expand v-if="menuIsCollapse" />
                    <Fold v-else />
                </el-icon>
            </div>
        </div>
        <!--右侧组件-->
        <div class="aminui-body">
            <TopBar>
                <UserBar></UserBar>
            </TopBar>
            <TagBar></TagBar>
            <div class="aminui-main">
                <router-view />
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue';
import { useMenuStore } from '@store/useMenuStore'
import { Parent } from '@interface/user'
import NavMenu from './components/NavMenu.vue'
import TopBar from './components/TopBar.vue'
import UserBar from './components/UserBar.vue'
import TagBar from './components/TagBar.vue'
import { useRoute } from 'vue-router'

const route = useRoute();
const menu = ref<Parent[]>([]);
const pmenu = ref<Parent>({});
const nextMenu = ref<Parent[] | undefined>([]);

onBeforeMount(() => {
    // window.electron.ipcRenderer.invoke('resize-window');
    window.electron.ipcRenderer.invoke('renderer-to-main', {
                name:'resize-window'
            });
    //一级菜单数据
    menu.value = useMenuStore().menu;
    routesPath();
})

//切换一级菜单
const tabMenu = (item: Parent) => {
    //切换一级菜单数据
    pmenu.value = item;
    //切换二级菜单数据
    nextMenu.value = item.children;
}

const routesPath = () => {
    const currentRoute = (route.meta.breadcrumb as Parent[])[0];
    //切换一级数据
    pmenu.value = currentRoute;
    //二级菜单数据
    nextMenu.value = currentRoute.children;
}

watch(route, () => {
    routesPath();
})

//菜单展开收起
let menuIsCollapse = ref<boolean>(false);
const toggle_menuIsCollapse = () => {
    menuIsCollapse.value = !menuIsCollapse.value;
}

</script>

<style scoped lang="scss">
.aminui-wrapper {
    display: flex;
    width: 100vw;
    height: 100vh;
    overflow: hidden;

    .aminui-side-split {
        display: flex;
        flex-direction: column;
        width: 65px;
        height: 100vh;
        // overflow: hidden;
        background: #222b45;

        .aminui-side-split-top {
            height: 49px;
            -webkit-app-region: drag;
        }

        .aminui-side-split-top a {
            display: inline-block;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .aminui-side-split-top .logo {
            height: 30px;
            vertical-align: bottom;
        }

        .adminui-side-split-scroll {
            overflow: auto;
            overflow-x: hidden;
            height: 100%;
            flex: 1;
        }

        li {
            cursor: pointer;
            width: 65px;
            height: 65px;
            color: #fff;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        li i {
            font-size: 18px;
        }

        li p {
            margin-top: 5px;
            font-size: 12px;
        }

        li:hover {
            background: rgba(255, 255, 255, 0.1);
        }

        li.active {
            background: #409EFF;
        }
    }

    .aminui-side {
        display: flex;
        flex-flow: column;
        width: 210px;
        background: #fff;
        box-shadow: 2px 0 8px 0 rgba(29, 35, 41, .05);
        border-right: 1px solid #e6e6e6;
        transition: width 0.3s;

        .adminui-side-top {
            -webkit-app-region: drag;
            border-bottom: 1px solid #ebeef5;
            height: 49px;
            line-height: 49px;
        }

        .adminui-side-top h2 {
            padding: 0 20px;
            font-size: 17px;
            color: #3c4a54;
        }

        .adminui-side-scroll {
            overflow: auto;
            overflow-x: hidden;
            flex: 1;
        }

        .adminui-side-bottom {
            border-top: 1px solid #ebeef5;
            height: 51px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .adminui-side-bottom i {
            font-size: 16px;
        }

        .adminui-side-bottom:hover {
            color: var(--el-color-primary);
        }
    }

    .aminui-side.isCollapse {
        width: 65px;
    }

    .aminui-body {
        display: flex;
        flex-direction: column;
        flex: 1;
    }
}

.el-menu {
    border-right: 0px;
}
.aminui-main{
    flex:1;
    overflow: auto;
}
</style>