/*
 * @Author: Hank 
 * @Date: 2019-02-07 10:08:34 
 * @Last Modified by:   Hank 
 * @Last Modified time: 2019-02-07 10:08:34 
 */
// 封装的Action模板

const Action = (type: string, payload?: any) => ({ type, payload })

export default Action