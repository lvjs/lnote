// lnote同步逻辑：
// 相同url的tab页之间的note不同步，提供reload按钮，使用已存储的内容覆盖当前编写内容。
// 内容存储逻辑：
// 本地 and 远程数据库双写，最后编辑时间比较解决同步时的数据覆盖问题。
// 用户必须获取唯一身份id，防止后面同步有问题（支持切换用户）
// 离线 or 不开启同步：本地storage
// online & 开启同步：远程数据库优先，读发生失败时尝试读取本地，写时多存一份到本地。写远程成功时，更新storage对应记录标志位为已同步。后台同步定期检查有未同步的note尝试同步。
import { createRxDatabase } from "rxdb";
import type { RxDocument } from "rxdb";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";
import { linkNoteSchema, tagsSchema } from "./schema";
import { getDateBasedPrimaryKey } from "../service/utils";
import { addOrUpdateBookMark } from "../service/bookmark";
import type { IRecord, ITag } from "./schema";
import { MAX_SEARCH_ITEM } from "../config/index";
import { addRxPlugin } from "rxdb";
import { RxDBMigrationPlugin } from "rxdb/plugins/migration";
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";
if (import.meta.env.DEV) {
  addRxPlugin(RxDBDevModePlugin);
}
addRxPlugin(RxDBMigrationPlugin);

// todo: 后续增加用户注册功能
// userId 作为数据库的key
const userId = "woodsding";
const noteFilterDims: (keyof IRecord)[] = ["title", "url", "tags", "note"];
// const tagFilterDims: (keyof ITag)[] = ["content"];

class PersistStore {
  // collectionReady: boolean = false;
  initProcess: any;
  localDB: any;
  // memoryNotes: IRecord[]; // Required<IRecord>[];
  // memoryTags: ITag[];
  constructor() {
    this.initProcess = this.init();
  }
  async init() {
    // checkout if db under userId already exist, if not, creat a new database
    // tags[id, content, class, desc, parentId], class=[1,2,3] 1 for note tag, 2,3 for floder type; tag's parent must be a higher class. content， desc做联合键
    // tag update: update note records contains current tag, update tag table. delete operation similar with update.
    // 1. check remote db under userId and try to sync.
    this.localDB = await createRxDatabase({
      name: userId,
      storage: getRxStorageDexie(),
    });
    await this.localDB.addCollections({
      linknote: {
        schema: linkNoteSchema,
        migrationStrategies: {
          1: function (oldDoc: any) {
            return oldDoc;
          },
          2: function (oldDoc: any) {
            return oldDoc;
          },
        },
      },
      tags: {
        schema: tagsSchema,
        migrationStrategies: {
          1: function (oldDoc: any) {
            return oldDoc;
          },
        },
      },
    });
    // this.collectionReady = true;
  }
  changeTargetDB() {
    // for change login user
  }
  async ensureDBReady() {
    await this.initProcess.then(() => {
      console.log(`%c DB READY!`, "color: green");
    });
  }
  async getTags(query: any = null): Promise<ITag[]> {
    await this.ensureDBReady();
    return this.localDB.tags.find({ selector: query }).exec();
  }
  async getNotes(query: any): Promise<RxDocument[]> {
    await this.ensureDBReady();

    return this.localDB.linknote.find({ selector: query }).exec();
  }
  async deleteNote(id: string): Promise<RxDocument> {
    await this.ensureDBReady();

    const query = this.localDB.linknote.findOne({
      selector: { id: { $eq: id } },
    });
    const removedDoc = await query.remove();

    console.error("sure to delete", id, removedDoc);
    return removedDoc;
  }
  async getNotesByKeyword(keyword: string) {
    const allNotes = await this.getNotes(null);
    console.log(
      "allNotes",
      allNotes.map((note) => note.toJSON())
    );
    // todo: filter here and memory cache notes and tags
    // @ts-ignore todo fix ts error
    const pureNotes: Required<IRecord>[] = allNotes?.map((note) =>
      note.toJSON()
    );
    const results: IRecord[] = [];
    const resultIds: string[] = [];
    for (const key of noteFilterDims) {
      pureNotes.reverse().map((item) => {
        if (
          resultIds.length >= MAX_SEARCH_ITEM ||
          resultIds.indexOf(item.id) !== -1
        ) {
          return;
        }

        if (
          key !== "tags" &&
          (item[key] as string).toLowerCase().indexOf(keyword.toLowerCase()) !==
            -1
        ) {
          results.push(item);
          resultIds.push(item.id);
        } else if (key === "tags") {
          for (let i = 0; i < item["tags"].length; i++) {
            if (
              item["tags"][i].toLowerCase().indexOf(keyword.toLowerCase()) !==
              -1
            ) {
              results.push(item);
              resultIds.push(item.id);
              break;
            }
          }
        }
      });
    }
    return results;
  }
  async addNote(note: IRecord) {
    await this.ensureDBReady();

    addOrUpdateBookMark(note);

    // sync in add and update
    // if (note.syncBrowser) {
    //   // todo later: add or modify bookmark accroding to profile settings, for now, default sync.
    //   delete note.syncBrowser;
    // }
    const ts = +new Date();
    return this.localDB.linknote
      .insert({
        ...note,
        id: note.id || getDateBasedPrimaryKey(),
        createTime: ts,
        updateTime: ts,
      })
      .then((res: any) => {
        console.log("add note", res, note);
        return res.toJSON();
      });
  }
  async updateNote(note: IRecord) {
    await this.ensureDBReady();

    addOrUpdateBookMark(note);

    const ts = +new Date();
    return this.localDB.linknote
      .upsert({ ...note, updateTime: ts })
      .then((res: any) => {
        console.log("add note", res, note);
        return res.toJSON();
      });
  }
  async addTag(tag: ITag) {
    await this.ensureDBReady();
    // warnning: don't alt param
    // if (!tag?.id) {
    //   tag.id = getDateBasedPrimaryKey();
    // }

    const ts = +new Date();
    return this.localDB.tags
      .insert({
        ...tag,
        id: tag.id || getDateBasedPrimaryKey(),
        createTime: ts,
        updateTime: ts,
      })
      .then((res: any) => {
        console.log("add tag", res, tag);
      });
  }
}

const noteStore = new PersistStore();
export default noteStore;
