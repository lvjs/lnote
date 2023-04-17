import globalData from "./global";
import { reverseMap } from "./utils";

type InoDomEvent = Record<string, boolean | number | string>;
const eventKeyMap = {
  w: "togglePopWindow",
};
const functionKeyMap = reverseMap(eventKeyMap);

export async function sendEventToTab(evt: InoDomEvent | string) {
  let event = evt;
  if (typeof evt === "string") {
    event = { key: functionKeyMap[evt] };
  }

  if (!import.meta.env.DEV) {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    if (tab.id) {
      const response = await chrome.tabs.sendMessage(tab.id, {
        msgFromPopWindow: true,
        mockEvent: true,
        evt: event,
      });
      // do something with response here, not outside the function
      console.log(response);
    }
  }
}

function getBasicEventAttribute(e: Event) {
  const basicAttrs: InoDomEvent = {};
  for (const key in e) {
    if (
      ["boolean", "string", "number"].indexOf(typeof e[key as keyof Event]) !==
      -1
    ) {
      basicAttrs[key] = e[key as keyof Event] as boolean | number | string;
    }
  }
  return basicAttrs;
}
async function onKeyEvent(event: KeyboardEvent) {
  console.log("lnote popup window onKeyEvent", event);
  const noDomEvent = getBasicEventAttribute(event);
  globalData.lastPressedKey = noDomEvent;
  // console.error("lastPressKey", noDomEvent);
  // 忽略文字输入和ime
  if (checkInputMode(event)) {
    return;
  }
  // todo: 事件漏斗：如果有match的处理函数且事件有阻止冒泡属性，则不通过event_channel通知content_script，否则通知

  // trigger event to content-script
  sendEventToTab(noDomEvent);
  // // todo support Composite Key event handle if need
  // for (const key in eventKeyMap) {
  //   if (event.key === key) {
  //     eventKeyMap[key]();
  //     break;
  //   }
  // }
}
//
// Selectable means that we should use the simulateSelect method to activate the element instead of a click.
//
// The html5 input types that should use simulateSelect are:
//   ["date", "datetime", "datetime-local", "email", "month", "number", "password", "range", "search",
//    "tel", "text", "time", "url", "week"]
// An unknown type will be treated the same as "text", in the same way that the browser does.

function isSelectable(element: HTMLElement) {
  if (!(element instanceof Element)) {
    return false;
  }
  const unselectableTypes = [
    "button",
    "checkbox",
    "color",
    "file",
    "hidden",
    "image",
    "radio",
    "reset",
    "submit",
  ];
  return (
    (element.nodeName.toLowerCase() === "input" &&
      // @ts-ignore input got type
      unselectableTypes.indexOf(element.type) === -1) ||
    element.nodeName.toLowerCase() === "textarea" ||
    element.isContentEditable
  );
}

// Input or text elements are considered focusable and able to receieve their own keyboard events, and will
// enter insert mode if focused. Also note that the "contentEditable" attribute can be set on any element
// which makes it a rich text editor, like the notes on jjot.com.
function isEditable(element: HTMLElement) {
  return (
    isSelectable(element) ||
    (element.nodeName != null ? element.nodeName.toLowerCase() : undefined) ===
      "select"
  );
}

// Embedded elements like Flash and quicktime players can obtain focus.
function isEmbed(element: HTMLElement) {
  const nodeName =
    element.nodeName != null ? element.nodeName.toLowerCase() : null;
  return nodeName && ["embed", "object"].includes(nodeName);
}

function isFocusable(element: HTMLElement) {
  return element && (isEditable(element) || isEmbed(element));
}

function getActiveElement(): HTMLElement {
  let activeElement = document.activeElement;
  while (
    activeElement &&
    activeElement.shadowRoot &&
    activeElement.shadowRoot.activeElement
  )
    activeElement = activeElement.shadowRoot.activeElement;
  return activeElement as HTMLElement;
}
function checkInputMode(event: KeyboardEvent) {
  // If an Input Method Editor is processing key input and the event is keydown, return 229.
  const isIMEKeyDown = event.keyCode === 229;
  return (
    isIMEKeyDown ||
    isFocusable(event.target as HTMLElement) ||
    isFocusable(getActiveElement())
  );
}
// 全局事件注册
document.addEventListener("keydown", onKeyEvent);

export {};
