<template>
  <div class="login-box">
    <div class="ad-box"></div>
    <div class="welcome-box">
      <div class="main align-v">
        <div class="login">
          <div class="login-c">
            <h3>Vue3/TS/ElementP管理系统</h3>
            <el-form :model="loginForm" :rules="rules" class="postForm" ref="postForm">
              <el-form-item prop="name" class="login-item">
                <el-input placeholder="请输入用户名" :prefix-icon="UserFilled" v-model="loginForm.name"></el-input>
              </el-form-item>
              <el-form-item prop="pwd" class="login-item">
                <el-input type="password" placeholder="请输入密码" :prefix-icon="Unlock" v-model="loginForm.pwd"></el-input>
              </el-form-item>
            </el-form>
            <div class="bar-box">
              <Slider @confirmSuccess="confirmSuccess" />
            </div>

            <div class="box-err">
              <div v-if="loginErr">
                <el-icon>
                  <warning-filled />
                </el-icon> {{ loginErrTxt }}
              </div>
            </div>

            <el-button type="primary" class="btn-ok" @click="onSubmit(postForm)">登 录</el-button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import router from "@/router";
import { UserFilled, Unlock } from '@element-plus/icons-vue'
import Slider from "@cmps/Slider";
import { defineComponent, reactive, toRefs, ref } from "vue"
import type { ElForm } from 'element-plus'
import api from "@/api/api";
import { request } from "@/utils/request"

export default defineComponent({
  name: "login",
  props: {},
  components: {
    Slider,
  },
  setup() {

    type FormInstance = InstanceType<typeof ElForm>
    const postForm = ref<FormInstance>()
    let data = reactive({
      loginForm: {
        name: "",
        pwd: "",
        userTest: false as boolean,
      },
      rules: {
        name: [{ required: true, message: '请输入用户名！', trigger: 'blur' }],
        pwd: [{ required: true, message: '请输入密码！', trigger: 'blur' }],
      },
      loginErr: false as boolean,
      loginErrTxt: "" as string
    })
    const confirmSuccess = () => {
      data.loginForm.userTest = true
    }
    const onSubmit = async (scope: FormInstance | undefined,) => {
      if (!scope) return
      await scope.validate((valid, fields) => {
        if (valid) {
          if (!data.loginForm.userTest) {
            data.loginErr = true;
            data.loginErrTxt = "请完成滑动校验！"
            return
          }
          //登录接口
          let postdata = {
            username: data.loginForm.name,
            password: data.loginForm.pwd,
          }
          //登录成功
          localStorage.setItem("userToken", JSON.stringify('success'));
          router.push("/")
          // request('post', api.login,postdata).then((res: any) => {
          //   if (res) {
          //     //登录成功
          //     data.loginErr = false;
          //     let resData = res.data.data
          //     //存储token
          //     if (res.data.data.token) {
          //       const userToken = resData.token
          //       localStorage.setItem("userToken", JSON.stringify(userToken));
          //       router.push("/")
          //     } else {
          //       console.log("用户token获取失败")
          //     }
          //   }
          // }).catch((err: any) => {
          //     data.loginErr = true;
          //     data.loginErrTxt = err.data.msg
          // })
        } else {
          console.log('error submit!', fields)
        }
      })
    }
    return {
      UserFilled,
      Unlock,
      postForm,
      ...toRefs(data),
      onSubmit,
      confirmSuccess,
    }
  }
})
</script>
<style lang="scss">
.login-box {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .ad-box {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(/src/assets/images/login.jpg);
    background-size: cover;
    background-position: top center;
  }

  .welcome-box {
    position: absolute;
    z-index: 999;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    .main {
      position: relative;
      margin: 0 auto;
      width: 100%;
      height: 400px;
      margin-top: -200px;
      top: 50%;
      background: rgba(0, 0, 0, 0.4980392156862745);
    }
  }

  .login {
    width: 456px;
    margin: 0 auto;

    .logo {
      width: 150px;
    }

    .login-c {
      background-color: transparent;
      color: #fff;
      text-align: center;
      border-radius: 10px;
      margin-left: 7.5%;

      .box-err {
        font-size: 16px;
        color: #FFA847;
        width: 85%;
        margin: 5px 0;
        min-height: 22px;

        .el-icon {
          font-size: 18px;
          top: 3px;
          margin-right: 4px;
        }
      }

      h3 {
        margin-bottom: 4%;
        font-size: 38px;
        font-weight: normal;
        letter-spacing: 1px;
        text-align: center;
        width: 85%;
      }

      .el-input {
        margin-bottom: 2% !important;
        width: 85%;

        .el-input__inner {
          height: 50px !important;
          line-height: 50px !important;
          text-indent: 10px;
        }
      }

      .el-input__prefix {
        font-size: 18px;
      }

      .el-form-item__error {
        margin-top: -5px;
        padding-top: 0;
        color: #FFA847;
        content: "WarningFilled";
        margin-left: 5%;
      }

      .el-form-item.is-error .el-input__inner {
        box-shadow: 0 0 0 1px #FFA847 inset;
      }

      .bar-box {
        width: 85%;
      }

      .btn-ok {
        margin-left: -15%;
        margin-top: 2px;
        padding: 20px 0;
        width: 85%;
        font-size: 18px;
        letter-spacing: 1px;
      }
    }
  }
}
</style>