import React, { Component } from 'camunda-modeler-plugin-helpers/react';

import { Modal } from 'camunda-modeler-plugin-helpers/components';

import { Formik, Form, Field } from 'formik';

import getEditMenu from '../util/getEditMenu';

import css from './TemplatesPluginModal.less';

import { TemplateService } from '../templates-service/TemplateService';

const templateService = new TemplateService();

const ids = {
  name: 'templates-plugin-name',
  template: 'templates-plugin-template'
};

export default class TemplatesPluginModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      element: null
    };
  }

  componentDidMount = async () => {
    const { triggerAction } = this.props;

    this.updateMenu();

    const element = await triggerAction('templatesPlugin:getSelectedElement');

    this.setState({ element });
  }

  updateMenu = () => {
    const { triggerAction } = this.props;

    triggerAction('update-menu', { editMenu:  getEditMenu() });
  }

  onSubmit = (values, { setSubmitting }) => {
    const {
      onClose,
      onSubmit
    } = this.props;

    const {
      [ ids.name ]: name,
      [ ids.template ]: template
    } = values;

    onSubmit({
      ...JSON.parse(template),
      name
    });

    setSubmitting(false);

    onClose();
  }

  render() {
    const { onClose } = this.props;

    const { element } = this.state;

    if (!element) {
      return null;
    }

    const initialValues = {
      [ ids.name ]: 'New Template',
      [ ids.template ]: JSON.stringify(templateService.generateTemplate(element.businessObject), null, 2)
    };

    return (
      <Modal className={ css.Modal } onClose={ onClose }>

        <Formik initialValues={ initialValues } onSubmit={ this.onSubmit }>
          {({ isSubmitting }) => (
            <Form>

              <Modal.Title>Create Template</Modal.Title>

              <Modal.Body>
                <fieldset className={ css.fieldset }>
                  <div className="fields">
                    <TextField id={ ids.name } label="Name" />
                    <TextArea id={ ids.template } label="Template" disabled={ true } />
                  </div>
                </fieldset>
              </Modal.Body>

              <Modal.Footer>
                <button className="btn btn-secondary" onClick={ onClose } disabled={ isSubmitting }>
                  Cancel
                </button>
                <button className="btn btn-primary" type="submit" disabled={ isSubmitting }>
                  Create
                </button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>

      </Modal>
    );
  }
}

function TextField(props) {
  const {
    id,
    label
  } = props;

  return (
    <div className="form-group">
      <label htmlFor={ id }>{ label }</label>
      <Field type="text" name={ id } id={ id } className="form-control" />
    </div>
  );
}

function TextArea(props) {
  const {
    id,
    label,
    disabled = false,
    rows = 10
  } = props;

  return (
    <div className="form-group">
      <label htmlFor={ id }>{ label }</label>
      <Field type="text" as="textarea" name={ id } id={ id } disabled={ disabled } rows={ rows } className="form-control" />
    </div>
  );
}

function generateRandomTemplate(element) {
  const { businessObject } = element;

  const { $type: type } = businessObject;

  return {
    $schema: 'https://unpkg.com/@camunda/element-templates-json-schema@0.3.0/resources/schema.json',
    id: Date.now().toString(),
    appliesTo: [
      type
    ],
    properties: [
      {
        label: 'Name',
        type: 'String',
        value: 'Foo',
        binding: {
          type: 'property',
          name: 'name'
        }
      }
    ]
  };
}