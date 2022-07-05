<!-- 订单详情 -->
<template>
  <div class="order-manage">
    <div class="order-manage-head">
      <div class="title">
        <el-icon>
          <document />
        </el-icon>
        订单详情
      </div>
    </div>
    <el-form :model="checkForm" label-width="140px" class="order-manage-form" ref="subInfo">
      <el-row>
        <el-col :span="12">
          <el-form-item label="公司名称：">
            {{ checkForm.customer_company }}
          </el-form-item>
          <el-form-item label="地址：">
            {{ checkForm.customer_company_province }}{{ checkForm.customer_company_city }}{{
                checkForm.customer_company_area
            }}{{ checkForm.customer_company_addr }}
          </el-form-item>
          <el-form-item label="电话：">
            {{ checkForm.customer_company_tel }}
          </el-form-item>
          <el-form-item label="传真：">
            {{ checkForm.customer_company_fax }}
          </el-form-item>
          <el-form-item label="网址：">
            <a :href="checkForm.customer_company_url" target="_blank">{{ checkForm.customer_company_url }}</a>
          </el-form-item>
          <el-form-item label="Email：">
            {{ checkForm.customer_company_email }}
          </el-form-item>
          <el-form-item label="文件：">
            <a :href="checkForm.contract_url" target="_blank">合同下载（浏览）</a>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户订单编号：">
            {{ checkForm.order_code }}
          </el-form-item>
          <el-form-item label="订单总金额：">
            {{ checkForm.amount }}
          </el-form-item>
          <el-form-item label="币别：">
            {{ checkForm.money_type }}
          </el-form-item>
          <el-form-item label="订单金额大写：">
            {{ checkForm.amount_cn }}
          </el-form-item>
          <el-form-item label="是否含税：">
            {{ checkForm.is_tax ? "是" : "否" }}
          </el-form-item>
          <el-form-item label="付款方式：">
            {{ checkForm.pay_type }}
          </el-form-item>
          <el-form-item label="运输方式：">
            {{ checkForm.transport_type }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="交期：">
        {{ checkForm.delivery_at }}
      </el-form-item>
      <el-form-item label="备注信息：">
        {{ checkForm.remarks }}
      </el-form-item>
      <el-form-item label="物料：">
        <div style="width:900px;margin-top:-10px">
          <Tables v-if="checkForm.items" :tableData="checkForm.items" :tableHead="materialHead"
            :handleWidth="handleWidth" :isHaveHandle="false">
          </Tables>
        </div>
      </el-form-item>


      <el-form-item label="物料样签文件函：">
        <a :href="checkForm.signUrl" target="_blank">{{ checkForm.signName ? checkForm.signName : '暂无' }}</a>
      </el-form-item>
      <el-form-item label="收货地址：">
        <div style="width:900px;margin-top:-10px">
          <Tables v-if="checkForm.items" :tableData="checkForm.receipt_addrs" :tableHead="addressHead"
            :handleWidth="handleWidth" :isHaveHandle="false">
          </Tables>
        </div>
      </el-form-item>
    </el-form>

  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref, onMounted } from 'vue'
import type { ElForm } from 'element-plus'
import Tables from '@/components/table'
import { materialHead, addressHead } from './data'
import { useRoute } from "vue-router";
import router from "@/router";
import Paging from '@/components/paging'
import { request } from '@/utils/request'
import api from '@/api/api'

export default defineComponent({
  name: 'orderDetail',
  components: {
    Tables,
    Paging
  },
  setup() {
    type FormInstance = InstanceType<typeof ElForm>
    const subInfo = ref<FormInstance>()
    const dialogFrom = ref<FormInstance>()
    var data = reactive({
      checkForm: {} as any,
      pageInfo: {
        pageIndex: 1, // 页码
        pageSize: 10, // 页数
        totalCount: 200,
      },
      // 表格数据
      tableData: [],
      materialHead: materialHead,
      addressHead:addressHead,
      handleWidth: "120px",
      // 详情传参
      orderId: "" as any
    })

    // 打开新页面
    const handleAddOrder = async () => {
      router.push('/addOrder')
    }

    const changePage = (pages: any) => {
      let { page, limit } = pages

      if (!Number.isNaN(page)) {
        data.pageInfo.pageIndex = page
      }
      if (!Number.isNaN(limit)) {
        data.pageInfo.pageSize = limit
      }
    }

    // 获取订单详情
    const getInfo = () => {
      let param = {
        is_items: 1,
        is_sign_files: 1,
        is_receipt_addrs: 1,
      }
      request('get', api.orderDetails + data.orderId, param).then((res: any) => {
        // 返回的data存在时
        if (res.data.data) {
          res.data.data.delivery_at = res.data.data.delivery_at.substring(0, 10)
          data.checkForm = res.data.data
          if (res.data.data.sign_files.length > 0) {
            data.checkForm.signName = res.data.data.sign_files[0].sign_file_name
            data.checkForm.signUrl = res.data.data.sign_files[0].sign_file_url
          }
          //地址
          for(let val of res.data.data.receipt_addrs){
            val.addressAll = val.province + val.city + val.area + val.addr
          }

        }
      }).catch((err: any) => { })
    }

    onMounted(() => {
      // 接收url里的参数
      const route = useRoute();
      data.orderId = route.query?.id
      // 获取详情
      getInfo();
    });

    return {
      subInfo,
      dialogFrom,
      ...toRefs(data),
      handleAddOrder,
      changePage,
    }
  }
})
</script>
<style lang="scss">
.order-manage {
  width: 90%;
  background: #FFF;
  box-shadow: 0 2px 4px rgb(0 0 0 / 12%), 0 0 6px rgb(0 0 0 / 4%);
  margin: 0 auto;
  border-radius: 6px;
  padding-bottom: 40px;
  margin-top: 40px;
  overflow: auto;

  &-head {
    width: 100%;
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #f2f2f2;
    display: flex;
    justify-content: space-between;

    .title {
      font-size: 18px;
      font-weight: 600;
      margin-left: 10px;

      .el-icon {
        font-size: 16px;
      }
    }

    .rule {
      margin-right: 20px;
      color: #c3c3c3;

      em {
        color: #e34848;
      }
    }
  }

  &-form {
    width: 98%;
    margin: 0 auto;
    padding-top: 30px;

    input,
    .el-date-editor.el-input,
    .el-textarea {
      width: 400px;
      height: 40px;
    }

    .el-textarea .el-input__count {
      position: absolute;
      bottom: -70px;
      right: 10px;
    }

    &-textarea {
      padding-bottom: 70px;
    }

    .cmp-table {
      width: 100%;
    }

    &-btn {
      margin: 20px 0 0;
    }
  }

  .el-input.w400,
  .el-textarea.w400,
  .el-select.w400 {
    width: 400px;
  }

  .el-form-item--default,
  .el-form-item {
    margin-bottom: 10px;
  }

  .paging {
    /*width: 98%;*/
    width: 1200px;
  }

}
</style>
