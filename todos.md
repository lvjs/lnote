## lnote todos

# 2023年04月17日14:33:57
1. 多个词联合搜索，以空格分隔。参考vimium

# 2023年04月14日19:53:03
1. 搞一个个人域名，以使用vercel自定义域名功能<chatGPT 乱入>

# 2023年04月12日10:47:20
1. speed up content window show. use placeholder or preload before trigger key< rebuild with astro?>

# 2023年04月07日16:34:01
1. add task Manager <p1> <after build event tunnel>
2. ~~disable content script in iframe window. fix by set "all_frames": false~~
3. build long-lived event tunnel to link content script and iframe
  a. build event stack in content script; 
  b: iframe trigger inital event fetch stashed evnet in content script. 
  c: disable when it's in popup.html or options.html

# 2023年04月04日14:16:17
todos
1. 增加直接打开search pannel的快捷键 <after build event tunnel>
2. 顶部菜单icon化，增加back，forward功能 <p1>
3. add desc header content to note content <after build event tunnel>

# 2023年04月03日15:34:36
todos
1. ~~no duplicate note (switch edit mode to update after add success | check note change after subimt action)~~
2. ~~after add or search notes, hide content popup~~
3. ~~sync system bookmark<p0>~~
  ~~a. if no matched bookmark for current url, create a new one~~
  ~~b. if do have matched bookmark, update it.~~
4. ~~fix case sensitive search~~
5. ~~note search and manipulate(short cut for delete)~~
6. ~~note short cut for edit scenario(delete)~~
7. sync settings move to profile settings instead of bookmark view<p2>

# 2023年03月22日
todo: query all notes
make sure:
1. ~~fine show style~~
2. ~~query in a input box~~
3. ~~edit support~~
4. **note view snap** in search view, show when note can't be fully displayed 

## unsorted thoughts
2023年04月03日10:47:09
# star-link
> sammary note link to all your link-notes

# 径流
> 高级tag，用来汇集、追踪一条线索或者某一方面的知识，添加到径流的知识点会以时间线堆叠的方式进行展示，同时，允许径流存在分支，径流的分支通过添加brch tag的方式来引入。一篇note可以同时属于多个径流分支，甚至可以同属于多个径流。link note会高亮这样的note，河图展示模式会展示不同径流之间的连线。
意义：理清一篇note的归属，rearrange note 标签，强化一条知识线。