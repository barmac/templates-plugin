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

    for (const [ property, propertyName, descriptor ] of iterator) {
      template = this._handle(template, propertyName, property, descriptor);
    }

    return template;
  }

  registerHandler(handler) {
    this.handlers.add(handler);
  }

  _getDefaultName(bpmnElement) {
    const elementName = bpmnElement.get('name') || 'Element';

    return `${elementName.trim()} Template`;
  }

  _getId() {
    return uuidv4();
  }

  _handle(template, propertyName, property, descriptor) {
    const handler = this._getHandler(descriptor, property);

    return handler.handle(template, propertyName, property, descriptor);
  }

  _getHandler(descriptor, value) {
    for (const handler of this.handlers) {
      if (handler.canHandle(descriptor, value)) {
        return handler;
      }
    }

    return { handle: noopHandler };
  }
}

function noopHandler(template) {
  return template;
}
