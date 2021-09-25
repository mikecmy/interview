<template lang="pug">
.login-components(v-loading="is_loading")
  h3 登录demo
  .err-msg(v-show="")
  el-input.nick-name(v-model="nick_name", placeholder="请输入昵称")
  el-button.login-btn(v-show="!is_logined", @click="LogInOrLogOn") 
    | 注册/登录
  div(v-show="is_logined") 您已经登录
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import auth_service from "../services/AuthService";
import { ResErrCode } from "../viewModels/ResErrCode";

@Component
export default class HelloWorld extends Vue {
  nick_name: string = "";
  is_loading: boolean = false;
  //这个应该在AuthState中,且要复杂的多，这里demo一下
  is_logined = window.localStorage.getItem("is_logined") || false;

  async LogInOrLogOn() {
    this.is_loading = true;
    //这里应该是调用 AuthState（Vuex）的方法，由AuthState在vuex中调用AuthService后，完成一些列的状态更新，用户信息缓存等操作
    //这里为了简便起见，（其实是vuex 结合我自己写的自动化mockservice的单元测试没搞定。。。折腾挺长时间的）
    const res = await auth_service.LogInOrLogOn(this.nick_name);
    if (res && res.err_code != ResErrCode.NoErrors) {
      this.is_logined = true;

      //这个逻辑，应该是每次登录的时候，根据cookie是否存在，如果不存在或过期，将信息 带到服务端去验证通过后，得到cookie
      //目前临时性的、象征性的用 localstroge 的变量 演一下
      window.localStorage.setItem("is_logined", res.data.code);
    } else {
      this.is_loading = false;
    }
  }
}
</script>

<style lang="less">
.login-components {
  width: 250px;
  margin: auto;
  border: 1px solid #aaa;
  padding: 20px;
  height: 300px;
  .login-btn,
  .nick-name {
    margin-top: 20px;
  }
}
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
