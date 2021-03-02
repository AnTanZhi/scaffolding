const routerMap = new Map()
//
/**
 * 遍历本地的路由表，把routername 不在map里的路由component设置成null，并应用远程路由的配置
 * @param localRouter 本地路由
 * @param remoteRouterMap 远程路由表
 */
function matchRouters(localRouter, remoteRouterMap) {
  for (let localItem of localRouter) {
    const remoteItem = remoteRouterMap.get(localItem.name)
    if (!remoteItem) {
      localItem.hidden = true
      // localItem.component = null
    } else {
      useRemoteSetting(localItem, remoteItem)
      if (localItem.children) {
        matchRouters(localItem.children, remoteRouterMap)
      }
    }
  }
}
/**
 * 应用远程配置项
 * @param localItem
 * @param remoteItem
 */
function useRemoteSetting(localItem, remoteItem) {
  console.log(remoteItem, 'remoteItem')
  // const hidden = remoteItem.isShowMenu === 0
  const { title, state, isHasSys } = remoteItem
  localItem.hidden = isHasSys == 1 ? false : true
  if (state == 1)
    localItem.hidden = true
  // localItem.meta.title = menuName ? menuName : localItem.meta.title
  // localItem.meta.icon = icon ? icon : localItem.meta.icon
  // localItem.meta.noCache = true
}
// 后端返回的路由表，构造出map，路由name作为键
function buildMap(remoteRouter) {
  for (let item of remoteRouter) {
    routerMap.set(item.url, item)
    if (item.children) {
      buildMap(item.children)
    }
  }
}
function setAlwaysShow(localRouter) {
  for (let val of localRouter) {
    if (val.children && val.children.length === 1) {
      val.alwaysShow = true
    }
  }
}
function getMenu(routerMap) {
  const myMenu = []
  for (let val of shortcutMenu.menu) {
    /*if(routerMap.get(val.permission)){
      myMenu.push(val)
    }*/
    myMenu.push(val)
  }
  localStorage.setItem(_localStorage_key.ALL_SHORTCUT_MENU, JSON.stringify(myMenu))
}
export function getRouter(localRouter, remoteRouter) {
  buildMap(remoteRouter)
  matchRouters(localRouter, routerMap)
}


