/*
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. Licensed under a commercial license.
 * You may not use this file except in compliance with the commercial license.
 */

import { v4 as uuidv4 } from 'uuid';

import handlers from './handlers';

import BpmnElementIterator from './BpmnElementIterator';


export class TemplateService {

  constructor() {
    this.handlers = new Set();

    for (const handler of handlers) {
      handler(this);
    }
  }

  generateTemplate(bpmnElement) {

    // todo: fill the template
    let template = {
      name: this._getDefaultName(bpmnElement),
      id: this._getId(),
      appliesTo: [
        bpmnElement['$type']
      ],
      properties: []
    };
    const iterator = BpmnElementIterator(bpmnElement);

    for (const [ property, propertyName ] of iterator) {
      template = this._handle(property, propertyName, template);
    }

    return template;
  }

  registerHandler(handler) {
    this.handler.add(handler);
  }

  _getDefaultName(bpmnElement) {
    const elementName = bpmnElement.get('name') || 'Element';

    return `${elementName.trim()} Template`;
  }

  _getId() {
    return uuidv4();
  }

  _handle(property, propertyName, template) {
    const handler = this._getHandler(property);

    return handler.handle(template, propertyName, property);
  }

  _getHandler(property) {
    for (const handler of this.handlers) {
      if (handler.canHandle(property)) {
        return handler;
      }
    }

    return { handle: noopHandler };
  }
}

function noopHandler(template) {
  return template;
}
