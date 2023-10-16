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

const eventKeyMap = {
  'w': openPopWindow.bind(null, '#/bookmark'), // go to note add panel
  's': openPopWindow.bind(null, '#/search'), // go to note search panel
  // 't': , // todo: go to task panel
  // 'p': , // todo: go to profile panel
  'Escape': closePopWindow, // todo: fix 点击input，input focus 时，escape可能无法退出focus态
}

let popupHandler = null;
let iframeHandler = null;
function popNoteWindow(path) {
  if (popupHandler) {
    return popupHandler;
  }
  const iframeElement = document.createElement("iframe");
  iframeHandler = iframeElement;
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
  chrome.storage.local.get("noteCSSInChromeStorage",
    items => styleSheet.innerHTML = items.noteCSSInChromeStorage);
  shadowDOM.appendChild(styleSheet);
  shadowDOM.appendChild(iframeElement);
  iframeElement.src = chrome.runtime.getURL('pages/index.html') + (path || '');
  document.documentElement.appendChild(shadowWrapper);
  console.log('iframeElement', iframeElement)
  console.log('shadowDOM', shadowDOM)
  console.log('shadowWrapper', shadowWrapper)
  return shadowWrapper;
}
function onKeyEvent(event) {
  console.log('lnote onKeyEvent', event);
  // 忽略文字输入和ime
  if (checkInputMode(event)) {
    return false;
  }
  // todo support Composite Key event handle if need
  for(let key in eventKeyMap) {
    if (event.key === key) {
      eventKeyMap[key]();
      break;
    }
  }
  return true;
}
function getActiveElement() {
  let activeElement = document.activeElement;
  while (activeElement && activeElement.shadowRoot && activeElement.shadowRoot.activeElement)
    activeElement = activeElement.shadowRoot.activeElement;
  return activeElement;
}
//
  // Selectable means that we should use the simulateSelect method to activate the element instead of a click.
  //
  // The html5 input types that should use simulateSelect are:
  //   ["date", "datetime", "datetime-local", "email", "month", "number", "password", "range", "search",
  //    "tel", "text", "time", "url", "week"]
  // An unknown type will be treated the same as "text", in the same way that the browser does.
  //
  function isSelectable(element) {
    // if (!(element instanceof Element)) { return false; }
    const unselectableTypes = ["button", "checkbox", "color", "file", "hidden", "image", "radio", "reset", "submit"];
    return ((element.nodeName.toLowerCase() === "input") && (unselectableTypes.indexOf(element.type) === -1)) ||
        (element.nodeName.toLowerCase() === "textarea") || element.isContentEditable;
  }

  // Input or text elements are considered focusable and able to receieve their own keyboard events, and will
  // enter insert mode if focused. Also note that the "contentEditable" attribute can be set on any element
  // which makes it a rich text editor, like the notes on jjot.com.
  function isEditable(element) {
    return (isSelectable(element)) || ((element.nodeName != null ? element.nodeName.toLowerCase() : undefined) === "select");
  }

  // Embedded elements like Flash and quicktime players can obtain focus.
  function isEmbed(element) {
    let nodeName = element.nodeName != null ? element.nodeName.toLowerCase() : null;
    return ["embed", "object"].includes(nodeName);
  }

  function isFocusable(element) {
    return element && (isEditable(element) || isEmbed(element));
  }
// 检测输入源是否为类input元素，如果是，不进行keyboard事件响应
function checkInputMode(event) {
  // 模拟事件直接放行输入框检测
  if (event.mockEvent) {
    return false;
  }
  // If an Input Method Editor is processing key input and the event is keydown, return 229.
  const isIMEKeyDown = event.keyCode === 229;
  return isIMEKeyDown || isFocusable(event.target) || isFocusable(getActiveElement())
}
// todo: wrap a event tunnel to communicate with popup window
// 1. use iframe name
// 2. use extension event model. need to resolve cold start by send a initial signal to content script when pop window's able to receive msg.
function openPopWindow(openPath) {
  if (!popupHandler) {
    popupHandler = popNoteWindow(openPath);
  }
  const isVisible = popupHandler.className === 'visible';
  const matchPath = iframeHandler.src.match(/#.*?$/);
  if (matchPath && matchPath[0] !== openPath) {
    iframeHandler.src = iframeHandler.src.replace(/#.*?$/, openPath);
  } else if (!matchPath) {
    iframeHandler.src = iframeHandler.src + `${openPath}`;
  }
  if (!isVisible) {
    popupHandler.className = 'visible';
  }
  iframeHandler.focus();
}

function closePopWindow() {
  if (!popupHandler) {
    return;
  }
  popupHandler.className = 'invisible';
  window.focus();
  setTimeout(() => {
    sendMsgToUiFrame({event: "focus", target: 'input',});
  }, 200)
}
// 全局事件注册
document.addEventListener("keydown", onKeyEvent);

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.msgFromPopWindow && request.evt) {
      const evtHandled = onKeyEvent(request.evt);
      sendResponse({evtHandled});
    }
  }
);

let messagePort;
chrome.runtime.onConnect.addListener(function(port) {
  console.log('port establish on content_script: ', port);
  messagePort = port;
  port.onMessage.addListener(function(msg) {
    console.log('on port msg from uiFrame: ', msg);
    if (msg.data === "Knock knock") {
      port.postMessage({event: "focus", target: 'input',});
    }
  });
});

function sendMsgToUiFrame(msg) {
  messagePort?.postMessage(msg);
}
