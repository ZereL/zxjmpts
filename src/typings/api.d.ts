/*
 * @Author: Hank 
 * @Date: 2019-02-07 10:10:39 
 * @Last Modified by:   Hank 
 * @Last Modified time: 2019-02-07 10:10:39 
 */
declare namespace API {
  export interface Response {
    data: any;
    errMsg: string;
    statusCode: number;
    header: any;
  }
}