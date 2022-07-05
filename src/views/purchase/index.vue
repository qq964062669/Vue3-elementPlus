<!-- 待转化采购单列表 -->
<template>
    <div class="purchase">
        <div class="search">
            <el-form :model="searchData" label-width="10px" class="search-form">
                <el-form-item>
                    <el-input v-model="searchData.purchase_note_name" placeholder="请输入采购单名称" />
                </el-form-item>
            </el-form>
            <div class="search-btn">
                <el-button :icon="Search" type="primary" @click="searchForm">查询</el-button>
                <el-button :icon="RefreshRight" @click="restForm">重置</el-button>
            </div>
        </div>
        <div class="table-content">
            <div class="table-btn">
                <el-button :icon="Upload" type="primary" @click="showUpFiles">上传采购单</el-button>
            </div>
            <Tables :tableData="tableData" :tableHead="tableHead" :handleWidth="handleWidth">
                <template #default="scope" class="table-slot">
                    <el-button size="small" :icon="View" type="warning"><a :href="scope.data.row.purchase_note_url"
                            target="_blank" style="color: #FFF">预览</a>
                    </el-button>
                </template>
            </Tables>
            <Paging v-show="pageInfo.totalCount > 0" :total="pageInfo.totalCount" :page="pageInfo.pageIndex"
                :limit="pageInfo.pageSize" @pagination="changePage" />
        </div>
        <el-dialog v-model="upFilesDialog" title="上传采购单" clsss="file-dialog" :before-close="closeDialog"
            :close-on-click-modal="false">

            <el-upload ref="uploadRef" class="upload-demo" :http-request="uploadAction" action="#" :auto-upload="false"
                :limit="1">
                <el-button type="primary">上传采购单</el-button>
                <template #tip>
                    <div class="el-upload__tip"></div>
                </template>
            </el-upload>

            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="closeDialog">取 消</el-button>
                    <el-button type="primary" @click="submitUpload">上 传</el-button>
                </div>
            </template>
        </el-dialog>
        <!-- 预览 -->
        <el-dialog v-model="viewImgDialog" title="采购单预览" clsss="file-dialog" :before-close="closeViewDialog"
            :close-on-click-modal="false">
            <el-image :src="viewImg" class="view-img"></el-image>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="closeViewDialog">确 定</el-button>
                </div>
            </template>
        </el-dialog>

    </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from 'vue'
import { RefreshRight, Search, View, EditPen, Download, Upload } from '@element-plus/icons-vue'
import type { UploadInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import Tables from '@/components/table'
import Paging from '@/components/paging'
import { tableHead } from './data'
import api from '@/api/api'
import { request } from '@/utils/request'
export default defineComponent({
    name: 'purchase',
    components: {
        Tables,
        Paging
    },
    setup() {
        const uploadRef = ref<UploadInstance>()// element-upload
        var state = reactive({
            searchData: {
                purchase_note_name: '',
            },
            pageInfo: {
                pageIndex: 1, // 页码
                pageSize: 10, // 页数
                totalCount: 0,
            }, //分页
            tableData: [],
            tableHead: tableHead,
            handleWidth: '180px',
            upFilesDialog: false, //上传弹窗
            fileAction: api.files,
            viewImgDialog: false, //图片预览
            viewImg: '',

        })

        // 上传地址-开发环境判断
        const env = import.meta.env
        if (env.MODE === 'development') {
            state.fileAction = 'http://127.0.0.1:4523/mock/960727/api/customer/common/files'
        }
        const handleEdit = (scope: any) => {
            console.log(scope.data.status)
        }

        const searchForm = () => {
            state.pageInfo.pageIndex = 1;
            state.pageInfo.pageSize = 10;
            getTableList();
        }
        const restForm = () => {
            state.searchData.purchase_note_name = '';
            state.pageInfo.pageIndex = 1;
            state.pageInfo.pageSize = 10;
            getTableList();

        }
        const changePage = (pages: any) => {
            let { page, limit } = pages
            if (!Number.isNaN(page)) {
                state.pageInfo.pageIndex = page
            }
            if (!Number.isNaN(limit)) {
                state.pageInfo.pageSize = limit
            }
            getTableList();
        }
        //获取采购单列表
        const getTableList = () => {
            let postData = {
                page: state.pageInfo.pageIndex,
                limit: state.pageInfo.pageSize,
                purchase_note_name: state.searchData.purchase_note_name,
            }
            request('get', api.purchase, postData).then((res: any) => {
                if (res.status == 200) {
                    let _data = res.data
                    state.tableData = _data.data
                    state.pageInfo.totalCount = _data.meta.total
                }
            })
        }
        //开上传文件弹窗
        const showUpFiles = () => {
            state.upFilesDialog = true
        }
        //关闭上传文件弹窗
        const closeDialog = () => {
            state.upFilesDialog = false
            uploadRef.value!.clearFiles()
        }
        //关闭图片预览
        const closeViewDialog = () => {
            state.viewImgDialog = false;
            state.viewImg = '';
        }
        //上传文件
        const submitFiles = () => {

        }
        getTableList();


        const submitUpload = () => {
            uploadRef.value!.submit()
        }
        const uploadAction = (option: any) => {
            let formData = new FormData();
            formData.append('files[]', option.file)
            formData.append('type', 'purchaseNote')
            request('post', api.files, formData).then((res: any) => {
                // 文件上传成功后调用添加数据接口
                const _data = res.data.data
                if (_data && _data.length > 0) {
                    let fileUrl = _data[0];
                    let postData = {
                        purchase_note_name: option.file.name,  //文件名称
                        purchase_note_path: fileUrl,
                        remarks: '',
                    }
                    request('post', api.purchaseCreate, postData).then((res: any) => {
                        if (res.status == 200 || res.status == 204) {
                            ElMessage({
                                message: '上传成功！',
                                type: 'success',
                            })
                            closeDialog()
                            restForm()
                        } else {
                            ElMessage({
                                message: '上传失败，请重试！',
                                type: 'error',
                            })
                            closeDialog()
                            restForm()
                        }
                    })
                }
            })
        }


        return {
            ...toRefs(state),
            uploadRef,
            handleEdit,
            getTableList,
            searchForm,
            closeViewDialog,
            restForm,
            submitFiles,
            showUpFiles,
            changePage,
            closeDialog,
            submitUpload,
            uploadAction,
            RefreshRight,
            Search,
            EditPen,
            View,
            Upload,
            Download,

        }
    }
})
</script>
<style lang="scss">
.purchase {

    .el-dialog__header {
        text-align: left;
    }

    .upload-demo {
        height: 50px;
    }

    .view-img {
        max-width: 700px;
    }
}
</style>