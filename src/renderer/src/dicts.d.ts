export {}

interface Dicts{
    [key:string]:any;
}
// 扩展了 vue 模块中的 ComponentCustomProperties 接口，使其包含一个 dicts 属性。这样一来，我们就可以在 Vue 组件中使用 this.dicts 来访问字典对象，而不会遇到类型检查错误。
declare module 'vue'{
    interface ComponentCustomProperties{
        dicts:Dicts
    }
}
