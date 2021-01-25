import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'fs';

//region HTTP

export const getUrlPath = (url: string): string => {
  const u = new URL(url);
  return u.href.replace(u.origin, ''); // весь url минус origin
}

export const joinUrl = (path: string, baseUrl: string) => {
  if (!baseUrl || path.includes('http://') || path.includes('https://'))
    return path;
  return baseUrl + (path[0] === '/' ? path : `/${path}`);
}

//endregion

//region File sysytem

export const ensureDir = (path: string) => {
  if (!existsSync(path))
    mkdirSync(path)
}

export const readJson = <T>(path: string): T =>
  existsSync(path)
    ? JSON.parse(readFileSync(path, 'utf8'))
    : {}
;

export const writeJson = (obj, path: string) => {
  const json = JSON.stringify(obj, null, 2);
  writeFileSync(path, json, 'utf8');
}

//endregion
