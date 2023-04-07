import type { IRecord } from "./schema";
export async function addOrUpdateBookMark(url: string, note: IRecord) {
  // todo: Should give choice to sync system bookmark? p2
  // search url match
  // no matches: add bookmark
  // match: update bookmark
  // https://developer.chrome.com/docs/extensions/reference/bookmarks/
  if (import.meta.env.DEV) {
    return;
  }
  const match = await chrome.bookmarks.search({ url });
  if (match?.[0]) {
    // update
  } else {
    // add
    chrome.bookmarks.create({
      title:
        note.title +
        `##lnote_tags:##` +
        note.tags?.join("##") +
        `##lnote_desc:##` +
        note.note +
        `##lnote_id:##` +
        note.id,
      url,
    });
  }
}
