import path from 'path';

export const getAbsoluteFilePath = (...filepath) => path.resolve(process.cwd(), ...filepath);
export const isNotOriginHostUrl = (str, originStr) => {
  try {
    const url = new URL(str);
    const originUrl = new URL(originStr);
    return url.host !== originUrl.host || url.pathname === '//';
  } catch (err) {
    return false;
  }
};
export const removeFirstSlash = (fileName) => {
  let name = fileName;
  if (name !== undefined && name.startsWith('/')) {
    name = name.replace('/', '');
  }
  return name;
};
export const normalizeFileName = (url, originUrl) =>{
  const originFileName = originUrl.host.split('.').join('-');
  const pathData = path.parse(url.pathname);
  const extname = pathData.ext.split('?')[0] === '' ? '.html' : pathData.ext.split('?')[0];
  const result = `${originFileName}${(url.pathname + url.search).replace(extname, '').split(/[?_/]/).join('-')}${extname}`;
  return result;
}
export const isEndWithHyphen = (fileName) =>{
  let name = fileName
  if(name.endsWith('-')){
    name = name.slice(0, -1);
  }
  return name;
}