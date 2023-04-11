import type { IRecord } from "./schema";

function createBookmarkTitleFromNote(note: IRecord) {
  let ret = note.title ?? "";
  // 分隔符
  const keySeperateMap: Record<string, string> = {
    tags: "|",
    note: "~",
    id: "#",
  };
  for (const key in keySeperateMap) {
    let content = note[key as keyof IRecord];
    if (content) {
      if (key === "tags") {
        content = note.tags?.join("\t");
      }
      ret += `#|${keySeperateMap[key]}${content}${keySeperateMap[key]}|# `;
    }
  }
  return ret;
}
// console.log(
//   createBookmarkTitleFromNote({
//     title: "123",
//     note: "this is note",
//     id: "xxxxsss22=ssdf",
//     tags: ["233", "456"],
//   })
// );
export async function addOrUpdateBookMark(note: IRecord) {
  // todo: Should give choice to sync system bookmark? p2
  // search url match
  // no matches: add bookmark
  // match: update bookmark
  // https://developer.chrome.com/docs/extensions/reference/bookmarks/
  if (import.meta.env.DEV) {
    return;
  }
  const url = note.url;
  if (!url) {
    return;
  }
  const match = await chrome.bookmarks.search({ url });
  if (match?.[0]) {
    // update
    chrome.bookmarks
      .update(match[0].id, {
        title: createBookmarkTitleFromNote(note),
        url,
      })
      .then((res) => {
        console.log("update bookmark res", res);
      });
  } else {
    // add
    chrome.bookmarks
      .create({
        title: createBookmarkTitleFromNote(note),
        url,
      })
      .then((res) => {
        console.log("add bookmark res", res);
      });
  }
}
