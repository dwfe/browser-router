import {AbstractTask, AutomationEnvironment, Command, TCommand} from '@dwfe/automation-environment';
import {TaskId} from '../task.id';
import {QaSel} from '../../qa-selector';

const {clickElement, wait} = Command;

export abstract class AbstractClickTask extends AbstractTask {

  constructor(public id: TaskId,
              protected env: AutomationEnvironment) {
    super(id);
  }

  get commands(): TCommand[] {
    return AbstractClickTask.opt.get(this.id);
  }

  async actionsBeforeScreenshot(): Promise<void> {
    await this.page.addStyleTag({
      content: `
        .ActionData {
          display: none;
        }
      `,
    })
  }

  static opt = new Map<TaskId, TCommand[]>([

    [TaskId.PageDoesntExist, [clickElement(QaSel.IndexPage_DoesntExist)]],

    [TaskId.AuthorizationRequired, [clickElement(QaSel.IndexPage_AuthorizationRequired)]],

    [TaskId.CanDeactivate, [
      clickElement(QaSel.IndexPage_CanDeactivate),
      clickElement(QaSel.Header_Index),
    ]],

    [TaskId.External, [
      clickElement(QaSel.IndexPage_External),
      wait(3_000),
    ]],

    [TaskId.FirstPage, [clickElement(QaSel.IndexPage_First)]],

    [TaskId.SecondPage, [clickElement(QaSel.IndexPage_Second)]],

  ]);
}
