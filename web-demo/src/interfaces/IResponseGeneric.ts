export interface IResponseGeneric<T> {
  data: T;
  err_code: number;
  err_msg?: string;
}
