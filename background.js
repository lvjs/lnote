let color = '#3aa757';

console.log('background.js');
(function() {
  console.log('fetch start')
  fetch(chrome.runtime.getURL("content_scripts/common.css")).then(res => {
    console.log('fetch css', res);
    if (res.ok) {
      // console.log('fetch css', res.text())
      res.text().then(txt => {
        return chrome.storage.local.set({vimiumCSSInChromeStorage: txt});
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


  // // See https://developer.chrome.com/extensions/runtime#event-onInstalled
  // if ([ "chrome_update", "shared_module_update" ].includes(reason)) { return; }
  // // if (Utils.isFirefox()) { return; }
  // const manifest = chrome.runtime.getManifest();
  // // Content scripts loaded on every page should be in the same group. We assume it is the first.
  // const contentScripts = manifest.content_scripts[0];
  // const jobs = [ [ chrome.tabs.executeScript, contentScripts.js ], [ chrome.tabs.insertCSS, contentScripts.css ] ];
  // // Chrome complains if we don't evaluate chrome.runtime.lastError on errors (and we get errors for tabs on
  // // which Vimium cannot run).
  // const checkLastRuntimeError = () => chrome.runtime.lastError;
  // return chrome.tabs.query({ status: "complete" }, function(tabs) {
  //   for (let tab of tabs)
  //     for (let [ func, files ] of jobs)
  //       for (let file of files)
  //         func(tab.id, { file, allFrames: contentScripts.all_frames }, checkLastRuntimeError);
  // });
});
