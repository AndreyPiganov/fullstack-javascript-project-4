 import { fileURLToPath } from 'url';

 import pageLoader from '../src/index.js';

 import path from 'path';

 import {getAbsoluteFilePath, isNotOriginHostUrl, isEndWithHyphen, normalizeFileName, removeFirstSlash} from '../src/utils.js';

 import fs from 'fs/promises';
 import nock from 'nock';

 const __filename = fileURLToPath(import.meta.url);
 const __dirname = path.dirname(__filename);
 const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
 const rootDir = process.cwd();
 const url = 'https://ru.hexlet.io/courses/';
 const filesDir = 'ru-hexlet-io-courses_files';
 const expectOriginUrl = 'ru-hexlet-io-courses'
 const expectedScriptName = 'ru-hexlet-io-courses-runtime.js';
 const expectedImageName = 'ru-hexlet-io-courses-nodejs.png';
 const expectedHtmlName = 'ru-hexlet-io-courses.html';
 const expectedStylesName = 'ru-hexlet-io-courses-application.css';
 const expectedAbsoluteFilePath = ''


 nock.disableNetConnect();
 let responseHtml;
 let expectedHtml;
 let expectedImage;
 let expectedStyle;
 let expectedScript;

 beforeAll(async () => {
  responseHtml = await fs.readFile(getFixturePath('before.html'), 'utf8');
  expectedHtml = await fs.readFile(getFixturePath('after.html'), 'utf-8');
  expectedImage = await fs.readFile(getFixturePath('nodejs.png'));
  expectedStyle = await fs.readFile(getFixturePath('application.css'));
  expectedScript = await fs.readFile(getFixturePath('runtime.js'));
});

test('pageLoader', async () => {
  nock(/ru\.hexlet\.io/).persist().get(/courses/).reply(200, responseHtml);
  nock(/ru\.hexlet\.io/).get('/assets/professions/nodejs.png').replyWithFile(200, getFixturePath('nodejs.png'));
  nock(/ru\.hexlet\.io/).get('/assets/application.css').replyWithFile(200, getFixturePath('application.css'));
  nock(/ru\.hexlet\.io/).get('/packs/js/runtime.js').replyWithFile(200, getFixturePath('runtime.js'));
})

describe('Functions', () =>{
  test('getFixturePath', () =>{
    expect(getAbsoluteFilePath('__fixtures__')).toEqual('C:\\Users\\андрей\\Hexlet-projects\\fullstack-javascript-project-4\\__fixtures__');
    expect(getAbsoluteFilePath('__fixtures__', 'after.html')).toEqual('C:\\Users\\андрей\\Hexlet-projects\\fullstack-javascript-project-4\\__fixtures__\\after.html');
  })
  test('isNotOriginHostUrl', () =>{
    expect(isNotOriginHostUrl('https://www.brizk.com/courses/assets', 'https://www.brizk.com')).toBeFalsy();
    expect(isNotOriginHostUrl('https://www.brizk.ru/courses/assets/screen.css', 'https://www.brizk.com')).toBeTruthy();
    expect(isNotOriginHostUrl('/courses/assets', 'https://www.brizk.com')).toBeFalsy();
  })
  test('isEndWithHyphen', () =>{
    expect(isEndWithHyphen(expectOriginUrl + '-')).toEqual('ru-hexlet-io-courses');
    expect(isEndWithHyphen(expectOriginUrl)).toEqual('ru-hexlet-io-courses')
  })
  test('normalizeFileName', () => {
    expect(normalizeFileName(new URL('https://www.brizk.com/portrait.jpg'),new URL('https://www.brizk.com'))).toEqual('www-brizk-com-portrait.jpg');
    expect(normalizeFileName(new URL('https://www.brizk.com/'),new URL('https://www.brizk.com'))).toEqual('www-brizk-com-.html')
  })
  test('removeFirstSlash', () =>{
    expect(removeFirstSlash('/portrait.jpg')).toEqual('portrait.jpg')
    expect(undefined).toBeUndefined();
  })
})

