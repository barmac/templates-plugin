/*
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. Licensed under a commercial license.
 * You may not use this file except in compliance with the commercial license.
 */

export default function getEditMenu() {
  return [
    [
      {
        role: 'undo',
        enabled: true
      },
      {
        role: 'redo',
        enabled: true
      }
    ],
    [
      {
        role: 'copy',
        enabled: true
      },
      {
        role: 'cut',
        enabled: true
      },
      {
        role: 'paste',
        enabled: true
      },
      {
        role: 'selectAll',
        enabled: true
      }
    ]
  ];
}