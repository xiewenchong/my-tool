/**
 * 预订页表单验证规则，结合库 async-validator使用
 */

export const userName = {
  type: 'string',
  required: true,
  validator: (rule, value) => {
    let length = 0;
    if (!value) return false;

    // 一个中文等于两个字符
    for (let i = 0, len = value.length; i < len; i++) {
      if (value.charCodeAt(i) > 127 || value.charCodeAt(i) === 94) {
        length += 2;
      } else {
        length += 1;
      }
    }
    if (length < 4 || length > 20) return false;
    if (!/^[a-zA-z\u4E00-\u9FA5\s]+$/.test(value)) return false;
    return true;
  },
  message: '联系人姓名格式有误',
};


export const Name = {
  type: 'string',
  required: true,
  validator: (rule, value) => {
    let length = 0;
    if (!value) return false;

    // 一个中文等于两个字符
    for (let i = 0, len = value.length; i < len; i++) {
      if (value.charCodeAt(i) > 127 || value.charCodeAt(i) === 94) {
        length += 2;
      } else {
        length += 1;
      }
    }
    if (length < 4 || length > 20) return false;
    if (!/^[a-zA-z\u4E00-\u9FA5\s]+$/.test(value)) return false;
    return true;
  },
  message: '旅客姓名格式有误',
};

/** 拼音全名 */
export const PYName = {
  type: 'string',
  required: true,
  validator: (rule, value) => {
    const { length } = value || '';
    if (!length || length < 4 || length > 20) return false;
    if (!(/^[^0-9\u4E00-\u9FA5]+$/.test(value))) return false;
    return true;
  },
  message: '旅客拼音姓名格式有误',
};

/** 拼音名 */
export const MingPinYin = {
  type: 'string',
  required: true,
  validator: (rule, value) => {
    const { length } = value || '';
    if (!length || length < 1 || length > 20) return false;
    if (!(/^[^0-9\u4E00-\u9FA5]+$/.test(value))) return false;
    return true;
  },
  message: '旅客拼音/英文名格式有误',
};

/** 拼音姓 */
export const XingPinYin = {
  type: 'string',
  required: true,
  validator: (rule, value) => {
    const { length } = value || '';
    if (!length || length < 1 || length > 20) return false;
    if (!(/^[^0-9\u4E00-\u9FA5]+$/.test(value))) return false;
    return true;
  },
  message: '旅客拼音/英文姓格式有误',
};

export const phone = {
  type: 'string',
  required: true,
  validator: (rule, value) => /^1[0-9]{10}$/.test(value),
  message: '联系人手机号码格式错误',
};

export const TelephoneNum = {
  type: 'string',
  required: true,
  validator: (rule, value) => /^1[0-9]{10}$/.test(value),
  message: '旅客手机号码格式错误',
};

/** 邮箱 */
export const email = {
  type: 'string',
  required: true,
  validator: (rule, value) => {
    // eslint-disable-next-line
    const reg = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
    return reg.test(value);
  },
  message: '请输入正确的邮箱',
};

/** 邮寄地址验证 */
export const receiveAddress = {
  type: 'string',
  required: true,
  message: '邮寄地址输入有误',
  validator: (_rule, value) => {
    let length = 0;

    // 一个中文等于两个字符
    for (let i = 0, len = value.length; i < len; i++) {
      if (value.charCodeAt(i) > 127 || value.charCodeAt(i) === 94) {
        length += 2;
      } else {
        length += 1;
      }
    }

    if (!value) {
      return '邮寄地址不能为空';
    } else if (/^[\S\s]*[\s]+[\S\s]*$/.test(value)) {
      return '邮寄地址不能包含空格';
    } else if (length > 100) {
      return '邮寄地址最多输入100个字符';
    }
    if (!length || length > 100) return false;
    if ((/^[\S\s]*[\s]+[\S\s]*$/.test(value))) return false;
    return true;
  },
};

/** 备注 */
export const remark = {
  type: 'string',
  validator: (rule, value) => value.indexOf('script') === -1,
  message: '备注输入有误',
};

/** 身份证 */
export const ID = {
  type: 'string',
  required: true,
  validator: (rule, value) => {
    if (!value || value.length !== 18 || !(/^[0-9xX]+$/.test(value))) {
      return false;
    }
    return true;
  },
  message: '旅客身份证号格式有误',
};

/** 旅客港澳通行证 */
export const HKMPass = {
  type: 'string',
  required: true,
  validator: (rule, value) => {
    const { length } = value || '';
    if (length < 9 || length > 11 || !(/^[0-9a-zA-Z]+$/.test(value))) {
      return false;
    }
    return true;
  },
  message: '旅客港澳通行证号格式有误',
};

/** 旅客台湾通行证 */
export const TWPass = {
  type: 'string',
  required: true,
  validator: (rule, value) => {
    const { length } = value || '';
    if (length < 8 || length > 11 || !(/^[0-9a-zA-Z]+$/.test(value))) {
      return false;
    }
    return true;
  },
  message: '旅客台湾通行证号格式有误',
};

/** 旅客台胞证号 */
export const MTP = {
  type: 'string',
  required: true,
  validator: (rule, value) => {
    const { length } = value || '';
    if (length < 8 || length > 11 || !(/^[0-9a-zA-Z]+$/.test(value))) {
      return false;
    }
    return true;
  },
  message: '旅客台胞证号格式有误',
};

/** 旅客护照号 */
export const PassPort = {
  type: 'string',
  required: true,
  validator: (rule, value) => {
    const { length } = value || '';
    if (length < 8 || length > 9 || !(/^[0-9a-zA-Z]+$/.test(value))) {
      return false;
    }
    return true;
  },
  message: '旅客护照号格式有误',
};

/** 旅客军官证 */
export const OfficialCard = {
  type: 'string',
  required: true,
  validator: (rule, value) => {
    const { length } = value || '';
    if (length < 4 || length > 20 || !(/^[0-9a-zA-Z]+$/.test(value))) {
      return false;
    }
    return true;
  },
  message: '旅客军官证格式有误',
};

/** 旅客回乡证 */
export const HVP = {
  type: 'string',
  required: true,
  validator: (rule, value) => {
    const { length } = value || '';
    if (length != 11 || !(/^[0-9a-zA-Z]+$/.test(value))) {
      return false;
    }
    return true;
  },
  message: '旅客回乡证证格式有误',
};

/** 旅客信息验证相关 */

/** 从code到描述符 */
export const keyToDescriptor = {
  userName,
  Name,
  PYName,
  XingPinYin,
  MingPinYin,
  email,
  phone,
  TelephoneNum,
  receiveAddress,
  remark,
  ID,
  HKMPass,
  MTP,
  PassPort,
  TWPass,
  OfficialCard,
  HVP
};

/**
 * 获取旅客的单个表单信息项的验证descriptoer
 * 出行人信息除了证件号以外都是必填的
 * @param {Object} travellerInfoItem
 */
export function getTravellerItemRule(travellerInfoItem) {
  //console.log(travellerInfoItem);
  const { travellerInfoCode } = travellerInfoItem;
  const fields = {};
  const descriptor = {
    type: 'object',
    fields,
  };
  let key = travellerInfoCode;
  fields.travellerValue = { ...keyToDescriptor[key] };
  return descriptor;
}


/**
 * 获取单个旅客的验证信息
 * 出行人信息除了证件号以外都是必填的
 * @param {Array} travellerItem
 */
export function getTravellerRule(travellerItem) {
  /** key-索引 value-对应元素的规则 */
  const { travellerList } = travellerItem;
  const fields = {
    travellerId: {
      required: true,
      type: 'number',
    },
    travellerList: {
      type: 'array',
      fields: {},
    },
  };
  const { length } = travellerList;
  const descriptor = {
    type: 'object',
    fields,
  };
  for (let i = 0; i < length; i++) {
    fields.travellerList.fields[i] = getTravellerItemRule(travellerList[i]);
  }
  return descriptor;
}

/**
 * 根据旅客信息列表生成规则
 * @param {Array} travellerInfoList 旅客信息列表
 */
export function getTravellerListRules(travellerInfoList) {
  /** key-索引 value-对应元素的规则 */
  const fields = {};
  const { length } = travellerInfoList;
  const descriptor = {
    type: 'array',
    required: true,
    fields,
    length,
  };
  for (let i = 0; i < length; i++) {
    fields[i] = getTravellerRule(travellerInfoList[i]);
  }
  return descriptor;
}
