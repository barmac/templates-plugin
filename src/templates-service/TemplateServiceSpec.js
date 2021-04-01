/*
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. Licensed under a commercial license.
 * You may not use this file except in compliance with the commercial license.
 */

import BpmnModdle from 'bpmn-moddle';
import camundaModdle from 'camunda-bpmn-moddle/resources/camunda.json';
import { TemplateService } from './TemplateService';

run();

async function run() {
  const serviceTask = `
  <bpmn:serviceTask id="ServiceTask" camunda:asyncBefore="true">
    <bpmn:extensionElements>
      <camunda:inputOutput>
        <camunda:inputParameter name="input">1</camunda:inputParameter>
        <camunda:outputParameter name="output">2</camunda:outputParameter>
      </camunda:inputOutput>
    </bpmn:extensionElements>
  </bpmn:serviceTask>`;

  const moddle = createModdle();

  const { rootElement } = await moddle.fromXML(serviceTask, 'bpmn:ServiceTask');

  const templateService = new TemplateService();

  const template = templateService.generateTemplate(rootElement);

  console.dir(template);
}

function createModdle() {
  return new BpmnModdle({ camunda: camundaModdle });
}