import path from 'path';

import Listr from 'listr';

export const getAbsoluteFilePath = (...filepath) => path.resolve(process.cwd(), ...filepath);
export const isNotOriginHostUrl = (str, originStr) => {
    try{
    const url = new URL(str);
    const originUrl = new URL(originStr);
    return url.host !== originUrl.host || originUrl.pathname !== '//'
}catch(err){
    return false;
}
}
export const normalizeFileName = (fileName) =>{
    let name = fileName;
    if(name !== undefined && name.startsWith('/')){
        name = name.replace('/', '');
    }
    return name; 
}

/*const tasks = new Listr([
    {
      title: 'Задача 1',
      task: () => {
        console.log('hello world');
      },
    },
    {
      title: 'Задача 2',
      task: () => {
        console.log('hello')
      },
    },
  ]);
  
  tasks.run()
    .then(() => {
      console.log('Все задачи выполнены успешно');
    })
    .catch((error) => {
      console.error('Произошла ошибка', error);
    });*/
