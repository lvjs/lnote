import {
  MAX_NOTE_TAG_NUM,
  MAX_NOTE_URL_LENGTH,
  MAX_NOTE_TITLE_LENGTH,
  MAX_NOTE_CONTENT_LENGTH,
  MAX_ID_LENGTH,
  MAX_TAG_LENGTH,
  MAX_TAG_DESC_LENGTH,
  MAX_DATE_TIME,
} from "@/config";
export type IRecord = {
  id?: string;
  title: string;
  url?: string;
  tags?: string[];
  note?: string; // 限制1000字符
  richNoteId?: string; // 富文本note id， 1期先不考虑
  sync?: 0 | 1; // 是否已同步远端
  createTime?: number; // millionSeconds
  updateTime?: number; // millionSeconds
};
export type ITag = {
  id?: string;
  content: string;
  class?: 1 | 2 | 3;
  desc?: string;
  parentId?: number;
  sync?: 0 | 1; // 是否已同步远端
  createTime?: number; // millionSeconds
  updateTime?: number; // millionSeconds
};

export const linkNoteSchema = {
  title: "linkNotes schema",
  version: 2, // <- incremental version-number https://rxdb.info/data-migration.html migrationStrategies
  description: "for bookmarks note",
  primaryKey: "id", // <- 'name' is the primary key for the collection, it must be unique, required and of the type string
  type: "object",
  properties: {
    id: {
      type: "string",
      maxLength: MAX_ID_LENGTH, // +new Date() + '' + Math.random()
    },
    title: {
      type: "string",
      maxLength: MAX_NOTE_TITLE_LENGTH,
    },
    url: {
      type: "string",
      maxLength: MAX_NOTE_URL_LENGTH,
    },
    tags: {
      type: "array",
      maxItems: MAX_NOTE_TAG_NUM,
      uniqueItems: true,
      items: {
        type: "string",
        // type: "object",
        // properties: {
        //   cvc: {
        //     type: "number",
        //   },
        // },
      },
    },
    note: {
      type: "string",
      maxLength: MAX_NOTE_CONTENT_LENGTH,
    },
    // can't use synced, for it's oneof rxDocumentProperties, here is the list:
    // ['collection', '_data', '_propertyCache', 'isInstanceOfRxDocument', 'primaryPath', 'primary', 'revision', 'deleted$', 'deleted', 'getLatest', '$', 'get$', 'populate', 'get', 'toJSON', 'toMutableJSON', 'update', 'incrementalUpdate', 'updateCRDT', 'putAttachment', 'getAttachment', 'allAttachments', 'allAttachments$', 'modify', 'incrementalModify', 'patch', 'incrementalPatch', '_saveData', 'remove', 'incrementalRemove', 'destroy', 'deleted', 'synced']
    sync: {
      type: "number", // 0, 1
      maxLength: 1,
      multipleOf: 1,
      default: 0,
      minimum: 0,
      maximum: 1,
    },
    createTime: {
      type: "number",
      final: true, // cant modify later
      multipleOf: 1,
      minimum: 0,
      maximum: MAX_DATE_TIME,
    },
    updateTime: {
      type: "number",
      multipleOf: 1,
      minimum: 0,
      maximum: MAX_DATE_TIME,
    },
  },
  required: ["title", "createTime", "updateTime"],
  indexes: ["title", "url", "note", "sync", "createTime", "updateTime"],
  // encrypted: ["secret"] // <- this means that the value of this field is stored encrypted
  // https://rxdb.info/rx-attachment.html  putAttachment
};

export const tagsSchema = {
  title: "tags schema",
  version: 1,
  description: "for bookmarks tags",
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
      maxLength: MAX_ID_LENGTH,
    },
    content: {
      type: "string",
      maxLength: MAX_TAG_LENGTH,
    },
    class: {
      type: "number",
      maxLength: 1,
      multipleOf: 1,
      default: 0,
      minimum: 0,
      maximum: 2,
    },
    desc: {
      type: "string",
      maxLength: MAX_TAG_DESC_LENGTH,
    },
    parentId: {
      type: "string",
      maxLength: MAX_ID_LENGTH,
    },
    sync: {
      type: "number", // 0, 1
      maxLength: 1,
      multipleOf: 1,
      default: 0,
      minimum: 0,
      maximum: 1,
    },
    createTime: {
      type: "number",
      final: true, // cant modify later
      multipleOf: 1,
      minimum: 0,
      maximum: MAX_DATE_TIME,
    },
    updateTime: {
      type: "number",
      multipleOf: 1,
      minimum: 0,
      maximum: MAX_DATE_TIME,
    },
  },
  required: ["content", "class", "createTime", "updateTime"],
  indexes: ["content", "parentId", "createTime", "sync", "updateTime"],
};
