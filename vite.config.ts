import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from "path";

// https://vitejs.dev/config/
// export default defineConfig({
//   //1.配置路径

//   plugins: [vue()]
// })

export default defineConfig({

  base: './', // 根目录，默认'./'
  publicDir: 'public',//静态资源服务的文件夹
  define: {
    'process.env': {}
  },
  resolve: {
    alias: {
      // 如果报错__dirname找不到，因为引入了path包，需要安装node的ts解析,执行npm install @types/node --save-dev
      // 需要注意的是这里每增加一个别名在tsconfig.ts里也要对应添加
      '@': resolve(__dirname, 'src'),
      '@styles': resolve(__dirname, 'src/assets/styles'),
      '@cmps': resolve(__dirname, 'src/components'),
      '@pages': resolve(__dirname, 'src/views'),
      '@store': resolve(__dirname, 'src/store'),
      '@layout': resolve(__dirname, 'src/layout'),
    },
    

    dedupe: [],
    //情景导出package.json配置中的exports 字段
    conditions: [],
    //解析package.json中的字段
    mainFields: ['module', 'jsnext:main', 'jsnext'],
    //导入时想要省略的扩展名列表
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },
  css: {
    //配置 CSS modules 的行为。选项将被传递给 postcss-modules。
    modules: {},
    // PostCSS 配置（格式同 postcss.config.js）
    // postcss-load-config 的插件配置
    postcss: {},
    //指定传递给 CSS 预处理器的选项
    preprocessorOptions: {
      scss: {
        additionalData: `$injectedColor: orange;`
      }
    }
  },
  build: {
    outDir: "dist",
    assetsDir: "assets", //指定静态资源存放路径 
    sourcemap: false, //是否构建source map 文件
    terserOptions: {
      // 生产环境移除console
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },


  server: {
    //服务器主机
    host: '0.0.0.0',
    //端口号
    port: 9528,
    https: false,//关闭https
    open: true,// 自动打开浏览器
    strictPort: false,//端口号被占用尝试下一个可用端口个 - true不尝试(关闭)
    proxy: {
      '/server': {
        target: 'http://XXX.XX.XXX.XXX:XXXX', // 代理服务器路径
        changeOrigin: true,
        secure: false, // 如果是https接口，需要配置这个参数
        rewrite: (path) => path.replace(/^\/server/, ""),
      }
    }

  },
  plugins: [vue()],

})

