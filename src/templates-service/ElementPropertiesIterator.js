/*
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. Licensed under a commercial license.
 * You may not use this file except in compliance with the commercial license.
 */

import { isUndefined } from 'min-dash';

export default function* ElementPropertiesIterator(bpmnElement) {
  for (const propertyName in bpmnElement) {
    const property = bpmnElement.get(propertyName);

    if (isUndefined(property)) {
      continue;
    }

    const descriptor = bpmnElement.$descriptor.propertiesByName[propertyName];

    yield [ property, descriptor.ns.name, descriptor ];
  }
}
