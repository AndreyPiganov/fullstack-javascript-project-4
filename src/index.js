import { getAbsoluteFilePath } from '../libs/utils.js';

import cheerio from 'cheerio';

import axios from 'axios';

import fs from 'fs';

const pageLoader = (url) =>{
    axios.get(url)
    .then((response) => {
        const nUrl = new URL(url);
        const hostName = nUrl.hostname;
        const pathName = nUrl.pathname;
        const pathFile = hostName.split('.').join('-') + pathName.split('/').join('-');
        const absoluteFilePath = getAbsoluteFilePath(pathFile + '.html');
        fs.writeFile(absoluteFilePath, response.data, (err) =>{
            if(err){
                console.error(err);
                return
            }
        })
        fs.mkdir(getAbsoluteFilePath(pathFile + '_files'), (err) =>{
            if(err){
                console.error(err);
                return;
            }
        })
        return response.data;
    })
    .catch((err) => console.error(err))
    .then((data) => {
        const html = data;
        const $ = cheerio.load(html);
    })
}

console.log(pageLoader('https://ru.hexlet.io/courses'));
export default pageLoader;