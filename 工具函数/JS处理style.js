/** Created by guangqiang on 2018-07-02 14:57:01 */

const jointStyle = style => {
  let str = []
  Object.keys(style).forEach(key => {
    str.push(`${key}:${style[key]};`)
  })
  return str.join(';');
}

export {jointStyle}



//匹配字符串增加字体样式
addStyleForString(string, targetString) {
  return string.replace(new RegExp(targetString, 'gm'), '<span style="color: #FF7124;">' + targetString + '</span>'); 
}
