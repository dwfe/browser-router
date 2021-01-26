import {afterAll, beforeAll, describe, expect, test} from '@jest/globals';
import {AutomationEnvironment} from '@dwfe/automation-environment';
import {addAttach} from 'jest-html-reporters/helper';
import {TaskFactory} from './task/task.factory';
import {TaskIds} from './task/task.id';
import {Prepare} from './prepare';

jest.setTimeout(30_000); // default timeout for each test

let envList: AutomationEnvironment[] = [];
const envCases = Prepare.envCases(envList);
const testCases = TaskIds.map(id => [id]);

beforeAll(async () => {
  envList.push(...(await new Prepare().getEnvList())); // заполню массив проинициализированными окружениями
});

describe.each(envCases)('%#. %s', getEnv => {  // для каждого окружения
  test.each(testCases)('%#. %s', async id => { // и после каждой проверочной задачи, которая запустится в этом окружении
      const env = getEnv();                    // надо выполнить одни и теже действия
      const task = TaskFactory.getTask('test', id, env);
      env.run([task]);

      const {isEqual, origImg, imgToCompare, diffImg} = await task.compareScreenshotResult();
      if (!isEqual) {
        const {toJpeg} = env.pngUtils;
        await addAttach(toJpeg(diffImg).data, 'diff');
        await addAttach(toJpeg(origImg).data, 'original');
        await addAttach(toJpeg(imgToCompare).data, 'to compare');
      }
      expect(isEqual).toBeTruthy();
    }
  );
});

afterAll(() => {
  envList.forEach(env => env.close());
});
