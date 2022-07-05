<!-- 组件：分页 -->
<template>
    <div class="paging">
        <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :layout="layout"
            :page-sizes="[10, 20, 50]"
            :total="total"
            v-bind="$attrs"
            background 
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
    </div>
</template>
<script lang="ts">
import { nextTick, Prop } from 'vue'
import { defineComponent, computed } from "vue";
interface Props {
    total: number
    page: number
    limit: number
    layout: string
}
export default defineComponent({
    name: 'paging',
    props: {
        total: {
            required: true,
            type: Number,
        },
        page: {
            type: Number,
            default: 5,
        },
        limit: {
            type: Number,
            default: 10,
        },
        layout: {
            type: String,
            default: 'total, sizes, prev, pager, next',
        },
    },
    setup(props: Props, { emit }) {
        const currentPage: any = computed({
            get() {
                return props.page
            },
            set(val) {
                emit('update:page', val)
            },
        })

        const pageSize: any = computed({
            get() {
                return props.limit
            },
            set(val:number) {
                emit('update:limit', val)
            },
        })

        const handleSizeChange = (val: number) => {
            emit('pagination', { page: 1, limit: val })
        }

        const handleCurrentChange = (val: number) => {
            nextTick(() => {
                emit('pagination', { page: val, limit: props.limit})
            })
        }
        return {
            currentPage,
            pageSize,
            handleSizeChange,
            handleCurrentChange
        }
    },
})
</script>
<style lang="scss">
.paging {
    width: 98%;
    margin: 0 auto;
    padding: 20px 0 20px;
    display: flex;
    justify-content: flex-end;
    .el-pagination{
        padding: 0;
    }
    
}
</style>