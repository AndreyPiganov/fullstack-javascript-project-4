### pageLoader - Загрузчик страниц

pageLoader - это инструмент командной строки, который позволяет загружать веб-страницы и сохранять их на вашем локальном компьютере. Это полезно, например, для сохранения копии веб-страницы для оффлайн просмотра или архивирования.

## Установка

Для установки pageLoader, выполните следующие команды:

Для начала склонируйте проект в своё локальное окружение, далее:

# 1
```bash
npm ci 
```

# Чтобы загрузить веб-страницу с помощью pageLoader, выполните следующую команду:

```bash
page-loader <directory> <URL> 
```
### Опции

- `-o, --output <директория>`: Указывает директорию, в которой следует сохранить загруженную страницу (по умолчанию текущая директория).

- `-h, --help`: Выводит справку по использованию pageLoader.

Примеры использования:

[![asciicast](https://asciinema.org/a/BeeiZ6lH9Mm9vjd478TAjbLFr.svg)](https://asciinema.org/a/BeeiZ6lH9Mm9vjd478TAjbLFr)
### Hexlet tests and linter status, codeclimate tests:
[![Actions Status](https://github.com/AndreyPiganov/fullstack-javascript-project-4/workflows/hexlet-check/badge.svg)](https://github.com/AndreyPiganov/fullstack-javascript-project-4/actions)
[![Maintainability](https://api.codeclimate.com/v1/badges/5f2f5d99127978f39209/maintainability)](https://codeclimate.com/github/AndreyPiganov/fullstack-javascript-project-4/maintainability)
[![Node CI](https://github.com/AndreyPiganov/fullstack-javascript-project-4/actions/workflows/node.js.yml/badge.svg)](https://github.com/AndreyPiganov/fullstack-javascript-project-4/actions/workflows/node.js.yml)

### Test-coverage:
[![Test Coverage](https://api.codeclimate.com/v1/badges/5f2f5d99127978f39209/test_coverage)](https://codeclimate.com/github/AndreyPiganov/fullstack-javascript-project-4/test_coverage)