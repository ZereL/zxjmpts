import Action from "./actions";

export const add = (namespace: string, payload?: any) => Action(`${namespace}/add`, payload)
