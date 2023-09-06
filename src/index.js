import { getAbsoluteFilePath, isNotOriginHostUrl, normalizeFileName } from './utils.js';

import * as cheerio from 'cheerio';

import axios from 'axios';

import fs from 'fs';

import path from 'path';

import debug from 'debug';

import Listr from 'listr';

const pageLoader = (url, output = '') =>{
    const log = debug('page-loader');
    const tags = ['img','link', 'script'];
    const attributes = 
    {
        img: 'src',
        link: 'href',
        script: 'src',
    }
    const resources = [];
    const nUrl = new URL(url);
    const fileName = nUrl.host.split('.').join('-');
    const dirName = fileName + '_files';
    const htmlName = fileName + '.html';
    const absoluteFilePath = getAbsoluteFilePath(htmlName);
    const absoluteDirPath = getAbsoluteFilePath(output, dirName)
    axios.get(url)
    .then((response) => response.data)
    .then((html) =>{         
        // Создаем папку
        fs.mkdir(absoluteDirPath, (err) =>{
            if(err){
                console.error(err);
                return;
            }
        })
        return cheerio.load(html)
    })
    .then(($) => {
            // Функция устанавливает определенные ресурсы
            const downloadResources = (index, element) =>{
                const oldSrc= normalizeFileName($(element).attr(attributes[element.name]));
                if(isNotOriginHostUrl(oldSrc, url) || oldSrc === undefined){
                    return
                }
                const elUrl = new URL(oldSrc, url);
                const extname = oldSrc.match(/(\.\w+)(?=\?|$)/i) || '';
                const elementPath = `${fileName}-${oldSrc.replace(extname[0], '').split(/[?_/]/).join('-')}${extname[0]}`;
                const absoluteElementPath = getAbsoluteFilePath(absoluteDirPath, elementPath);
                const newSrc = path.join(dirName , elementPath)
                        $(element).attr(attributes[element.name], newSrc);
                        resources.push({title: elUrl.href, 
                            task: () => axios.get(elUrl, {responseType: 'stream'})
                            .then((response) => {
                                response.data.pipe(fs.createWriteStream(absoluteElementPath));
                            })
                            .catch((err) => console.error(err))
                        });
            }
            // Проходимся по всем тегам чтобы скачать ресурсы
            tags.forEach((tag) => $(tag).each(downloadResources))
            // Загрузка ресурсов
            const items = new Listr(resources)
            // Начало загрузки
            items.run()
            return $.html() 
        })
        .then((html) => {
            fs.writeFile(absoluteFilePath, html , (err) =>{
                if(err){
                    console.error(err);
                    return
                }
            })
        })
    }
    // https://ru.hexlet.io/courses
    // https://www.brizk.com
    // https://tengrinews.kz
    export default pageLoader;