const tableHead = [
    {
        label: "订单编号", // 表头名称 必传
        prop: "order_code", //对应数据流Key  必传
        ishandle: false, // 是否有点击事件
    },
    {
        label: "订单状态",
        prop: "statusTxt",
        ishandle: false,
    },
    {
        label: "采购单源文件名称",
        prop: "purchaseNoteName",
        ishandle: false,
    }, {
        label: "订单录入时间",
        prop: "created_at",
        ishandle: false,
    },
]
// 物料表格
const materialHead = [
    {
        label: "物料编号", // 表头名称 必传
        prop: "product_code", //对应数据流Key  必传
        ishandle: false, // 是否有点击事件
    },
    {
        label: "物料名称和规格",
        prop: "product_name_spec",
        ishandle: false,
    },
    {
        label: "物料描述",
        prop: "product_desc",
        ishandle: false,
    },
    {
        label: "单位",
        prop: "product_unit",
        ishandle: false,
    },
    {
        label: "单价",
        prop: "product_price",
        ishandle: false,
    },
    {
        label: "总数量",
        prop: "product_count",
        ishandle: false,
    },
    {
        label: "总价",
        prop: "product_amount",
        ishandle: false,
    },
    {
        label: "备注",
        prop: "remarks",
        ishandle: false,
    },
]
//收货地址表头
const addressHead = [
    {
        label: "收货公司", // 表头名称 必传
        prop: "company", //对应数据流Key  必传
        ishandle: false, // 是否有点击事件
    },
    {
        label: "收货人",
        prop: "name",
        ishandle: false,
    },
    {
        label: "收货地址",
        prop: "addressAll",
        ishandle: false,
    },
    {
        label: "联系方式",
        prop: "phone",
        ishandle: false,
    },
]
//送货单表头
const deliveryHead = [
    {
        label: "送货单编号", // 表头名称 必传
        prop: "delivery_note_code", //对应数据流Key  必传
        ishandle: false, // 是否有点击事件
    },
    {
        label: "公司名称",
        prop: "receipt_company",
        ishandle: false,
    },
    {
        label: "收货地址",
        prop: "addressAll",
        ishandle: false,
    },
    {
        label: "收货人",
        prop: "receipt_name",
        ishandle: false,
    },
    {
        label: "收货人联系方式",
        prop: "receipt_phone",
        ishandle: false,
    },
    {
        label: "上传时间",
        prop: "created_at",
        ishandle: false,
    },
]
const addressAddHead = [
    {
        label: "收货公司", // 表头名称 必传
        prop: "company", //对应数据流Key  必传
        ishandle: false, // 是否有点击事件
    },
    {
        label: "收货人",
        prop: "name",
        ishandle: false,
    },
    {
        label: "收货地址",
        prop: "addressAll",
        ishandle: false,
    },
    {
        label: "联系方式",
        prop: "phone",
        ishandle: false,
    },
]
export {
    tableHead,
    materialHead,
    addressHead,
    deliveryHead,
    addressAddHead
}