<!-- 修改密码 -->
<template>
    <div class="passwd">
        <div class="passwd-head">
            <div class="title">
                <el-icon>
                    <grid />
                </el-icon>
                修改密码
            </div>
            <div class="rule"><em>*</em> 为必填项</div>
        </div>

        <el-form :model="checkForm" label-width="240px" :rules="rules" class="passwd-form" ref="subPasswd">
            <el-form-item prop="oldPwd" label="原密码：" class="pswd-item">
                <el-input v-model="checkForm.oldPwd" placeholder="请输入原密码" type="password" show-password />
            </el-form-item>
            <el-form-item prop="newPwd" label="新密码：" class="pswd-item">
                <el-input v-model="checkForm.newPwd" placeholder="请输入新密码" type="password" show-password />
            </el-form-item>
            <el-form-item prop="surePwd" label="确认密码：" class="pswd-item">
                <el-input v-model="checkForm.surePwd" placeholder="请再次输入新密码" type="password" show-password />
            </el-form-item>
        </el-form>
        <div class="passwd-err">
            <p v-if="showErr">{{ textErr }}</p>
        </div>
        <div class="passwd-btn">
            <el-button type="primary" class="btn" @click="subForm(subPasswd)">提交</el-button>
            <el-button @click="restForm(subPasswd)" class="btn">重置</el-button>
        </div>

    </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref, } from 'vue'
import type { ElForm } from 'element-plus'
import { ElMessage } from 'element-plus'
import api from '@/api/api'
import { request } from '@/utils/request'
import router from '@/router'
export default defineComponent({
    name: 'passwd',
    setup() {
        type FormInstance = InstanceType<typeof ElForm>
        const subPasswd = ref<FormInstance>()
        var state = reactive({
            checkForm: {
                oldPwd: '',
                newPwd: '',
                surePwd: '',
            },
            rules: {
                oldPwd: [{ required: true, message: '请输入旧密码！', trigger: 'blur' }],
                newPwd: [{ required: true, message: '请输入新密码！', trigger: 'blur' }],
                surePwd: [{ required: true, message: '请重新输入新密码！', trigger: 'blur' }],

            },
            showErr: false,
            textErr: '',
        })
        const restForm = async (scope: FormInstance | undefined,) => {
            if (!scope) return
            scope.resetFields()
            state.showErr = true
            state.textErr = ''
        }
        const subForm = async (scope: FormInstance | undefined,) => {
            if (!scope) return
            await scope.validate((valid, fields) => {
                if (valid) {
                    if (state.checkForm.newPwd !== state.checkForm.surePwd) {
                        state.showErr = true
                        state.textErr = '两次新密码不一致'
                        return
                    } else {
                        let postData = {
                            old_password: state.checkForm.oldPwd,
                            password: state.checkForm.newPwd,
                            password_confirmation: state.checkForm.surePwd,
                        }
                        request('patch', api.checkPwd, postData).then((res: any) => {
                            if (res) {
                                ElMessage({
                                    message: '密码修改成功，即将后退出系统，请重新登录',
                                    type: 'success',
                                })
                                setTimeout(() => {
                                    localStorage.removeItem("userToken");
                                    request('post', api.logout).then((res: any) => {
                                        router.push('/login')
                                    })
                                }, 3000);

                            }

                        })
                        state.showErr = false
                        state.textErr = ''
                    }
                } else {

                    console.log('error submit!', fields)
                }
            })

        }
        return {
            subPasswd,
            ...toRefs(state),
            restForm,
            subForm
        }
    }
})
</script>
<style lang="scss">
.passwd {
    width: 1020px;
    height: 500px;
    background: #FFF;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    margin: 0 auto;
    border-radius: 6px;
    padding-bottom: 40px;
    margin-top: 40px;
    overflow: hidden;


    &-head {
        width: 100%;
        height: 50px;
        line-height: 50px;
        border-bottom: 1px solid #f2f2f2;
        display: flex;
        justify-content: space-between;

        .title {
            font-size: 18px;
            font-weight: 600;
            margin-left: 10px;

            .el-icon {
                font-size: 16px;
            }
        }

        .rule {
            margin-right: 20px;
            color: #c3c3c3;

            em {
                color: #e34848;
            }
        }

    }

    &-form {
        width: 780px;
        margin: 0 auto;
        padding-top: 100px;

        input {
            width: 400px;
            height: 40px;
        }

        .pswd-item {
            width: 600px;
            height: 40px;
        }
    }

    &-btn {
        margin-top: 20px;

        .btn {
            width: 140px;
            height: 40px;
            margin: 0 10px;
        }
    }

    &-err {
        color: #f56c6c;
        font-size: 12px;
        text-align: center;
        margin: 0 auto;
        height: 30px;
        line-height: 30px;

    }

    .el-input {}

}
</style>