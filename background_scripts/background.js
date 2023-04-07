let color = '#3aa757';

console.log('run background.js');
(function() {
  console.log('fetch start')
  fetch(chrome.runtime.getURL("content_scripts/common.css")).then(res => {
    console.log('fetch css', res);
    if (res.ok) {
      // console.log('fetch css', res.text())
      res.text().then(txt => {
        return chrome.storage.local.set({noteCSSInChromeStorage: txt});
      })
    }
  })
})();

chrome.runtime.onInstalled.addListener(({reason}) => {
  chrome.storage.sync.set({ color });
  console.log('Default background color set to %cgreen', `color: ${color}`);

  chrome.contextMenus.create({
    "id": "sampleContextMenu",
    "title": "Sample Context Menu",
    "contexts": ["selection"]
  });
})