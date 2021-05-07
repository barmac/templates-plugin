/*
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. Licensed under a commercial license.
 * You may not use this file except in compliance with the commercial license.
 */

import BpmnModdle from 'bpmn-moddle';
import camundaModdle from 'camunda-bpmn-moddle/resources/camunda.json';
import { TemplateService } from '../TemplateService';


describe('<TemplateService>', function() {

  it('should handle primitive properties', async function() {

    // given
    const serviceTask = `
    <bpmn:serviceTask id="ServiceTask" camunda:asyncBefore="true" />`;

    const moddle = createModdle();

    const { rootElement } = await moddle.fromXML(serviceTask, 'bpmn:ServiceTask');

    const templateService = new TemplateService();

    // when
    const template = templateService.generateTemplate(rootElement);

    // then
    expect(template).to.exist;
    expect(template.properties).to.have.lengthOf(1);
  });


  it('should handle camunda:Properties', async function() {

    // given
    const serviceTask = `
    <bpmn:serviceTask id="Activity_0usmjyo">
      <bpmn:extensionElements>
        <camunda:properties>
          <camunda:property name="a" value="b" />
        </camunda:properties>
      </bpmn:extensionElements>
    </bpmn:serviceTask>`;

    const moddle = createModdle();

    const { rootElement } = await moddle.fromXML(serviceTask, 'bpmn:ServiceTask');

    const templateService = new TemplateService();

    // when
    const template = templateService.generateTemplate(rootElement);

    // then
    expect(template).to.exist;
    expect(template.properties).to.have.lengthOf(1);
  });

});

function createModdle() {
  return new BpmnModdle({ camunda: camundaModdle });
}
