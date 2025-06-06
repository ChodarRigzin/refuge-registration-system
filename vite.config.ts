import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react'; // <--- 引入 React 插件

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      plugins: [react()], // <--- 使用 React 插件
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      // (可選) 明確指定 publicDir，雖然預設就是 'public'
      // publicDir: 'public', 
      
      // (可選) 為了確保開發伺服器行為一致，可以添加 server 配置
      server: {
        port: 5173, // 你目前使用的端口
        strictPort: true, // 如果端口被佔用，則失敗而不是嘗試其他端口
        // fs: {
        //   strict: true, // 預設是 true，防止訪問 publicDir 之外的檔案
        // }
      }
    };
});