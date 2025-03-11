<template>
  <div style="height: 100%;">
    <el-container>
      <el-main>
        <!--标签页-->
        <el-tabs type="border-card">
          <!--科目列表页-->
          <el-tab-pane label="科目列表">
            <el-card shadow="never" class="card-container" style="margin-bottom:15px;">
              <el-form :model="searchForm">
                <el-form-item label="科目名称" class="inline">
                  <el-input v-model="searchForm.subjectName" placeholder="请输入科目名称"></el-input>
                </el-form-item>
                <el-form-item label="科目状态" class="inline">
                  <el-select v-model="searchForm.enabled" placeholder="请选择科目状态" class="full">
                    <el-option v-for="item in dicts.system_global_status" :key="item.k" :label="item.k" :value="item.v">{{ item.k }}</el-option>
                  </el-select>
                </el-form-item>
                <el-form-item class="inline">
                  <el-button type="primary">搜索</el-button>
                  <el-button>重置</el-button>
                </el-form-item>
              </el-form>
            </el-card>
            <el-card shadow="never">
              <div class="toolbar" style="margin-bottom:15px;">
                <el-button type="primary" icon="Plus" @click="btnSubjectialog">添加科目</el-button>
                <el-button type="default" icon="Printer">导出</el-button>
              </div>
              <el-table row-key="id" :data="tableData" width="100%" border stripe :expand-row-keys="expands" :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}" @expand-change="expandChange">
                <el-table-column label="等级管理" type="expand" width="100" align="center">
                  <el-card style="margin: 15px;" shadow="never">
                    <el-button type="primary" icon="plus" style="margin-bottom: 10px" @click="btnGradeDialog">新建等级</el-button>
                    <el-table :data="gradeList" width="100%" border stripe>
                      <el-table-column type="index" label="排序" width="60" align="center"/>
                      <el-table-column label="等级名称" prop="gradeName" align="center" width="200"/>
                      <el-table-column label="价格" prop="amount" align="center"/>
                      <el-table-column label="协议" align="center">
                        <template #default="{row}">
                          <el-link type="primary" :underline="false" @click="btnContractDialog(row.id)">查看协议</el-link>
                        </template>
                      </el-table-column>
                      <el-table-column label="启用状态"  prop="enabled" align="center">
                        <template #default="{row}">
                          <template v-for="item in dicts.system_global_status">
                            <el-tag v-if="row.enabled == item.v">{{item.k}}</el-tag>
                          </template>
                        </template>
                      </el-table-column>
                      <el-table-column label="操作" width="200" align="center">
                        <template #default="{row}">
                          <el-link icon="edit" type="primary" style="margin-left: 10px" :underline="false" @click="btnGradeDialog(row.id)">修改</el-link>
                          <el-link icon="delete" style="margin-left: 10px" type="danger" :underline="false" @click="gradeDel(row.id)">删除</el-link>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-card>
                </el-table-column>
                <el-table-column label="科目名称" prop="subjectName"></el-table-column>
                <el-table-column label="科目状态" prop="enabled">
                  <template #default="{row}">
                    <template v-for="item in dicts.system_global_status">
                      <el-tag v-if="row.enabled == item.v">{{ item.k }}</el-tag>
                    </template>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="150" fixed="right">
                  <template #default="{row}">
                    <el-link :underline="false" type="primary" style="margin-right: 10px;" icon="Edit" @click="btnSubjectialog(row.id)">编辑</el-link>
                    <el-link :underline="false" type="danger" icon="Delete" @click="delSubject(row.id)">删除</el-link>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-tab-pane>
          <!--回收站列表页-->
          <el-tab-pane label="回收站">
              <el-card>
                  回收站
              </el-card>
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
    <subjectDialog
        v-if="dialogVisible"
        v-model:dialogVisible="dialogVisible"
        @subjectChange="getSubjectPage"
        :subjectUpdateId="subjectUpdateId"
    ></subjectDialog>

    <gradeDialog
        v-if="diaGradelogVisible"
        v-model:diaGradelogVisible="diaGradelogVisible"
        :currentSubjectRow="currentSubjectRow"
        @gradeChange="expandChange"
        :gradeUpdateId="gradeUpdateId"
    ></gradeDialog>

    <contractDialog
        v-if="diaContractVisible"
        v-model:diaContractVisible="diaContractVisible"
        :contractId="contractId"
    ></contractDialog>

  </div>
</template>

<script setup lang="ts">
import { reactive , ref , onBeforeMount , getCurrentInstance , ComponentInternalInstance } from 'vue'
import { subjectPage , IsubjectList , IsubjectPage , gradeAll , IGradeData, subjectDelete } from '@api/teachSubject'
import { gradeDelete } from '@api/teachSubjectGrade'
import subjectDialog from './components/subjectDialog.vue'
import gradeDialog from './components/gradeDialog.vue'
import contractDialog from './components/contractDialog.vue'
//搜索
const searchForm = reactive<IsubjectList>({
  current:1,
  size:10,
  subjectName:'',
  enabled:''
})
//table
let tableData = ref<IsubjectPage[]>([]);
let gradeList = ref<IGradeData[]>([]);

onBeforeMount(()=>{
  const { proxy } = getCurrentInstance() as ComponentInternalInstance;
  if( proxy ){
      (proxy as any).getDicts(['system_global_status','system_global_gender']);
  }
  getSubjectPage();
})

//科目列表
const getSubjectPage = async ()=>{
  let res = await subjectPage(searchForm);
  let { records } = res.data;
  tableData.value = records;
}

//当前科目
const currentSubjectRow = reactive({});
//展开
const expandChange = async ( row  )=>{

Object.assign(currentSubjectRow,row);

let res = await gradeAll({
    subjectId:row.id
});
gradeList.value = res.data;
}   

//控制dialog显示
const dialogVisible = ref<boolean>(false);
const subjectUpdateId = ref('');
//添加科目 & 编辑科目
const btnSubjectialog = ( id:string )=>{
if( typeof id=='string' ){
  subjectUpdateId.value = id;
}else{
  subjectUpdateId.value = '';
}
dialogVisible.value = true;
}

//删除科目
import { ElMessage , ElMessageBox } from 'element-plus';
const  delSubject = ( id:string  )=>{
ElMessageBox.confirm('是否删除科目',{
    type:'error',
    confirmButtonText:'删除'
}).then(async ()=>{
    let res = await subjectDelete( id );
    if( res.code !='200' ) return;
    ElMessage({
        type:'success',
        message:'删除成功'
    })
    getSubjectPage();
}).catch(()=>{
    ElMessage({
        type:'info',
        message:'取消删除'
    })
})
}

//新建 & 修改等级
const diaGradelogVisible = ref<boolean>(false);
const gradeUpdateId = ref('');
const btnGradeDialog = ( id:string )=>{
if( typeof id=='string' ){
  gradeUpdateId.value = id;
}else{
  gradeUpdateId.value = '';
}
diaGradelogVisible.value = true;
}

//删除等级
const gradeDel = ( id:string )=>{
ElMessageBox.confirm('是否删除等级',{
    type:'error',
    confirmButtonText:'删除'
}).then(async ()=>{
    let res = await gradeDelete( id );
    if( res.code !='200' ) return;
    ElMessage({
        type:'success',
        message:'删除成功'
    })
    expandChange( currentSubjectRow );
}).catch(()=>{
    ElMessage({
        type:'info',
        message:'取消删除'
    })
})
}

//查看协议
const diaContractVisible = ref<boolean>(false);
const contractId = ref('');
const btnContractDialog = ( id:string )=>{
if( typeof id=='string' ){
  contractId.value = id;
}else{
  contractId.value = '';
}
diaContractVisible.value = true;
}
</script>

<style scoped lang="scss">
.inline {
  margin-right: 20px;
  display: inline-flex;
  vertical-align: middle;
  width: 30%;
}

.tableNav {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .info {
    margin-right: 40px;
  }
}
</style>