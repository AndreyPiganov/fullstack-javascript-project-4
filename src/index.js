import fs from 'fs/promises';
import path from 'path';
import * as cheerio from 'cheerio';

import axios from 'axios';

import debug from 'debug';

import Listr from 'listr';

import { getAbsoluteFilePath, isNotOriginHostUrl, normalizeFileName } from './utils.js';

const pageLoader = (inputUrl, output = '') => {
  const log = debug('page-loader');
  const tags = ['img', 'link', 'script'];
  const attributes = {
    img: 'src',
    link: 'href',
    script: 'src',
  };
  const filesLinks = {};
  let url;
  try{
    url = new URL(inputUrl)
  }catch(err){
    return Promise.reject(err);
  }
  const outputDirPath = getAbsoluteFilePath(output)
  const fileName = url.host.split('.').join('-') + url.pathname.split('/').join('-')
  const originFileName = url.host.split('.').join('-'); 
  const dirName = `${fileName}_files`;
  const htmlName = `${fileName}.html`;
  const absoluteFilePath = getAbsoluteFilePath(output,htmlName);
  const absoluteDirPath = getAbsoluteFilePath(output, dirName);
  return fs.access(outputDirPath)
  .then(() => axios.get(url))
  .then((response) => cheerio.load(response.data))
  .then(($) => {
      // Функция устанавливает определенные ресурсы
      const downloadResources = (index, element) => {
        const oldSrc = normalizeFileName($(element).attr(attributes[element.name]), url);
        if (isNotOriginHostUrl(oldSrc, url) || oldSrc === undefined) {
          return 
        }
          const elUrl = new URL(oldSrc,url.origin);
          const extname = oldSrc.match(/(\.\w+)(?=\?|$)/i) || '';
          const elementPath = `${originFileName}-${oldSrc.replace(extname[0], '').split(/[?_/]/).join('-')}${extname[0]}`;
          const absoluteElementPath = getAbsoluteFilePath(absoluteDirPath, elementPath);
          const newSrc = path.join(dirName, elementPath);
          $(element).attr(attributes[element.name], newSrc);
          filesLinks[elUrl.href] = absoluteElementPath
          log(`Source handled: ${oldSrc}`);
      };
      // Проходимся по всем тегам чтобы скачать ресурсы
      tags.forEach((tag) => $(tag).each(downloadResources));
      log(url);
      log(fileName)
      log(absoluteFilePath);
      return fs.writeFile(absoluteFilePath, $.html())
    })
    .then(() => {
      fs.mkdir(absoluteDirPath, (err) =>{
        if(err){
          console.error(err)
        }
      })
    })
    .then(() =>{
    const resources = Object.keys(filesLinks).map((link) =>(      
      {
      title: link,
      task: () => axios.get(link, { responseType: 'arraybuffer' })
        .then((response) => {
          fs.writeFile(filesLinks[response.config.url], response.data, 'binary')
      })
    }
    ))
    log(resources)
    const tasks = new Listr(resources, {concurrent: true});
    return tasks.run();
  })
    .then(() => htmlName)
};
// https://ru.hexlet.io/courses
// https://www.brizk.com
// https://tengrinews.kz
export default pageLoader;
