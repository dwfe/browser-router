export enum TaskId {

  MultiClickSameLinkThenGoBack = '001_01-Multi-Click-Same-Link-Then-Go-Back',
  GoForward = '001_02-Go-Forward',

  PageDoesntExist = '002_01-Page-Doesnt-Exist',
  PageDoesntExistGoBack = '002_02-Page-Doesnt-Exist-Go-Back',

  AuthorizationRequired = '003_01-Authorization-Required',
  ProtectedByAuthorization = '003_02-Protected-By-Authorization',
  LogOut = '003_03-Log-Out',

  CanDeactivateToIndex = '004_01-Can-Deactivate-To-Index',
  CanDeactivateCancelToFirst = '004_02-Can-Deactivate-Cancel-To-First',
  CanDeactivateYesToSecond = '004_03-Can-Deactivate-Yes-To-Second',

  External = '005_01-External',

  FirstPage = '006_01-First-Page',

  SecondPage = '007_01-Second-Page',
}

/**
 * ЕСЛИ требуется выполнить не все задачи, а выборочно
 * ТОГДА переопредели TaskIds своим списком
 */
// export const TaskIds: TaskId[] = [
//
// ];
export const TaskIds: TaskId[] = Object.values(TaskId);
