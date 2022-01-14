import type { GlobalMenuOption, GlobalBreadcrumb } from '@/interface';

/**
 * 获取面包屑数据
 * @param activeKey - 当前页面路由的key
 * @param menus - 菜单数据
 * @param rootPath - 根路由路径
 */
export function getBreadcrumbByRouteKey(activeKey: string, menus: GlobalMenuOption[], rootPath: string) {
  const breadcrumbMenu = getBreadcrumbMenu(activeKey, menus);
  const breadcrumb = breadcrumbMenu.map(item => transformBreadcrumbMenuToBreadcrumb(item, rootPath));
  return breadcrumb;
}

/**
 * 根据菜单数据获取面包屑格式的菜单
 * @param activeKey - 当前页面路由的key
 * @param menus - 菜单数据
 */
function getBreadcrumbMenu(activeKey: string, menus: GlobalMenuOption[]) {
  const breadcrumbMenu: GlobalMenuOption[] = [];
  menus.some(menu => {
    const flag = activeKey.includes(menu.routeName);
    if (flag) {
      breadcrumbMenu.push(...getBreadcrumbMenuItem(activeKey, menu));
    }
    return flag;
  });
  return breadcrumbMenu;
}

/**
 * 根据单个菜单数据获取面包屑格式的菜单
 * @param activeKey - 当前页面路由的key
 * @param menu - 单个菜单数据
 */
function getBreadcrumbMenuItem(activeKey: string, menu: GlobalMenuOption) {
  const breadcrumbMenu: GlobalMenuOption[] = [];
  if (activeKey.includes(menu.routeName)) {
    breadcrumbMenu.push(menu);
  }
  if (menu.children && menu.children.length) {
    breadcrumbMenu.push(
      ...menu.children.map(item => getBreadcrumbMenuItem(activeKey, item as GlobalMenuOption)).flat(1)
    );
  }
  return breadcrumbMenu;
}

/**
 * 将面包屑格式的菜单数据转换成面包屑数据
 * @param menu - 单个菜单数据
 * @param rootPath - 根路由路径
 */
function transformBreadcrumbMenuToBreadcrumb(menu: GlobalMenuOption, rootPath: string) {
  const hasChildren = Boolean(menu.children && menu.children.length);
  const breadcrumb: GlobalBreadcrumb = {
    key: menu.routeName,
    label: menu.label as string,
    routeName: menu.routeName,
    disabled: menu.routePath === rootPath,
    hasChildren
  };
  if (menu.icon) {
    breadcrumb.icon = menu.icon;
  }
  if (hasChildren) {
    breadcrumb.children = menu.children?.map(item =>
      transformBreadcrumbMenuToBreadcrumb(item as GlobalMenuOption, rootPath)
    );
  }
  return breadcrumb;
}
