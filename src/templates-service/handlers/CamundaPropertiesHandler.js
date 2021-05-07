/*
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. Licensed under a commercial license.
 * You may not use this file except in compliance with the commercial license.
 */

import { is } from 'bpmn-js/lib/util/ModelUtil';


export function CamundaPropertiesHandler(service) {

  function handle(template, name, value, descriptor) {

    if (!isExtensionElements(value)) {
      return;
    }

    const camundaProperties = findCamundaProperties(value);

    if (!camundaProperties) {
      return;
    }

    for (const property of camundaProperties) {
      const propertyName = property.get('name');
      const propertyValue = property.get('value');


      template.properties.push({
        label: propertyName,
        type: 'String',
        value: propertyValue,
        binding: {
          type: 'camunda:property',
          name: propertyName
        }
      });
    }
  }

  service.registerHandler({
    handle
  });
}

function isExtensionElements(value) {
  return is(value, 'bpmn:ExtensionElements');
}

function findCamundaProperties(extensionElements) {
  const values = extensionElements.get('values');

  for (const value of values) {
    if (is(value, 'camunda:Properties')) {
      return value.get('values');
    }
  }
}
