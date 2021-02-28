import {Command, TCommand} from '@dwfe/utils-node';
import {AbstractClickTask} from './abstract-click.task';

const {goto} = Command;

export class ClickTask extends AbstractClickTask {

  getScript = (): TCommand[] => [
    goto('/'),
    ...this.commands,
  ];

}
