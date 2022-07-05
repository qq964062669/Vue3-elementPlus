<template>
    <div class="tables">
        <el-table class="cmp-table" :data="tableData" ref="multipleTable" tooltip-effect="dark"
            style="width:98%;margin: 0 auto;" border stripe highlight-current-row header-cell-class-name="header-class"
            min-width="100px" show-overflow-tooltip>
            <el-table-column v-for="(item, index) in tableHead" :key="index" :label="item.label" :prop="item.prop"
                :width="item.width">
                <template #default="handle">
                    <div v-if="item.ishandle">
                        <span class="handle-div" @click="hadleRow(handle)">{{ handle.row[item.prop] }}</span>
                    </div>
                    <div v-else :class="colorCheck(handle.row[item.prop])">{{ handle.row[item.prop] }}</div>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" v-if="isHaveHandle" :width="handleWidth" class="table-solt">
                <template #default="scope">
                    <slot :data="scope"></slot>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: 'tables',
    props: {
        tableHead: { type: Array as any, default: () => [] }, //表头必传
        tableData: { type: Array as any, default: () => [] },  //表单数据-必传
        cellStyle: { type: [] as any, default: () => [] },  //控制文字颜色的依据--接收一个数组
        txtColor: { type: [] as any, default: () => [] },     //控制文字颜色的classname --接收一个数组
        handleWidth: { type: String, default: () => '' },  //操作列宽度 默认为空
        isHaveHandle: { type: Boolean, default: () => true }  // 是否有操作列
    },
    setup(props, context) {
        const hadleRow = (val: any) => {
            console.log(val)
            context.emit('func', val.row)
        }
        const colorCheck = (val: string) => {
            let slot = '' as string | number
            props.cellStyle.forEach((item: any, index: number) => {
                if (item == val) {
                    slot = index

                }
            });
            return props.txtColor[slot]
        }
        return {
            hadleRow,
            colorCheck,
        }
    }

})
</script>
<style lang="scss">
.tables {
    padding-top: 15px;

    .el-table__row {
        height: 50px;
    }
}

.header-class {
    background: #ededed !important;
    font-weight: 800 !important;
    color: rgba(51, 51, 51, 1) !important;

    .cmp-table {
        overflow-y: hidden !important
    }

    .el-scrollbar__bar {
        display: none !important;
    }


}

.handle-div {
    color: #79bbff;
    cursor: pointer;
}

.solt-handle {
    display: flex;
    width: 80%;
    justify-content: space-between;
    flex-wrap: wrap;
    margin: 0 auto;

    .el-button {
        margin-bottom: 6px;
    }
}
</style>