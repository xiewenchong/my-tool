export function decimalFilter(val) {
  const _val = +val;
  if (Object.is(_val, NaN)) return '--';
  return _val.toFixed(2).split('.')[1];
}

export function intFilter(val) {
  const _val = +val;
  if (Object.is(_val, NaN)) return '--';
  return `${_val.toFixed(2).split('.')[0]}.`;
}

export function toFixedTwoFilter(val, isHidden) {
  if (!isHidden) {
    const _val = +val;
    if (Object.is(_val, NaN)) return '----';
    return _val.toFixed(2);
  } else {
    return "****";
  }
}

//为图片链接地址补充默认域名https://cdn2.jinxidao.com/
export function addImageDomainNameFilter(val, imageView2) {
  if (typeof val == "string" && val.search(".jinxidao.com") == -1) {
    return "https://cdn2.jinxidao.com/" + val.replace(/^\//, "") + (imageView2 || "");
  } else {
    return val + (imageView2 || "");
  }
}

export const rule = {
  name: function (value) { // 旅客姓名
    let length = 0;

    value = value.trim()

    if (!value) {
      return '旅客姓名不能为空';
    }

    //一个中文等于两个字符
    for (let i = 0, len = value.length; i < len; i++) {
      if (value.charCodeAt(i) > 127 || value.charCodeAt(i) == 94) {
        length += 2;
      } else {
        length++;
      }
    }

    if (length < 4) {
      return '旅客姓名最少输入4个字符';
    } else if (length > 20) {
      return '旅客姓名最多输入20个字符';
    } else if (!/^[a-zA-Z\u4E00-\u9FA5]+$/.test(value)) {
      return '旅客姓名只支持中英文';
    }
    return '';
  },
  pyname: function (value) { // 旅客姓名拼音
    value = value.trim();

    let length = value.length;

    if (!value) {
      return '旅客姓名拼音不能为空';
    } else if (!/^[^0-9\u4E00-\u9FA5]+$/.test(value)) {
      return '旅客姓名拼音仅支持英文字母、特殊字符、空格';
    } else if (length < 4) {
      return '旅客姓名拼音最少输入4个字符';
    } else if (length > 20) {
      return '旅客姓名拼音最多输入20个字符';
    }
    return '';
  },
  xingpinyin: function (value) { // 姓拼音
    value = value.trim()
    let length = value.length;

    if (!value) {
      return '旅客姓拼音不能为空';
    } else if (!/^[^0-9\u4E00-\u9FA5]+$/.test(value)) {
      return '旅客姓拼音仅支持英文字母、特殊字符、空格';
    }
    return '';
  },
  mingpinyin: function (value) { // 姓拼音
    value = value.trim()
    let length = value.length;

    if (!value) {
      return '旅客名拼音不能为空';
    } else if (!/^[^0-9\u4E00-\u9FA5]+$/.test(value)) {
      return '旅客名拼音仅支持英文字母、特殊字符、空格';
    }
    return '';
  },
  id: function (value) { // 旅客身份证号
    value = value.trim()
    let length = value.length;

    if (!value) {
      return '旅客身份证号不能为空';
    } else if (!/^[0-9xX]+$/.test(value)) {
      return '旅客身份证号格式错误';
    } else if (length != 18) {
      return '旅客身份证号长度不正确';
    }
    return '';
  },
  hkmpass: function (value) { // 旅客港澳通行证
    value = value.trim()
    let length = value.length;

    if (!value) {
      return '旅客港澳通行证不能为空';
    } else if (!/^[0-9a-zA-Z]+$/.test(value)) {
      return '旅客港澳通行证格式错误';
    } else if (length < 9) {
      return '旅客港澳通行证最少输入9个字符';
    } else if (length > 11) {
      return '旅客港澳通行证最多输入11个字符';
    }
    return '';
  },
  twpass: function (value) { // 旅客台湾通行证
    value = value.trim()
    let length = value.length;

    if (!value) {
      return '旅客台湾通行证不能为空';
    } else if (!/^[0-9a-zA-Z]+$/.test(value)) {
      return '旅客台湾通行证格式错误';
    } else if (length < 9) {
      return '旅客台湾通行证最少输入9个字符';
    } else if (length > 11) {
      return '旅客台湾通行证最多输入11个字符';
    }
    return '';
  },
  mtp: function (value) { // 旅客台胞证号
    value = value.trim();
    let length = value.length;

    if (!value) {
      return '旅客台胞证号不能为空';
    } else if (!/^[0-9a-zA-Z]+$/.test(value)) {
      return '旅客台胞证号格式错误';
    } else if (length < 9) {
      return '旅客台胞证号最少输入9个字符';
    } else if (length > 11) {
      return '旅客台胞证号最多输入11个字符';
    }
    return '';
  },
  passport: function (value) { // 旅客护照号
    value = value.trim()
    let length = value.length;

    if (!value) {
      return '旅客护照号不能为空';
    } else if (!/^[0-9a-zA-Z]+$/.test(value)) {
      return '旅客护照号格式错误';
    } else if (length < 8) {
      return '旅客护照号最少输入8个字符';
    } else if (length > 9) {
      return '旅客护照号最多输入9个字符';
    }
    return '';
  },
  officialcard: function (value) { // 军官证号
    value = value.trim()
    let length = value.length;

    if (!value) {
      return '旅客军官号不能为空';
    } else if (!/^[0-9a-zA-Z]+$/.test(value)) {
      return '旅客军官号格式错误';
    } else if (length < 4) {
      return '旅客军官号最少输入4个字符';
    } else if (length > 20) {
      return '旅客军官号最多输入20个字符';
    }
    return '';
  },
  telephonenum: function (value) { // 旅客手机号码
    value = value.trim();
    if (!value) {
      return '旅客手机号码不能为空';
    } else if (!/^1[0-9]{10}$/.test(value)) {
      return '旅客手机号码格式错误';
    }
    return '';
  }
}
