import "jest";
import { shallowMount, mount, createLocalVue } from "@vue/test-utils";
import Login from "../Login.vue";

import ElementUI from "element-ui";
import Vue from "vue";

const localVue = createLocalVue();
localVue.use(ElementUI);

describe("Login.vue", () => {
  test("normally render", () => {
    const wrapper = shallowMount(Login, { localVue });
    expect(wrapper.text()).toMatch("注册/登录");
  });

  test("login", async () => {
    const wrapper = mount(Login, { localVue });

    const input = wrapper.find(".nick-name input[type='text']");

    await input.setValue("test");

    const to_test = wrapper.find(".nick-name input[type='text']").element;

    // debugger;
    //@ts-ignore
    expect(to_test.value).toBe("test");

    console.log(wrapper);

    const btn = wrapper.find("button.login-btn");

    btn.trigger("click");

    await Vue.nextTick();

    const loading_mask = wrapper.find("el-loading-mask");

    expect(loading_mask.exists());
  });

  // test("login without input", async () => {
  //   const wrapper = mount(Login, { localVue });

  //   const btn = wrapper.find("button.login-btn");

  //   btn.trigger("click");

  //   await Vue.nextTick();

  //   // const loading_mask = wrapper.find("el-loading-mask");

  //   expect(wrapper.text()).toContain("请输入昵称");
  // });
});
