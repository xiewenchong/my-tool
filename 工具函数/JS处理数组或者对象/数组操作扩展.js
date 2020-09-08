/**
 * Created by guangqiang on 2017/8/27.
 */

/** 数组拓展工具类 **/

const _array = {
  //计数数组中某个值的出现次数
  countOccurrences: (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a + 0), 0),
  // 计算数组中每个元素出现的个数
  d = arr => {
    arr.reduce((a, b) => {
      if (b in a) {
        a[b]++;
      } else {
        a[b] = 1;
      }
      return a;
    }, {});
  },
  // 数组去重
  removeReapt: (arrOld) => {
    var arr = [];
    for (var i = 0, len = arrOld.length; i < len; i++) {
      if (arr.indexOf(arrOld[i]) == -1) {
        arr.push(arrOld[i]);
      }
    }
    return arr;
  },
  /**
   * 往数组中添加元素，若数组中已有此元素，则删除重复元素，添加新的元素
   * @param array
   * @param item
   * @returns {*}
   */
   update: (array, item) => {
    if (!Array.isArray(array)) {
      return []
    }
    for (let i = 0; i < array.length; i++) {
      let value = array[i]
      if (item === value) {
        array.splice(i, 1)
      }
    }
    array.push(item)
    return array
  },

  /**
   * 往数组中添加元素，若数组中有则不再添加
   * @param array
   * @param item
   * @returns {*}
   */
  add: (array, item) => {
    if (!Array.isArray(array)) {
      return []
    }
    for (let i = 0; i < array.length; i++) {
      let value = array[i]
      if (item === value) {
        return array
      }
    }
    array.push(item)
    return array
  },

  /**
   * 往数组中追加元素，元素追加到数组栈底
   * @param array
   * @param item
   * @returns {*}
   */
  push: (array, item) => {
    if (!Array.isArray(array)) {
      return []
    }
    array.push(item)
    return array
  },

  /**
   * 往数组中追加元素，元素追加到数组栈顶
   * @param array
   * @param item
   * @returns {*}
   */
  unshift: (array, item) => {
    if (!Array.isArray(array)) {
      return []
    }
    array.unshift(item)
    return array
  },

  /**
   * 往数组的指定位置插入一个元素
   * @param array
   * @param location
   * @param item
   * @returns {*}
   * @private
   */
  _splice: (array, location, item) => {
    if (!Array.isArray(array)) {
      return []
    }
    array.splice(location, 0, item)
    return array
  },

  /**
   * 往数组中指定位置插入指定长度个数的元素
   * @param array
   * @param item
   * @param location
   * @returns {*}
   */
  splice_A: (array, location, length, item) => {
    if (!Array.isArray(array)) {
      return []
    }
    array.splice(location, length, item)
    return array
  },

  /**
   * 删除数组中指定元素
   * @param array
   * @param item
   * @returns {*}
   */
  remove: (array, item) => {
    if (!Array.isArray(array)) {
      return []
    }
    for (let i = 0; i < array.length; i++) {
      let value = array[i]
      if (item === value) {
        array.splice(i, 1)
      }
    }
    return array
  },

  /**
   * 删除数组中最后一个元素
   * @param array
   * @returns {*}
   */
  pop: (array) => {
    if (!Array.isArray(array)) {
      return []
    }
    array.pop()
    return array
  },

  /**
   * 删除数组中第一个元素
   * @param array
   * @returns {*}
   */
  shift: (array) => {
    if (!Array.isArray(array)) {
      return []
    }
    array.shift()
    return array
  },

  /**
   * 删除数组中指定位置，指定长度的元素
   * @param array
   * @param location
   * @param length
   * @returns {*}
   */
  splice_D: (array, location, length) => {
    if (!Array.isArray(array)) {
      return []
    }
    array.splice(location, length)
    return array
  },

  /**
   * 交换数组中两个元素的位置
   * @param array
   * @param index1
   * @param index2
   * @returns {*}
   */
  swapItems: (array, index1, index2) => {
    array[index1] = array.splice(index2, 1, array[index1])[0];
    return array;
  },

  /**
   * 将指定位置的元素移至数组栈顶
   * @param array
   * @param index
   * @returns {*}
   */
  moveItemToFirst: (array, index) => {
    var temp = array[index];
    if (index == 0) return array;
    for (var i = 0; i < array.length; i++) {
      if (array[i] === array[index]) {
        array.splice(i, 1);
        break;
      }
    }
    array.unshift(temp);
    return array;
  },

  /**
   * 判断两个数组是否相等
   * @param arr1
   * @param arr2
   * @returns {boolean}
   */
  isEqual: (array1, array2) => {
    if (!(Array.isArray(array1) && Array.isArray(array2))) {
      return false
    }
    if (array1.length !== array2.length) {
      return false
    }
    for (let i = 0; i < array1.length; i++) {
      if (array1[i] !== array2[i]) {
        return false
      }
    }
    return true
  }
}

export { _array }