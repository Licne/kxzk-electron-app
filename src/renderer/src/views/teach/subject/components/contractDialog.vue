<template>
    <el-dialog 
        v-model="diaContractVisible"
        title="协议详情"
        width="1030"
        @close="close"
        align-center
    >
      <h1 style="text-align: center;">
        {{detail.gradeName}}
      </h1>
      <div class="update-time">
        更新于{{formatTime(detail.updateTime ? detail.updateTime : detail.createTime)}}
      </div>
      <div class="protocol" v-html="detail.protocol"></div>
      <template #footer>
        <el-button @click="close">取消</el-button>
      </template>
    </el-dialog>
</template>
  
<script lang="ts" setup>
import { ref , reactive , onBeforeMount  } from 'vue'
import { gradeGet } from '@api/teachSubjectGrade'
import tool from '@utils/tool'
const props = defineProps({
    diaContractVisible:{
        type:Boolean,
        default:false
    },
    contractId:{
        type:String,
        default:''
    }
})
const diaContractVisible = ref(  props.diaContractVisible );
const contractId = ref(  props.contractId );
let detail = reactive({
    gradeName:'',
    protocol:'',
    createTime:0,
    updateTime:0,
})

onBeforeMount(async ()=>{
    //获取详情
    if( contractId.value !='' ){
        let res = await gradeGet( contractId.value );
        Object.assign(detail,res.data);
    }
})

//时间戳转换为标准时间
const formatTime = ( value:number )=>{
    return tool.dateFormat( value );
}

//关闭dialog
const emit = defineEmits();
const close = ()=>{
    emit('update:diaContractVisible',false);
}

</script>

<style>
.update-time{
    text-align: center;
    font-size: 12px;
    line-height: 30px;
}
.protocol{
    overflow: scroll;
}
.protocol img{
    font-size: 14px;
    line-height: 20px;
    max-width: 100% !important;
}
</style> 