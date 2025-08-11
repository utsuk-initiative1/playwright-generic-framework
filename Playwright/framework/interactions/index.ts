// Interactions Module - Main Export File
export { Accessibility } from './Accessibility';
export { BrowserActions } from './BrowserActions';
export { Click } from './Click';
export { Dropdown } from './Dropdown';
export { Elements } from './Elements';
export { Scroll } from './Scroll';
export { Type } from './Type';
export { Wait } from './Wait';
export { WindowHandler } from './WindowHandler';

import { Page, Browser, BrowserContext } from '@playwright/test';
import { Accessibility } from './Accessibility';
import { BrowserActions } from './BrowserActions';
import { Click } from './Click';
import { Dropdown } from './Dropdown';
import { Elements } from './Elements';
import { Scroll } from './Scroll';
import { Type } from './Type';
import { Wait } from './Wait';
import { WindowHandler } from './WindowHandler';

export class InteractionManager {
  public accessibility: Accessibility;
  public browserActions: BrowserActions;
  public click: Click;
  public dropdown: Dropdown;
  public elements: Elements;
  public scroll: Scroll;
  public type: Type;
  public wait: Wait;
  public windowHandler: WindowHandler;

  constructor(page: Page, browser?: Browser, context?: BrowserContext) {
    this.accessibility = new Accessibility(page);
    this.browserActions = new BrowserActions(page, browser, context);
    this.click = new Click(page);
    this.dropdown = new Dropdown(page);
    this.elements = new Elements(page);
    this.scroll = new Scroll(page);
    this.type = new Type(page);
    this.wait = new Wait(page);
    this.windowHandler = new WindowHandler(page, browser, context);
  }

  static create(page: Page, browser?: Browser, context?: BrowserContext): InteractionManager {
    return new InteractionManager(page, browser, context);
  }
}

export default InteractionManager;
