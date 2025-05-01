document.addEventListener('DOMContentLoaded', function() {
  const downloadBtn = document.getElementById('downloadBtn');
  const statusDiv = document.getElementById('status');
  
  // ダウンロードボタンのクリックイベント
  downloadBtn.addEventListener('click', function() {
    statusDiv.textContent = '画像を収集中...';
    
    // chrome.scripting.executeScript を使用して画像を取得
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.scripting.executeScript({
        target: {tabId: tabs[0].id},
        function: getPageImages
      }).then(results => {
        // スクリプト実行結果を取得
        if (results && results[0] && results[0].result) {
          const images = results[0].result;
          const count = images.length;
          
          if (count > 0) {
            statusDiv.textContent = `${count}枚の画像をダウンロード中...`;
            
            // バックグラウンドに画像を送信
            chrome.runtime.sendMessage({
              action: 'downloadImages',
              images: images,
              pageTitle: tabs[0].title
            });
          } else {
            statusDiv.textContent = '画像が見つかりませんでした。';
          }
        } else {
          statusDiv.textContent = '画像の取得に失敗しました。';
        }
      }).catch(error => {
        statusDiv.textContent = 'エラーが発生しました: ' + error.message;
        console.error(error);
      });
    });
  });
});

// ページ内の画像を取得する関数
function getPageImages() {
  const images = document.querySelectorAll('img');
  const imageUrls = [];
  
  for (let img of images) {
    if (img.src) {
      imageUrls.push(img.src);
    }
  }
  
  return imageUrls;
}