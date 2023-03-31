import { watch, reactive } from "vue";
interface GlobalData {
  lastPressedKey: null | Record<string, any>;
  [key: string]: any;
}
const globalData: GlobalData = reactive({
  lastPressedKey: null, // 上次按下的键，保留500ms
  // additional properties can be added here
});
export default globalData;

watch(
  () => globalData.lastPressedKey,
  (newVal) => {
    if (newVal) {
      setTimeout(() => {
        globalData.lastPressedKey = null;
      }, 500);
    }
  }
);
