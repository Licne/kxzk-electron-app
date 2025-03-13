<template>
    <el-container>
        <el-header class="titlebar" height="40px">
            <div class="title">任务列表</div>
            <el-icon class="close" size="large" @click="closeWin">
                <el-icon-close/>
            </el-icon>
        </el-header>

        <el-main style="flex:1;background-color: #f5f5f5;">
            <el-form inline :model="formData">
                <el-form-item label="任务名称" placeholder="请输入任务名称">
                    <el-input v-model="formData.taskName"></el-input>
                </el-form-item>
                <el-form-item label="任务状态" placeholder="请选择任务状态">
                    <el-select v-model="formData.status">
                        <el-option key="" label="已完成" value="1"></el-option>
                        <el-option key="" label="进行中" value="0"></el-option>
                        <el-option key="" label="失败" value="-1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click='getTask'>查询</el-button>
                    <el-button type="default">重置</el-button>
                </el-form-item>
            </el-form>

            <el-table row-key="id" :data="tableData" width="100%" border stripe :header-cell-style="{'text-align':'center'}"
                :cell-style="{'text-align':'center'}">
                <el-table-column label="序号" type="index" width="50"></el-table-column>
                <el-table-column label="任务名称" prop="taskName"></el-table-column>
                <el-table-column label="状态" prop="status">
                    <template #default="{row}">
                        <el-tag type="success" v-if="row.status == 1">已完成</el-tag>
                        <el-tag type="danger" v-if="row.status == -1">已失败</el-tag>
                        <el-tag type="info" v-if="row.status == 0">进行中</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" prop="createTime" :formatter="formatter"></el-table-column>
                <el-table-column label="操作" fixed="right" align="center" width="220">
                    <template #default="{row}">
                        <el-button-group>
                            <el-button  text type="primary" v-if="row.status ==1" icon="Link" @click="download(row.downloadUrl)">下载</el-button>
                            <el-button  text v-if="row.status ==-1" type="danger" icon="ChatLineSquare">错误日志</el-button>
                            <el-button  text v-if="row.status = 1 || -1" type="danger" icon="delete" @click="del(row.id)">删除</el-button>
                        </el-button-group>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-footer>
            <pagination
                :total="totals"
                @update:current-page="handleCurrentPageUpdate"
                @update:page-size="handlePageSizeUpdate"
            ></pagination>
        </el-footer>
    </el-container>
</template>

<script setup lang="ts">
import { ref , onBeforeMount } from 'vue';
import { taskPage , TaskRecord , taskDelete } from '@api/task'
import tool from '@utils/tool'
import type { TableColumnCtx } from 'element-plus'
//form数据
let formData = ref({
    current:1,
    size:10,
    taskName:'',
    status:''
});
//table数据
let tableData = ref<TaskRecord[]>([]);
//生命周期
onBeforeMount(()=>{
    getTask();
})
//数据列表
const getTask = async ()=>{
    let res = await taskPage(formData.value);
    let { total , records  } = res.data;
    totals.value = total;
    tableData.value = records;
}
//时间戳转换为标准时间
const formatter = (row: TaskRecord, column: TableColumnCtx<TaskRecord>,timeValue:number)=>{
    return tool.dateFormat( timeValue );
}
//关闭窗口
const closeWin = ()=>{
    window.electron.ipcRenderer.invoke('renderer-to-task',{
        name:'task-close'
    });
}
//下载
const download = ( url:string )=>{
    window.electron.ipcRenderer.invoke('renderer-to-task',{
        name:'download-http-file',
        data:{
            url
        }
    });
}
//删除
const del = async ( id:string )=>{
    let res = await taskDelete(id);
    if( res.code =='200') getTask();
    return ;
}
//分页
const totals = ref(0);
//分页-页码
const handleCurrentPageUpdate = ( page:number )=>{
    formData.value.current = page;
    getTask();
}
//分页-一页显示多少条
const handlePageSizeUpdate = ( page:number  )=>{
    formData.value.size = page;
    getTask();
}
</script>

<style scoped>
.titlebar{
    display: flex;
    justify-content: space-between;
    align-items: center;
    -webkit-app-region: drag;
    user-select: none;
}
.title{
    -webkit-app-region:no-drag;
    font-size: 14px;
    font-weight: bold;
    color: #3c4a54;
}
.close{
    -webkit-app-region:no-drag;
    cursor: pointer;
}
.el-table{
    font-size:12px;
}
</style>