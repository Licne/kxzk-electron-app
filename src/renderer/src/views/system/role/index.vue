<template>
    <div style="height: 100%;">
        <el-container>
            <el-main>
                <el-tabs type="border-card">
                    <el-tab-pane label="角色列表">
                        <!--form-->
                        <el-card class="card-container">
                            <el-form :model="roleForm">
                                <el-row :gutter="15">
                                    <el-col :span="8">
                                        <el-form-item label="角色名称">
                                            <el-input placeholder="请输入角色编码" v-model="roleForm.roleName"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="7">
                                        <el-form-item label="角色编码">
                                            <el-input placeholder="请输入角色编码" v-model="roleForm.rolePerm"></el-input>
                                        </el-form-item></el-col>
                                    <el-col :span="9">
                                        <el-form-item label="状态">
                                            <el-select placeholder="请选择启动状态" v-model="roleForm.enable">

                                                <el-option v-for="item in dicts.system_global_status" :key="item.id"
                                                    :value="item.v" :lable="item.k"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item>
                                            <el-button icon="search" type="primary" @click="getRolePage">搜索</el-button>
                                            <el-button icon="refreshLeft" @click="roleReset">重置</el-button>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                        </el-card>
                        <!--table-->
                        <el-card>
                            <div class="toolbar">
                                <el-button icon="plus" type="primary" @click="btnRoleDialog">新增</el-button>
                            </div>
                            <el-table :data="tableData" border>
                                <el-table-column type="selection"></el-table-column>
                                <el-table-column prop='roleName' align="center" label="角色名称"></el-table-column>
                                <el-table-column prop='rolePerm' align="center" label="权限字符"></el-table-column>
                                <el-table-column label="是否启用" align="center">
                                    <template #default="{ row }">
                                        <el-tag>{{ row.enabled == '1' ? '启用' : '禁用' }}</el-tag>
                                    </template>
                                </el-table-column>
                                <el-table-column prop='createTime' align="center" label="创建时间"
                                    :formatter="formatter"></el-table-column>
                                <el-table-column label="操作" align="center" width="220" fixed="right">
                                    <template #default="{ row }">
                                        <div class="sys-table-main-actions">
                                            <el-link icon="edit" type="primary" :underline="false" @click="btnRoleDialog(row.id)">编辑</el-link>
                                            <el-link icon="delete" type="danger" :underline="false"
                                                style="margin: 0 8px" @click="roleDel(row.id)">删除</el-link>
                                            <router-link class="el-link el-link--error" type="success"
                                                to="/">分配用户</router-link>
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table>

                            <pagination
                                :total="totals"
                                @update:current-page="handleCurrentPageUpdate"
                                @update:page-size="handlePageSizeUpdate"
                            ></pagination>

                        </el-card>
                    </el-tab-pane>
                    <el-tab-pane label="回收站">回收站</el-tab-pane>
                </el-tabs>
            </el-main>
        </el-container>
        <RoleDialog
            v-model:dialogVisible="dialogVisible"
             v-if="dialogVisible"
            :roleUpdateId="roleUpdateId"
            @roleChange="getRolePage"
        ></RoleDialog>
    </div>
</template>

<script setup lang="ts">
import { rolePage, Role, roleDelete } from '@api/role';
import tool from '@utils/tool';
import { ElMessage, ElMessageBox, Table } from 'element-plus';
import { TableColumn, TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults';
import { get } from 'http';
import { Component, ComponentInternalInstance, getCurrentInstance, onBeforeMount, ref } from 'vue';
import RoleDialog from '../role/roleDialog.vue';
// import pagination from '@components/pagination/index.vue';
const totals = ref(0);
const tableData = ref<Role[]>([]);

// 查找表单
let roleForm = ref({
    current:1,
    size:10,
    roleName:'',
    rolePerm:'',
    enable:''
})

// 重置
const roleReset = () => {
    roleForm.value = {
        current:1,
        size:10,
        roleName:'',
        rolePerm:'',
        enable:''
    }
}

//分页-页码
const handleCurrentPageUpdate = ( page:number )=>{
    roleForm.value.current = page;
    getRolePage();
}
//分页-一页显示多少条
const handlePageSizeUpdate = ( page:number  )=>{
    roleForm.value.size = page;
    getRolePage();
}

// 字典与初始化
onBeforeMount(() => {
    getRolePage();

    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    if (proxy) {
        (proxy as any).getDicts(['system_global_status']);
    }
})

const getRolePage = async () => {
    let res = await rolePage(roleForm.value);
    let { records , total  } = res.data;
    totals.value = total;
    tableData.value = records;
}

// 时间戳转换
const formatter = (row: Role, column: TableColumnCtx<Role>, Value: number) => {
    return tool.dateFormat(Value);
}


// 新增角色 编辑角色
const roleUpdateId = ref('');
// 控制dialog显示隐藏
const dialogVisible = ref(false);
const btnRoleDialog = (id:string) => {
    if (typeof id === 'string') {
        roleUpdateId.value = id;
    }else{
        roleUpdateId.value = '';
    }
    dialogVisible.value = true;

}

// 删除角色
const roleDel = (id:string) => {
    ElMessageBox.confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '删除',
        type: 'error'
    }).then(async () => {
        let res = await roleDelete(id);
        if (res.code !== '200') {
            ElMessage({
                type: 'error',
                message: res.msg
            });
            return;
        }

        ElMessage({
            type: 'success',
            message: '删除成功!'
            
        });

        getRolePage();
    }).catch(() => {
        ElMessage({
            type: 'info',
            message: '已取消删除'
        });
    });
}
</script>

<style scoped>
.card-container,
.toolbar {
    margin-bottom: 15px;
}

.el-table {
    font-size: 12px;
}
</style>