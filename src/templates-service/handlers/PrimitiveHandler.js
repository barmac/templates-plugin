/*
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. Licensed under a commercial license.
 * You may not use this file except in compliance with the commercial license.
 */

export function PrimitiveHandler(service) {

  function handle(template, property, propertyName) {
    return template;
  }

  function canHandle() {
    return false;
  }

  return {
    handle,
    canHandle
  };
}
