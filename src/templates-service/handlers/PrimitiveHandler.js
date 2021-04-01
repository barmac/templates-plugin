/*
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. Licensed under a commercial license.
 * You may not use this file except in compliance with the commercial license.
 */

export function PrimitiveHandler(service) {

  function handle(template, propertyName, value, descriptor) {
    if (value === '' || value === descriptor.default) {
      return template;
    }

    template.properties.push({
      label: propertyName,
      type: descriptor.type,
      value: value,
      binding: {
        type: 'property',
        name: propertyName
      }
    });

    return template;
  }

  function canHandle(descriptor, value) {
    return (
      !isPlural(descriptor) && !isReference(descriptor) && !isId(descriptor) &&
      isPrimitiveProperty(value)
    );
  }

  service.registerHandler({
    handle,
    canHandle
  });
}

function isPlural(descriptor) {
  return descriptor.isMany;
}

function isReference(descriptor) {
  return descriptor.isReference;
}

function isId(descriptor) {
  return descriptor.isId;
}

function isPrimitiveProperty(property) {
  return !property.$type;
}
