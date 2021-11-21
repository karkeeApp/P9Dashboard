import { Breakpoint, ScreenMap } from 'antd/lib/_util/responsiveObserve';
import * as _ from 'lodash';

// Types
import { NavMenu } from '@/types/nav';

class Utils {
  /**
   * Get first character from first & last sentences of a username
   * @param {String} name - Username
   * @return {String} 2 characters string
   */
  public static getNameInitial(name: string): string {
    const initials = name.match(/\b\w/g) || [];
    return ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
  }

  /**
   * Get current path related object from Navigation Tree
   * @param {NavMenu | NavMenu[]} navTree - Navigation Tree from directory '@/configs/NavigationConfig'
   * @param {String} path - Location path you looking for e.g '/app/dashboards/analytic'
   * @return {Object} object that contained the path string
   */
  public static getRouteInfo(
    navTree: NavMenu[] | NavMenu,
    path: string,
  ): NavMenu {
    if ((navTree as NavMenu).path === path) {
      return navTree as NavMenu;
    }

    let route: NavMenu = {} as NavMenu;

    for (const p in navTree) {
      if (
        Object.prototype.hasOwnProperty.call(navTree, p) &&
        typeof (navTree as NavMenu)[p] === 'object'
      ) {
        route = this.getRouteInfo((navTree as NavMenu)[p] as NavMenu, path);
        if (!_.isEmpty(route)) {
          return route;
        }
      }
    }

    return route;
  }

  /**
   * Get accessible color contrast
   * @param {String} hex - Hex color code e.g '#3e82f7'
   * @return {String} 'dark' or 'light'
   */
  public static getColorContrast(hex: string): 'dark' | 'light' {
    if (!hex) {
      return 'dark';
    }
    const threshold = 130;

    function cutHex(h: string) {
      return h.charAt(0) === '#' ? h.substring(1, 7) : h;
    }
    function hexToR(h: string) {
      return parseInt(cutHex(h).substring(0, 2), 16);
    }
    function hexToG(h: string) {
      return parseInt(cutHex(h).substring(2, 4), 16);
    }
    function hexToB(h: string) {
      return parseInt(cutHex(h).substring(4, 6), 16);
    }

    const hRed = hexToR(hex);
    const hGreen = hexToG(hex);
    const hBlue = hexToB(hex);

    const cBrightness = (hRed * 299 + hGreen * 587 + hBlue * 114) / 1000;
    if (cBrightness > threshold) {
      return 'dark';
    }
    return 'light';
  }

  /**
   * Darken or lighten a hex color
   * @param {String} color - Hex color code e.g '#3e82f7'
   * @param {Number} percent - Percentage -100 to 100, positive for lighten, negative for darken
   * @return {String} Darken or lighten color
   */
  public static shadeColor(color: string, percent: number): string {
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);
    R = parseInt(String((R * (100 + percent)) / 100), 10);
    G = parseInt(String((G * (100 + percent)) / 100), 10);
    B = parseInt(String((B * (100 + percent)) / 100), 10);
    R = R < 255 ? R : 255;
    G = G < 255 ? G : 255;
    B = B < 255 ? B : 255;
    const RR =
      R.toString(16).length === 1 ? `0${R.toString(16)}` : R.toString(16);
    const GG =
      G.toString(16).length === 1 ? `0${G.toString(16)}` : G.toString(16);
    const BB =
      B.toString(16).length === 1 ? `0${B.toString(16)}` : B.toString(16);
    return `#${RR}${GG}${BB}`;
  }

  /**
   * Convert RGBA to HEX
   * @param {String} rgba - RGBA color code e.g 'rgba(197, 200, 198, .2)')'
   * @return {String} HEX color
   */
  public static rgbaToHex(rgba: string): string {
    const trim = (str: string) => str.replace(/^\s+|\s+$/gm, '');
    const inParts = rgba.substring(rgba.indexOf('(')).split(',');
    const r = parseInt(trim(inParts[0].substring(1)), 10);
    const g = parseInt(trim(inParts[1]), 10);
    const b = parseInt(trim(inParts[2]), 10);
    const a = parseFloat(trim(inParts[3].substring(0, inParts[3].length - 1)));
    const outParts = [
      r.toString(16),
      g.toString(16),
      b.toString(16),
      Math.round(a * 255)
        .toString(16)
        .substring(0, 2),
    ];

    outParts.forEach((part, i) => {
      if (part.length === 1) {
        outParts[i] = `0${part}`;
      }
    });
    return `#${outParts.join('')}`;
  }

  /**
   * Returns either a positive or negative
   * @param {Number} number - number value
   * @param {any} positive - value that return when positive
   * @param {any} negative - value that return when negative
   * @return {any} positive or negative value based on param
   */
  public static getSignNum<P = unknown, N = unknown>(
    number: number,
    positive: P,
    negative: N,
  ): P | N | null {
    if (number > 0) {
      return positive;
    }
    if (number < 0) {
      return negative;
    }
    return null;
  }

  /**
   * Returns either ascending or descending value
   * @param {Object} a - antd Table sorter param a
   * @param {Object} b - antd Table sorter param b
   * @param {String} key - object key for compare
   * @return {any} a value minus b value
   */
  public static antdTableSorter(
    a: { [key: string]: string | number },
    b: { [key: string]: string | number },
    key: string,
  ): number | undefined {
    if (typeof a[key] === 'number' && typeof b[key] === 'number') {
      return (a[key] as number) - (b[key] as number);
    }

    if (typeof a[key] === 'string' && typeof b[key] === 'string') {
      const aVal: string = (a[key] as string).toLowerCase();
      const bVal: string = (b[key] as string).toLowerCase();

      if (aVal > bVal) {
        return -1;
      }

      if (bVal > aVal) {
        return 1;
      }

      return 0;
    }

    return undefined;
  }

  /**
   * Filter array of object
   * @param {T[]} list - array of objects that need to filter
   * @param {keyof T} key - object key target
   * @param {T[keyof T]} value  - value that excluded from filter
   * @return {T[]} a value minus b value
   */
  public static filterArray<T = Record<string, unknown>>(
    list: T[],
    key: keyof T,
    value: T[keyof T],
  ): T[] {
    let data = list;
    if (list) {
      data = list.filter((item) => item[key] === value);
    }
    return data;
  }

  /**
   * Remove object from array by value
   * @param {T[]} list - array of objects
   * @param {keyof T} key - object key target
   * @param {T[keyof T]} value  - target value
   * @return {T[]} Array that removed target object
   */
  public static deleteArrayRow<T = Record<string, unknown>>(
    list: T[],
    key: keyof T,
    value: T[keyof T],
  ): T[] {
    let data = list;
    if (list) {
      data = list.filter((item) => item[key] !== value);
    }
    return data;
  }

  /**
   * Wild card search on all property of the object
   * @param {T[]} list - array for search
   * @param {string | number} input - any value to search
   * @return {T[]} array of object contained keyword
   */
  public static wildCardSearch<T = Record<string, unknown>>(
    list: T[],
    input: string | number,
  ): T[] {
    const searchText = (item: T): boolean | undefined => {
      for (const key in item) {
        if (item[key] == null) {
          continue;
        }

        if (
          (item[key] as unknown as string | number)
            .toString()
            .toUpperCase()
            .indexOf(input.toString().toUpperCase()) !== -1
        ) {
          return true;
        }
      }

      return undefined;
    };
    const result = list.filter((value) => searchText(value));
    return result;
  }

  /**
   * Get Breakpoint
   * @param {Object} screens - Grid.useBreakpoint() from antd
   * @return {Array} array of breakpoint size
   */
  public static getBreakPoint(screens: ScreenMap): Breakpoint[] {
    const breakpoints: Breakpoint[] = [];
    for (const key in screens) {
      if (Object.prototype.hasOwnProperty.call(screens, key)) {
        const element = screens[key as Breakpoint];
        if (element) {
          breakpoints.push(key as Breakpoint);
        }
      }
    }
    return breakpoints;
  }
}

export default Utils;
