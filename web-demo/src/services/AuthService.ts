import { IResponseGeneric } from "@/interfaces/IResponseGeneric";
import base_service from "./_base_service";

//未来可以在这里插入很多attribute 做aop处理,比如，自动try catch 处理，比如响应时间和日志，这里暂时简单处理下
//反正可以在 具体的service 做精细话的错误处理
class AuthService {
  async LogInOrLogOn(nick_name: string): Promise<IResponseGeneric<{ code: string }> | null> {
    let res: IResponseGeneric<{ code: string }> | null = null;
    try {
      const temp = await base_service.post<
        IResponseGeneric<{
          code: string;
        }>
      >("/login", {
        nick_name,
      });
      if (temp.status == 200 && temp.data?.err_code == -1) {
        res = temp.data;
      } else {
        throw new Error(temp.data?.err_msg || "");
      }
    } catch (ex) {
      console.log("error");
    }
    return res;
  }
}

const auth_service = new AuthService();
export default auth_service;
