chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'downloadImages') {
    const images = request.images;
    const pageTitle = request.pageTitle || 'webpage';
    
    // タイムスタンプフォルダ名を作成
    const now = new Date();
    const timestamp = now.getFullYear() +
                     ('0' + (now.getMonth() + 1)).slice(-2) +
                     ('0' + now.getDate()).slice(-2) + '_' +
                     ('0' + now.getHours()).slice(-2) +
                     ('0' + now.getMinutes()).slice(-2) +
                     ('0' + now.getSeconds()).slice(-2);
    
    const folderName = `${pageTitle.replace(/[\\/:*?"<>|]/g, '_')}_${timestamp}`;
    
    // 各画像をダウンロード
    images.forEach((url, index) => {
      // 画像のファイル名を取得または生成
      let filename = url.split('/').pop().split('#')[0].split('?')[0];
      if (!filename || filename.indexOf('.') === -1) {
        // 拡張子が無い場合は、画像のMIMEタイプに基づいて推測する
        // ただし、URLからは正確に判断できないため、汎用的な拡張子を使用
        filename = `image_${index + 1}.jpg`;
      }
      
      // ダウンロード
      chrome.downloads.download({
        url: url,
        filename: `${folderName}/${filename}`,
        saveAs: false
      });
    });
  }
});