import {AbstractTask, AutomationEnvironment, Command, TCommand} from '@dwfe/automation-environment';
import {QaSel} from './qa-selector';
import {TaskId} from './task.id';

const {click, wait, fill} = Command;

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

    [TaskId.MultiClickSameLinkThenGoBack, [
      click({selector: QaSel.IndexPage_DoesntExist}),
      click({selector: QaSel.Header_Index}),
      click({selector: QaSel.Header_Index, options: {delay: 300}}),
      click({selector: QaSel.Header_Index, options: {delay: 300}}),
      click({selector: QaSel.Header_Index, options: {delay: 300}}),
      click({selector: QaSel.Header_Index, options: {delay: 300}}),
      click({selector: QaSel.Header_GoBack}),
    ]], // => not found page

    [TaskId.GoForward, [
      click({selector: QaSel.IndexPage_DoesntExist}),
      click({selector: QaSel.Header_GoBack}),
      click({selector: QaSel.Header_GoForward}),
    ]], // => not found page

    [TaskId.NotFoundPage, [
      click({selector: QaSel.IndexPage_DoesntExist})
    ]], // => not found page
    [TaskId.NotFoundPageGoBack, [
      click({selector: QaSel.IndexPage_DoesntExist}),
      click({selector: QaSel.Header_GoBack}),
    ]], // => index page

    [TaskId.AuthorizationRequired, [
      click({selector: QaSel.IndexPage_AuthorizationRequired})
    ]], // => login page
    [TaskId.AuthorizationRequiredGoBack, [
      click({selector: QaSel.IndexPage_AuthorizationRequired}),
      click({selector: QaSel.Header_GoBack}),
    ]], // => index page
    [TaskId.ProtectedByAuthorization, [
      click({selector: QaSel.IndexPage_AuthorizationRequired}),
      fill({selector: QaSel.LoginPage_Username, value: '1'}),
      fill({selector: QaSel.LoginPage_Password, value: '2'}),
      click({selector: QaSel.LoginPage_LogIn}),
    ]], // => protected by authorization page
    [TaskId.LogOut, [
      click({selector: QaSel.IndexPage_AuthorizationRequired}),
      click({selector: QaSel.LoginPage_LogOut}),
    ]], // => index page

    [TaskId.CanDeactivateToIndex, [
      click({selector: QaSel.IndexPage_CanDeactivate}),
      click({selector: QaSel.Header_Index}),
    ]], // => dialog 'Yes' 'Cancel'
    [TaskId.CanDeactivateCancelToFirst, [
      click({selector: QaSel.IndexPage_CanDeactivate}),
      click({selector: QaSel.CanDeactivatePage_First}),
      click({selector: QaSel.CanDeactivatePage_DialogueCancel}),
      click({selector: QaSel.CanDeactivatePage_First}),
      click({selector: QaSel.CanDeactivatePage_DialogueCancel}),
      click({selector: QaSel.CanDeactivatePage_First}),
      click({selector: QaSel.CanDeactivatePage_DialogueCancel}),
    ]], // => can deactivate page
    [TaskId.CanDeactivateYesToSecond, [
      click({selector: QaSel.IndexPage_CanDeactivate}),
      click({selector: QaSel.CanDeactivatePage_First}),
      click({selector: QaSel.CanDeactivatePage_DialogueCancel}),
      click({selector: QaSel.CanDeactivatePage_First}),
      click({selector: QaSel.CanDeactivatePage_DialogueCancel}),
      click({selector: QaSel.CanDeactivatePage_First}),
      click({selector: QaSel.CanDeactivatePage_DialogueCancel}),
      click({selector: QaSel.CanDeactivatePage_Second}),
      click({selector: QaSel.CanDeactivatePage_DialogueYes}),
    ]], // => second page

    [TaskId.External, [
      click({selector: QaSel.IndexPage_External}),
      wait(3_000),
    ]], // => external page

    [TaskId.FirstPage, [
      click({selector: QaSel.IndexPage_First})
    ]],  // => first page
    [TaskId.FirstNotFoundPage, [
      click({selector: QaSel.IndexPage_First}),
      click({selector: QaSel.FirstPage_DoesntExist})
    ]],  // => first not found page


    [TaskId.SecondPage, [
      click({selector: QaSel.IndexPage_Second})
    ]], // => second page
    [TaskId.SecondPicturePage, [
      click({selector: QaSel.IndexPage_Second}),
      click({selector: QaSel.SecondPage_Picture})
    ]], // => second picture page

    [TaskId.CancelTransition, [
      click({selector: QaSel.IndexPage_Second}),
      click({selector: QaSel.SecondPage_LongTimeGettingOfActionResult}),
      wait(500),
      click({selector: QaSel.Header_Index}),
      wait(10_000),
    ]], // => index page

    [TaskId.PreventDuplicates, [
      click({selector: QaSel.IndexPage_Second}),
      click({selector: QaSel.SecondPage_LongTimeGettingOfActionResult, options: {delay: 100}}),
      wait(100),
      click({selector: QaSel.SecondPage_LongTimeGettingOfActionResult, options: {delay: 100}}),
      wait(100),
      click({selector: QaSel.SecondPage_LongTimeGettingOfActionResult, options: {delay: 100}}),
      wait(100),
      click({selector: QaSel.SecondPage_LongTimeGettingOfActionResult, options: {delay: 100}}),
      wait(100),
      click({selector: QaSel.SecondPage_LongTimeGettingOfActionResult, options: {delay: 100}}),
      wait(100),
      click({selector: QaSel.SecondPage_LongTimeGettingOfActionResult, options: {delay: 100}}),
      wait(100),
      click({selector: QaSel.Header_Index}),
      wait(10_000),
      click({selector: QaSel.Header_GoBack}),
      wait(100),
      click({selector: QaSel.Header_GoBack}),
    ]], // => second page


  ]);
}
