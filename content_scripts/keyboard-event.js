let popupHandler = null
function popNoteWindow() {
  if (popupHandler) {
    return popupHandler;
  }
  const iframeElement = document.createElement("iframe");
  const shadowWrapper = document.createElement("div");
  // Firefox doesn't support createShadowRoot, so guard against its non-existance.
  // https://hacks.mozilla.org/2018/10/firefox-63-tricks-and-treats/ says
  // Firefox 63 has enabled Shadow DOM v1 by default
  let shadowDOM;
  if (shadowWrapper.attachShadow)
    shadowDOM = shadowWrapper.attachShadow({mode: "open"});
  else
    shadowDOM = shadowWrapper;
  iframeElement.className = 'iframe-wrapper'
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  // Default to everything hidden while the stylesheet loads.
  // styleSheet.innerHTML = "iframe {display: none;}";
  chrome.storage.local.get("vimiumCSSInChromeStorage",
    items => styleSheet.innerHTML = items.vimiumCSSInChromeStorage);
  shadowDOM.appendChild(styleSheet);
  shadowDOM.appendChild(iframeElement);
  // iframeElement.src = chrome.runtime.getURL('pages/collect-panel.html');
  iframeElement.src = chrome.runtime.getURL('pages/index.html');
  document.documentElement.appendChild(shadowWrapper);
  console.log('iframeElement', iframeElement)
  console.log('shadowDOM', shadowDOM)
  console.log('shadowWrapper', shadowWrapper)
  return shadowWrapper;
}
function onKeyEvent(event) {
  console.log('onKeyEvent', event.shiftKey, event);
  if (event.key === 'w' && !event.shiftKey && !popupHandler) {
    console.log('hello w open')
    popupHandler = popNoteWindow();
    popupHandler.className = 'visible'
  } else if (event.key === 'w' && !event.shiftKey ) {
    console.log('hello w toggle')
    const isVisible = popupHandler.className === 'visible'
    popupHandler.className = isVisible ? 'invisible' : 'visible'
  }
}
document.addEventListener("keydown", onKeyEvent);
