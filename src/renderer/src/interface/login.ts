export interface ILoginRequest{
	code:string
	msg:string
	data?:string | null
}

export interface UserRuleForm {
    username: string
    password: string
    key: string
    captcha: string
}

//发送验证码
export interface PhoneCodeForm {
    mobile: string
}

//验证码登录
export interface PhoneRuleForm {
    mobile: string
    captcha: string
}