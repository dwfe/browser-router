import {Command, TCommand} from '@dwfe/automation-environment';
import {AbstractClickTask} from './abstract-click.task';

const {goto} = Command;

export class ClickTask extends AbstractClickTask {

  getScript = (): TCommand[] => [
    goto('/'),
    ...this.commands,
  ];

}
