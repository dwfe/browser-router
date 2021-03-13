import {AutomationEnvironment, IAutomationEnvironmentOptions} from '@do-while-for-each/node-utils';
import {chromium800x600} from './env/chromium800x600.env';
import {webkit800x600} from './env/webkit800x600.env';
import {TaskFactory} from './task/task.factory';

export class Prepare {

  static envArgs: [IAutomationEnvironmentOptions, string][] = [
    [chromium800x600, 'regress-browser-router, chromium800x600'],
    [webkit800x600, 'regress-browser-router, webkit800x600'],
    // [firefox800x600, 'regress-browser-router, firefox800x600'],
  ];

  async getEnvList(): Promise<AutomationEnvironment[]> {
    return Promise.all( // создать окружения
      Prepare.envArgs.map(([options, id]) => AutomationEnvironment.of(options, id))
    );
  }

  // перед тестом на регресс надо подготовить оригиналы respons'ов/скриншотов
  async run() {
    const envList = await this.getEnvList();
    for (let i = 0; i < envList.length; i++) {
      const env = envList[i];
      await env.run([
        ...TaskFactory.getTasks('make-screenshot', env),
      ])
    }
    envList.forEach(env => env.close());
  }

  /**
   * Передача параметров в describe.each происходит синхронно и туда надо сразу же передать все учавствующие в тестировании окружения.
   * Но заполнение списка окружений - envList - происходит асинхронно в beforeAll.
   * А так как на момент инициализации теста envList пуст, то получение экземпляра окружения делаю через функцию,
   * ведь изначально известно какие окружения и в каком порядке будут участвовать в тестировании.
   */
  static envCases = (envList: AutomationEnvironment[]): (() => AutomationEnvironment)[] =>
    Prepare.envArgs.map(([options, id], i) => {
      const getEnv = () => envList[i];
      getEnv.toString = () => id; // чтобы конкретный describe при печати выводился как id окружения
      return getEnv;
    })
  ;

}
