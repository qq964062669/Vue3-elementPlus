// 路由扩展参数声明
import { _RouteRecordBase } from 'vue-router';

declare module 'vue-router'{
    interface _RouteRecordBase{
        hidden?: boolean | string,   //隐藏路由
        icon?:string
    }
}