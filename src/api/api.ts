const api = {
    // 接口统一管理，需要备注接口地址
    address: '/address.json', //省市级联

    // User
    login: '/api/customer/auth/login', // 登录
    files: '/api/customer/common/files', //文件上传
    checkPwd: '/api/customer/auth/reset-password', //修改密码
    me: '/api/customer/auth/me',// 个人信息
    logout: '/api/customer/auth/logout',//退出登录
}

export default api