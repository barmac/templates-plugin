/*
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. Licensed under a commercial license.
 * You may not use this file except in compliance with the commercial license.
 */

import { v4 as uuidv4 } from 'uuid';

import handlers from './handlers';

import ElementPropertiesIterator from './ElementPropertiesIterator';


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


    const iterator = ElementPropertiesIterator(bpmnElement);

    for (const [ property, propertyName, descriptor ] of iterator) {
      this._handle(template, propertyName, property, descriptor);
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
    for (const handler of this.handlers) {
      handler.handle(template, propertyName, property, descriptor);
    }
  }
}
