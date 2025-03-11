<template>
    <el-dialog
        v-model="dialogVisible"
        :title="subjectUpdateId!='' ? '修改科目' : '新增科目' "
        width="400px"
        @close="close"
    >
        <template #default>
            <el-form
                :model="roleForm"
            >
                <el-form-item label="科目名称">
                    <el-input v-model="roleForm.subjectName" placeholder="请输入科目名称"></el-input>
                </el-form-item>

                <el-form-item label="科目状态">
                    <el-radio-group v-model="roleForm.enabled">
                        <el-radio 
                            v-for="item in dicts.system_global_status"
                            :key="item.id"
                            :label="roleForm.enabled == item.v ? roleForm.enabled : item.v"
                        >{{ item.k }}</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        </template>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="close">取消</el-button>
                <el-button type="primary" @click="onSubmit">确认</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref , reactive , onBeforeMount ,  getCurrentInstance , ComponentInternalInstance } from 'vue'
import { subjectAdd  ,  subjectGet , subjectUpdata } from '@api/teachSubject'
const props = defineProps({
    dialogVisible:{
        type:Boolean,
        default:false
    },
    subjectUpdateId:{
        type:String,
        default:''
    }
})
const dialogVisible = ref(  props.dialogVisible );
const subjectUpdateId = ref( props.subjectUpdateId );
const roleForm = reactive({
    "id":'',
    "subjectName": '',
    "enabled": '',
})

onBeforeMount(async ()=>{
    const { proxy } = getCurrentInstance() as ComponentInternalInstance;
    if( proxy ){
        (proxy as any).getDicts(['system_global_status']);
    }

    
    //编辑获取详情
    if( subjectUpdateId.value !='' ){
        let res = await subjectGet(subjectUpdateId.value);
        Object.assign( roleForm,res.data );
    }
})

//关闭dialog
const emit = defineEmits();
const close = ()=>{
    emit('update:dialogVisible',false);
}

//新增
const addSubject = ()=>{
    return subjectAdd(roleForm);
}
//修改
const updateSubject = ()=>{
    return subjectUpdata(roleForm);
}

//确认
const onSubmit = async ()=>{
    if( subjectUpdateId.value !='' ){
        await updateSubject();
    }else{
        await addSubject();
    }
    emit('subjectChange');
    close();
}
</script>

<style scoped>
.tree{
    margin-top: 0.5rem;
    background-color: #fff;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
}
</style>