export enum TaskId {
  PageDoesntExist = 'Page-Doesnt-Exist',
  AuthorizationRequired = 'Authorization-Required',
  CanDeactivate = 'Can-Deactivate',
  External = 'External',
  FirstPage = 'First-Page',
  SecondPage = 'Second-Page',
}

/**
 * ЕСЛИ требуется выполнить не все задачи, а выборочно
 * ТОГДА переопредели TaskIds своим списком
 */
// export const TaskIds: TaskId[] = [
//
// ];
export const TaskIds: TaskId[] = Object.values(TaskId);
