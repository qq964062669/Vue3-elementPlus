<!-- 订单列表 -->
<template>
    <div class="order">
        <div class="search">
            <el-form :model="searchData" label-width="10px" class="search-form">
                <el-form-item>
                    <el-input v-model="searchData.company_name" placeholder="请输入公司名称" />
                </el-form-item>
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
            <Tables :tableData="tableData" :tableHead="tableHead" :handleWidth="handleWidth">
                <template #default="scope">
                    <el-button size="small" :icon="View" type="primary" @click="handleView(scope)">详情</el-button>
                    <el-button size="small" :icon="View" type="primary" v-if="scope.data.row.status > 59"
                        @click="handleDelivery(scope)">送货单查看
                    </el-button>
                    <el-button size="small" :icon="Upload" type="warning" v-if="scope.data.row.status == 20"
                        @click="handleUpdata(scope)">上传样签和收货信息
                    </el-button>
                </template>
            </Tables>
            <Paging v-show="pageInfo.totalCount > 0" :total="pageInfo.totalCount" :page="pageInfo.pageIndex"
                :limit="pageInfo.pageSize" @pagination="changePage" />
        </div>
        <el-dialog v-model="upFilesDialog" title="添加" width="1000px" :before-close="closeDialog"
            :close-on-click-modal="false">
            <template #default>


                <el-form :model="upDelivery" label-width="140px">

                    <el-form-item label="  ">

                        <el-upload ref="uploadRef" class="upload-demo" :http-request="uploadAction" :action="fileAction"
                            :auto-upload="true" :limit="1">
                            <el-button type="primary">上传大货样签文件</el-button>

                            <template #tip>
                                <div class="el-upload__tip"></div>
                            </template>
                        </el-upload>

                    </el-form-item>
                    <p class="title-txt">（*多个文件请打包上传,支持zip，7z等格式）</p>
                    <el-form-item label="备注：">
                        <el-input v-model="upDelivery.remarks" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea"
                            placeholder="请输入备注" style="width: 400px" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="showAddForm">添加地址</el-button>
                    </el-form-item>
                    <el-form-item label="收货地址：">
                        <div style="width:900px;margin-top:-10px;margin-left: -10px;">
                            <Tables :tableData="upDelivery.receipt_addrs" :tableHead="addressAddHead">
                                <template #default="scope">
                                    <el-button size="small" :icon="View" type="primary"
                                        @click.prevent="deleteRow(scope.data.$index)">删除
                                    </el-button>
                                </template>
                            </Tables>
                        </div>
                    </el-form-item>
                </el-form>
                <el-dialog v-model="addressDialog" width="600px" title="添加" append-to-body :before-close="closeAddress"
                    :close-on-click-modal="false">
                    <el-form :model="addressForm" label-width="140px" :rules="rules" ref="addressRef">
                        <el-form-item label="收货公司：" prop="company">
                            <el-input v-model="addressForm.company" style="width: 400px;" placeholder="请输入收货公司"
                                clearable />
                        </el-form-item>
                        <el-form-item label="收货地址：" prop="cascader">
                            <el-cascader v-model="addressForm.cascader" placeholder="请选择收货地址" style="width: 400px;"
                                :options="options" :props="setCascader" filterable @change="casChange" />
                        </el-form-item>
                        <el-form-item label="详细地址：" prop="addr">
                            <el-input v-model="addressForm.addr" style="width: 400px;" placeholder="请输入详细地址"
                                clearable />
                        </el-form-item>
                        <el-form-item label="收货人：" prop="name">
                            <el-input v-model="addressForm.name" style="width: 400px;" placeholder="请输入收货人" clearable />
                        </el-form-item>
                        <el-form-item label="联系方式：" prop="phone">
                            <el-input v-model="addressForm.phone" style="width: 400px;" placeholder="请输入联系方式"
                                clearable />
                        </el-form-item>

                    </el-form>
                    <template #footer>
                        <div class="dialog-footer">
                            <el-button @click="closeAddressRule(addressRef)">取 消</el-button>
                            <el-button type="primary" @click="submitAddress(addressRef)">添 加</el-button>
                        </div>
                    </template>
                </el-dialog>
            </template>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="closeDialog">取 消</el-button>
                    <el-button type="primary" @click="sumbitFrom">添 加</el-button>
                </div>
            </template>
        </el-dialog>

    </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from 'vue'
import { RefreshRight, Search, View, EditPen, Upload, Delete } from '@element-plus/icons-vue'
import Tables from '@/components/table'
import { ElMessage } from 'element-plus'
import type { UploadInstance, ElForm } from 'element-plus'
import Paging from '@/components/paging'
import { tableHead, addressAddHead } from './data'
import api from '@/api/api'
import { request } from '@/utils/request'
import router from '@/router'
export default defineComponent({
    name: 'order',
    components: {
        Tables,
        Paging
    },
    setup() {
        const uploadRef = ref<UploadInstance>()// element-upload
        type FormInstance = InstanceType<typeof ElForm>
        const addressRef = ref<FormInstance>()

        var state = reactive({
            searchData: {
                purchase_note_name: '',
                company_name: '',
            },
            pageInfo: {
                pageIndex: 1, // 页码
                pageSize: 10, // 页数
                totalCount: 200,
            }, //分页
            tableData: [] as any,
            tableHead: tableHead,
            addressAddHead: addressAddHead,
            handleWidth: '300px', //操作列宽度
            upfilsDialog: false,
            fileList: [], //文件
            fileUrl: '',
            fileName: '',
            upFilesDialog: false,
            fileAction: api.files,// 文件上传地址
            upDelivery: {
                remarks: '',
                order_id: '',
                customer_id: '',
                sign_file_name: '',
                sign_file_path: '',
                receipt_addrs: [] as any
            },
            options: [] as any,
            setCascader: {
                value: 'name',
                label: 'name',
                children: 'sub'
            },
            addressDialog: false,
            addressForm: {
                company: '',
                phone: '',
                name: '',
                city: '',
                province: '',
                area: '',
                addr: '',
                addressAll: '',
                cascader: [] as any
            } as any,
            rules: {
                company: [{ required: true, message: '请输入旧密码！', trigger: 'blur' }],
                cascader: [
                    {
                        required: true,
                        message: '请选择省市区',
                        trigger: 'change',
                    },
                ],
                addr: [{ required: true, message: '请输入新密码！', trigger: 'blur' }],
                name: [{ required: true, message: '请重新输入新密码！', trigger: 'blur' }],
                phone: [{ required: true, message: '请重新输入新密码！', trigger: 'blur' }],
            },
        })
        const env = import.meta.env
        if (env.MODE === 'development') {
            state.fileAction = 'http://127.0.0.1:4523/mock/960727/api/customer/common/files'
        }
        const handleView = (scope: any) => {
            router.push({
                path: '/orderDetail',
                query: { 'id': scope.data.row.id }
            })
        }
        const handleDelivery = (scope: any) => {
            router.push({
                path: '/delivery',
                query: { 'id': scope.data.row.id }
            })
        }
        //上传送货单
        const handleUpdata = (scope: any) => {
            // 最终提交时的orderID 和customerID 赋值
            state.upDelivery.order_id = scope.data.row.id;
            state.upDelivery.customer_id = scope.data.row.customer_id;

            state.upFilesDialog = true
        }
        //关闭上传文件弹窗
        const closeDialog = () => {
            state.upFilesDialog = false

            state.upDelivery.remarks = '';
            state.upDelivery.order_id = '';
            state.upDelivery.customer_id = '';
            state.upDelivery.sign_file_name = '';
            state.upDelivery.sign_file_path = '';
            state.upDelivery.receipt_addrs = [];
            state.fileUrl = '';
            uploadRef.value!.clearFiles()
        }
        const searchForm = () => {
            state.pageInfo.pageIndex = 1;
            state.pageInfo.pageSize = 10;
            getTableList();
        }
        const restForm = () => {
            state.searchData.purchase_note_name = '';
            state.searchData.company_name = '';
            state.pageInfo.pageIndex = 1;
            state.pageInfo.pageSize = 10;
            getTableList();
        }
        // 行删除事件
        const deleteRow = (index: number) => {
            state.upDelivery.receipt_addrs.splice(index, 1)
        }
        // 显示添加地址弹窗
        const showAddForm = () => {
            state.addressDialog = true;
        }
        const closeAddress = () => {
            state.addressDialog = false;
        }
        const closeAddressRule = async (scope: FormInstance | undefined,) => {
            if (!scope) return
            scope.resetFields()
            closeAddress();

        }
        //添加地址到表格
        const submitAddress = async (scope: FormInstance | undefined,) => {
            if (!scope) return
            await scope.validate((valid, fields) => {
                if (valid) {
                    // 校验通过往表格里添加数据
                    let _data = JSON.parse(JSON.stringify(state.addressForm))
                    _data.addressAll = _data.province + _data.city + _data.area + _data.addr
                    state.upDelivery.receipt_addrs.push(_data)
                    //清空表单
                    scope.resetFields()
                    closeAddress();

                } else {

                    console.log('error submit!', fields)
                }

            })
        }
        //分页事件
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
        //获取级联地址
        const casChange = (val: any) => {
            state.addressForm.province = val[0]; //省
            state.addressForm.city = val[1];//市
            state.addressForm.area = val[2];//区
            if (!state.addressForm.city) {
                state.addressForm.city = ''
            }
            if (!state.addressForm.area) {
                state.addressForm.area = ''
            }
        }
        const sumbitFrom = () => {
            uploadRef.value!.submit()
            if (!state.fileUrl) {
                ElMessage({
                    message: '请先上传大货样签文件',
                    type: 'error',
                })
                return
            }
            if (state.upDelivery.receipt_addrs.length == 0) {
                ElMessage({
                    message: '请至少添加一条收货地址',
                    type: 'error',
                })
                return
            }
            let postData = JSON.parse(JSON.stringify(state.upDelivery))
            for (let val of postData.receipt_addrs) {
                delete val.cascader;
                delete val.addressAll
            }
            //执行提交
            request('post', api.addressFiles, postData).then((res: any) => {
                if (res) {
                    //提交成功
                    ElMessage({
                        message: '添加成功',
                        type: 'success',
                    })
                    state.upFilesDialog = false
                    restForm() // 执行重置Table刷新表单数据
                } else {
                    ElMessage({
                        message: '添加失败',
                        type: 'success',
                    })
                    state.upFilesDialog = false
                }
            })
        }
        const uploadAction = (option: any) => {
            let formData = new FormData();
            formData.append('files[]', option.file)
            formData.append('type', 'signFile')
            request('post', api.files, formData).then((res: any) => {
                // 文件上传后获取 图片地址和 名字  用于汇总提交
                const _data = res.data.data
                if (_data && _data.length > 0) {
                    // 最终提交的文件名字和路径赋值
                    state.upDelivery.sign_file_path = state.fileUrl = _data[0]
                    state.upDelivery.sign_file_name = state.fileName = option.file.name;
                }
            })
        }
        //获取表格数据
        const getTableList = () => {
            let postData = {
                page: state.pageInfo.pageIndex,
                limit: state.pageInfo.pageSize,
                purchase_note_name: state.searchData.purchase_note_name,
                company_name: state.searchData.company_name,
            }
            request('get', api.order, postData).then((res: any) => {
                if (res.status == 200) {
                    let _data = res.data
                    state.tableData = _data.data

                    for (let val of state.tableData) {
                        if (val.status == 10) {
                            val.statusTxt = '已生成订单'
                        } else if (val.status == 20) {
                            val.statusTxt = '已上传合同'
                        } else if (val.status == 50) {
                            val.statusTxt = '已上传样签文件'
                        } else if (val.status == 60) {
                            val.statusTxt = '已录入送货单'
                        }
                        val.purchaseNoteName = val.purchase_note.purchase_note_name
                    }
                    state.pageInfo.totalCount = _data.meta.total
                }
            })
        }
        getTableList();
        // 获取省市级联

        const getAddress = () => {
            request('get', api.address).then((res: any) => {
                state.options = res.data
            })
        }
        getAddress();


        return {
            ...toRefs(state),
            uploadRef,
            addressRef,
            handleView,
            handleDelivery,
            getTableList,
            searchForm,
            sumbitFrom,
            restForm,
            handleUpdata,
            closeAddress,
            closeAddressRule,
            casChange,
            changePage,
            submitAddress,
            uploadAction,
            deleteRow,
            getAddress,
            closeDialog,
            showAddForm,
            RefreshRight,
            Search,
            EditPen,
            View,
            Upload,

        }
    }
})
</script>
<style lang="scss">
.order {
    .el-dialog__header {
        text-align: left;
    }

    .upload-demo {
        height: 60px;
        width: 180px;
        text-align: left;
    }

    .view-img {
        max-width: 700px;
    }

    .title-txt {
        text-align: left;
        color: rgb(245, 108, 108);
        font-size: 12px;
        margin-bottom: 6px;
        position: absolute;
        top: 91px;
        left: 313px;
    }

}
</style>