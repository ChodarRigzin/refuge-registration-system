import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default ({ mode }) => {
  // 根據模式（development, production）加載 .env 文件
  // process.cwd() 是 .env 文件所在的目錄，'' 表示加載所有變數
  const env = loadEnv(mode, process.cwd(), '');

  return defineConfig({
    plugins: [react()],
    define: {
      // 這會將代碼中所有的 process.env.API_KEY 替換為環境變數中的實際值
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  });
}