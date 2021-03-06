import {Command, TCommand} from '@do-while-for-each/node-utils';
import {AbstractClickTask} from './abstract-click.task';

const {goto} = Command;

export class ClickTask extends AbstractClickTask {

  getScript = (): TCommand[] => [
    goto('/'),
    ...this.commands,
  ];

}
