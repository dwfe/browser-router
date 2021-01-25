import {AutomationEnvironment, Command, ITask} from '@dwfe/automation-environment';
import {TaskIds} from '../task.id';
import {ClickTask} from './01.click.task';

export type TStage = 'init' | 'make-screenshot' | 'test';
const {newPage, closePage, waitForAllDataReceived, wait, screenshot, compareScreenshot} = Command;

export class TaskFactory {

  static getTasks(stage: TStage, env: AutomationEnvironment): ITask[] {
    return TaskIds.reduce((acc, id) => {
      acc.push(TaskFactory.getTask(stage, id, env));
      return acc;
    }, [] as ITask[]);
  }

  static getTask(stage: TStage, id: string, env: AutomationEnvironment): ITask {
    let constructor;
    switch (id) {
      default:
        constructor = ClickTask;
    }
    const task = new constructor(id, env);
    TaskFactory.setupTask(task, stage);
    return task;
  }

  /**
   * Каждая задача через getScript() отдает список своих команд.
   * В зависимости от этапа его может быть необходимо дополнить командами как перед(beforeScript) так и после(afterScript).
   * Причем список команд beforeScript и afterScript в зависимости от этапа повторяется.
   * Также в зависимости от этапа у задачи могут меняться настройки(например, значения полей saveResponses и mockResponses).
   */
  static setupTask(task: ITask, stage: TStage): void {
    if (!task.beforeScript) task.beforeScript = [];
    if (!task.afterScript) task.afterScript = [];
    const {beforeScript, afterScript} = task;

    beforeScript.push(newPage); // каждая задача выполняется на новой странице

    switch (stage) {
      case 'make-screenshot': {
        afterScript.push(...[
          screenshot({save: true}),
        ]);
        break;
      }
      case 'test': {
        task.mockResponses = true;
        afterScript.push(...[
          screenshot(),
          compareScreenshot,
        ]);
        break;
      }
    }
    afterScript.push(closePage);
  }

}
