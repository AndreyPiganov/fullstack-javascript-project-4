import fs from 'fs/promises';
import path from 'path';
import * as cheerio from 'cheerio';

import axios from 'axios';

import debug from 'debug';

import Listr from 'listr';

import {
  getAbsoluteFilePath, isNotOriginHostUrl, removeFirstSlash, normalizeFileName, isEndWithHyphen,
} from './utils.js';

const pageLoader = async (inputUrl, output = '') => {
  const log = debug('page-loader');
  const tags = ['img', 'link', 'script'];
  const attributes = {
    img: 'src',
    link: 'href',
    script: 'src',
  };
  const filesLinks = {};
  const url = new URL(inputUrl);
  const outputDirPath = getAbsoluteFilePath(output);
  const fileName = isEndWithHyphen(url.host.split('.').join('-') + url.pathname.split('/').join('-'));
  const dirName = `${fileName}_files`;
  const htmlName = `${fileName}.html`;
  const absoluteFilePath = getAbsoluteFilePath(output, htmlName);
  const dirPath = getAbsoluteFilePath(output, dirName);
  return fs.access(outputDirPath)
    .then(() => axios.get(url))
    .then((response) => cheerio.load(response.data))
    .then(($) => {
      // Функция устанавливает определенные ресурсы
      const downloadResources = (index, element) => {
        const oldSrc = removeFirstSlash($(element).attr(attributes[element.name]));
        if (isNotOriginHostUrl(oldSrc, url) || oldSrc === undefined) {
          return;
        }
        const elUrl = new URL(oldSrc, url.origin);
        const elementPath = normalizeFileName(elUrl, url);
        const absoluteElementPath = getAbsoluteFilePath(dirPath, elementPath);
        const newSrc = path.join(dirName, elementPath);
        $(element).attr(attributes[element.name], newSrc);
        filesLinks[elUrl.href] = absoluteElementPath;
        log(`Source handled: ${oldSrc}`);
      };
      // Проходимся по всем тегам чтобы скачать ресурсы
      tags.forEach((tag) => $(tag).each(downloadResources));
      return fs.writeFile(absoluteFilePath, $.html());
    })
    .then(() => (Object.keys(filesLinks).length > 0 ? fs.mkdir(dirPath) : Promise.resolve({})))
    .then(() => {
      const resources = Object.keys(filesLinks).map((link) => (
        {
          title: link,
          task: () => axios.get(link, { responseType: 'arraybuffer' })
            .then((response) => fs.writeFile(filesLinks[response.config.url], response.data, 'binary')),
        }
      ));
      const tasks = new Listr(resources, { concurrent: true });
      return tasks.run();
    })
    .then(() => absoluteFilePath);
};

export default pageLoader;
