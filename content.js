chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'downloadImages') {
    const images = document.querySelectorAll('img');
    const imageUrls = [];
    
    // 画像URLを収集
    for (let img of images) {
      if (img.src) {
        imageUrls.push(img.src);
      }
    }
    
    if (imageUrls.length > 0) {
      // バックグラウンドスクリプトに画像URLを送信
      chrome.runtime.sendMessage({
        action: 'processImages',
        images: imageUrls,
        format: request.format,
        pageTitle: document.title
      });
      
      sendResponse({status: 'success', count: imageUrls.length});
    } else {
      sendResponse({status: 'error', message: 'No images found'});
    }
    
    return true;
  }
});