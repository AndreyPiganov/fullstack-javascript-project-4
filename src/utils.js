import path from 'path';

export const getAbsoluteFilePath = (...filepath) => path.resolve(process.cwd(), ...filepath);
export const isNotOriginHostUrl = (str, originStr) => {
  try {
    const url = new URL(str);
    const originUrl = new URL(originStr);
    return url.host !== originUrl.host || originUrl.pathname !== '//';
  } catch (err) {
    return false;
  }
};
export const normalizeFileName = (fileName) => {
  let name = fileName;
  if (name !== undefined && name.startsWith('/')) {
    name = name.replace('/', '');
  }
  return name;
};
