聖經探險家｜全站共用到訪人次版

這一版把首頁「到訪人次」從本機 localStorage 改成 Netlify 的中央計數。

【計數方式】
- 全站所有訪客共用同一個數字。
- 同一個瀏覽器「工作階段」只計一次。
- 重新整理頁面不會一直增加。
- 關閉瀏覽工作階段後，之後重新造訪會再計一次。
- 不蒐集姓名、Email 或兒童個人資料。

【部署方式】
1. 請將這個資料夾完整保留，不要只上傳 index.html。
2. 進入您原本的 Netlify 專案 → Deploys。
3. 把「整個資料夾」拖入手動部署區。
4. Netlify 會讀取 package.json、netlify.toml 與 netlify/functions/visit-count.mjs。
5. 部署完成後，原本的 netlify.app 網址不需要更換。

【第一次部署後的正常現象】
- 計數器會從 1 開始，因為這是新的中央資料庫。
- 舊版「本裝置紀錄」的數字不會搬進中央計數，避免把不可靠的本機數字當真實全站流量。
- Netlify Blobs 是跨部署持續保存的 site-wide storage，因此之後更新網站時，計數不會因重新部署而歸零。

【測試】
- 用電腦開網站：數字增加 1。
- 同一個分頁重新整理：應維持不變。
- 用手機或無痕視窗再開一次：應再增加 1。
- 若顯示「統計暫時無法讀取」，遊戲仍可正常使用，通常代表 Function 尚未成功部署。

檔案結構：
index.html
favicon.png
og-cover.png
site.webmanifest
package.json
netlify.toml
netlify/functions/visit-count.mjs
