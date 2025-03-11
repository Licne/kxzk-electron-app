<template>
    <el-dialog
        v-model="diaGradelogVisible"
        :title="gradeUpdateId!='' ? '修改等级' : '新增等级' " 
        width="900px"
        @close="close"
    >
        <el-form label-width="100px" ref="formRef" :model="diaForm">
            <el-form-item label="当前科目">
                <el-input v-model="currentSubjectRow.subjectName" disabled placeholder="科目名称"/>
            </el-form-item>
            <el-form-item label="等级名称" prop="gradeName">
                <el-input v-model="diaForm.gradeName" placeholder="请输入等级名称"/>
            </el-form-item>
            <el-form-item label="价格" prop="amount">
                <el-input v-model.number="diaForm.amount" :min='0' placeholder="请输入价格"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="enabled" class="inline">
                <el-radio-group v-model="diaForm.enabled">
                <el-radio v-for="item in dicts.system_global_status" :key="item.v" :label="diaForm.enabled==item.v?diaForm.enabled:item.v " :value="item.v">{{ item.k }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="协议" prop="protocol">
                <div style="width: 100%">
                    <wangEditor @onChange="onContentChange" v-model="diaForm.protocol"/>
                </div>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
            <el-button @click="close">取消</el-button>
            <el-button type="primary" @click="onSubmit">保存</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref , reactive , onBeforeMount ,  getCurrentInstance , ComponentInternalInstance } from 'vue'
import wangEditor from '@components/wangeditor/wangEditor.vue'
import { gradeAdd , gradeUpdate , gradeGet } from '@api/teachSubjectGrade'
const props = defineProps({
    diaGradelogVisible:{
        type:Boolean,
        default:false
    },
    currentSubjectRow:{
        type:Object,
        default:{}
    },
    gradeUpdateId:{
        type:String,
        default:''
    }
})
const diaGradelogVisible = ref(  props.diaGradelogVisible );
const currentSubjectRow = reactive( props.currentSubjectRow );
const gradeUpdateId = ref(props.gradeUpdateId);
const diaForm = reactive({
    subjectId: '',
    gradeName: '',
    amount:'',
    protocol:'',
    enabled: '',
})

onBeforeMount(async ()=>{
    if( currentSubjectRow.id ){
        diaForm.subjectId = currentSubjectRow.id;
    }

    //编辑获取详情
    if( gradeUpdateId.value !='' ){
        let res = await gradeGet( gradeUpdateId.value );
        Object.assign(diaForm, res.data);
    }

})

//关闭dialog
const emit = defineEmits();
const close = ()=>{
    emit('update:diaGradelogVisible',false);
}
//富文本填写的数据
const onContentChange = ( val )=>{
    diaForm.protocol = val;
}

//添加等级
const add = ()=>{
    return gradeAdd(diaForm);
}
//修改等级
const update = ()=>{
    return gradeUpdate( diaForm);
}

//确认
const onSubmit = async ()=>{
    if( gradeUpdateId.value !='' ){
        await update();
    }else{
        await add();
    }
    emit('gradeChange',currentSubjectRow);
    close();
}
</script>