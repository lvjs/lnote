// todo: 1. change window size(zoom in, zoom out by click 口 - || keyboard ctrl + - +)
// todo: 2. keyboard ctrl + arraw move iframe

// event system
// 1. when loose focus, content window add keyboard listenser, and post to only the host env(current window)
// event to content window: toggle content window, move position, change size.
// event to background: null (default position/size use default settings)

// when open a new content window, create temp storage for current tab, default empty.
// if empty, try to retrive lnote bind to current url and store.(owner: content window)

// initialize local storage for temp tab
// initialize sync storage for all lnote data storage
// sync storage for view
let popupHandler = null
function popNoteWindow() {
  if (popupHandler) {
    return popupHandler;
  }
  const iframeElement = document.createElement("iframe");
  const shadowWrapper = document.createElement("div");
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
