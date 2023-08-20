import path from 'path';

export const getAbsoluteFilePath = (filepath) => path.resolve(process.cwd(), filepath);