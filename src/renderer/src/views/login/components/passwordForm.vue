<template>
    <div>
        <el-form ref="ruleFormRef" :model="form" :rules="rules" label-width="0" size="large">
            <el-form-item prop="username">
                <el-input v-model="form.username" prefix-icon="user" clearable
                    :placeholder="$t('login.userPlaceholder')">
                </el-input>
            </el-form-item>

            <el-form-item prop="password">
                <el-input v-model="form.password" prefix-icon="lock" clearable show-password
                    :placeholder="$t('login.PWPlaceholder')"></el-input>
            </el-form-item>

            <el-form-item>
                <div class="box-code">
                    <el-input v-model="form.captcha" prefix-icon="CircleCheck" clearable
                        placeholder="请输入验证码"></el-input>
                    <el-image class='code' :src="captchaUrl" @click="getCaptcha"></el-image>
                </div>
            </el-form-item>

            <div class="rememberMe">
                <div>
                    <el-checkbox label="记住密码" v-model="memoPassWord" @change="onMemoPassWord"></el-checkbox>
                </div>
                <div>
                    <router-link to="/reset_password">{{ $t('login.forgetPassword') }}</router-link>
                </div>
            </div>

            <el-form-item>
                <el-button type="primary" style="width: 100%;" round @click="login(ruleFormRef)" :loading="isLogin">{{
                    $t('login.signIn') }}</el-button>
            </el-form-item>
        </el-form>



    </div>
</template>

<script setup lang="ts">
import { reactive, ref, onBeforeMount, Ref } from 'vue';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { captchaImage, loginByJson } from '@api/login';
import { Decrypt, Encrypt } from '@utils/aes';
import { UserRuleForm } from '@interface/login'
import { useUserStore } from '@store/useUserStore';
import { useMenuStore } from '@store/useMenuStore';
import { useRouter } from 'vue-router';
import useLogin from '@hooks/useLogin';
import useMemoPassWord from '@hooks/useMemoPassword';


const ruleFormRef = ref<FormInstance>()
const form = reactive<UserRuleForm>({
    username: "",
    password: "",
    captcha: "",
    key: ''
})

let rules = reactive<FormRules<UserRuleForm>>({})
// 生命周期调用一次
onBeforeMount(() => {

    let userPwd:string | null = localStorage.getItem('user-pwd');
    if(  userPwd  ){
        let { username , password } : {username:string,password:string} = JSON.parse(userPwd  );
        form.username = Decrypt( username );
        form.password = Decrypt( password );
    }

    // 验证规则
    rules = {
        username: [
            { required: true, message: '请输入姓名', trigger: 'blur' },
        ],
        password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
        ],
    }

    getCaptcha()
})

// 验证码
const captchaUrl = ref<string>('')

// 验证码
const getCaptcha = async () => {
    const key: string = new Date().getTime().toString();
    form.key = key;
    let res = await captchaImage({ key })
    console.log(res);
    let blob = new Blob([res], { type: 'application/vnd.ms-excel' });
    console.log(blob);
    let imgUrl = URL.createObjectURL(blob);
    captchaUrl.value = imgUrl;
}

// 登录
const router = useRouter()
let isLogin = false;
const login = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid) => {
        if (valid) {
            isLogin = true;
            let res = await loginByJson({
                username: Encrypt(form.username),
                password: Encrypt(form.password),
                key: form.key,
                captcha: form.captcha
            })
            if (res.code != '200') {
                return ElMessage.error(res.msg);
            }

            //调用hooks
            useLogin(res.data);
            // 记住密码
            setMemoPassWord();

            isLogin = false
            ElMessage.success(res.msg);


        } else {
            return ElMessage.warning('请填写正确内容');
        }
        return;
    })
}
// 记住密码

const {  onMemoPassWord , memoVal  } = useMemoPassWord();
const memoPassWord:Ref<boolean> = ref( memoVal );

const setMemoPassWord = ()=>{
    if( memoPassWord.value ){
        const userPwd:{
            username:string
            password:string
        } = {
            username:Encrypt(form.username),
            password:Encrypt(form.password)
        }
        localStorage.setItem('user-pwd',JSON.stringify(userPwd));
    }else{
        localStorage.removeItem('user-pwd');
    }
}
</script>

<style scoped>
.box-code {
    display: flex;
    align-items: center;
    width: 100%;
    height: 40px;
    cursor: pointer;
}

.code {
    margin-left: 10px;
    width: 100px;
    height: 40px;
    cursor: pointer;
}

.rememberMe {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    font-size: 14px;
}
</style>