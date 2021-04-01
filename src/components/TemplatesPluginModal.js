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

    let {
      [ ids.name ]: name,
      [ ids.template ]: template
    } = values;

    template = {
      ...JSON.parse(template),
      name
    };

    template.properties = template.properties.filter((property, index) => {
      return values[ 'property_' + index ];
    });

    debugger;

    onSubmit(template);

    setSubmitting(false);

    onClose();
  }

  render() {
    const { onClose } = this.props;

    const { element } = this.state;

    if (!element) {
      return null;
    }

    const { businessObject } = element;

    const template = templateService.generateTemplate(businessObject);

    const { name } = template;

    const initialValues = {
      [ ids.name ]: name,
      [ ids.template ]: JSON.stringify(template, null, 2)
    };

    template.properties.forEach((property, index) => {
      initialValues[ 'property_' + index ] = true;
    });

    return (
      <Modal className={ css.Modal } onClose={ onClose }>

        <Formik initialValues={ initialValues } onSubmit={ this.onSubmit }>
          {({ isSubmitting }) => (
            <Form>

              <Modal.Title>Create Template</Modal.Title>

              <Modal.Body>
                <fieldset className={ css.fieldset }>
                  <legend className={ css.legend }>
                    General
                  </legend>
                  <div className="fields">
                    <TextField id={ ids.name } label="Name" />
                  </div>
                </fieldset>

                <fieldset className={ css.fieldset }>
                  <legend className={ css.legend }>
                    Properties
                  </legend>
                  <p className={ css.description }>
                    Select properties for template.
                  </p>
                  <div className="fields">
                    {
                      template.properties.map((property, index) => {
                        return <PropertyCheckbox
                          key={ 'property_' + index }
                          id={ 'property_' + index }
                          name={ property.binding.name }
                          value={ property.value } />;
                      })
                    }
                  </div>
                </fieldset>
                {/*
                <fieldset className={ css.fieldset }>
                  <legend className={ css.legend }>
                    Preview
                  </legend>
                  <div className="fields">
                    <TextArea id={ ids.template } disabled={ true } />
                  </div>
                </fieldset> */}

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
      {
        label ? <label htmlFor={ id }>{ label }</label> : null
      }
      <Field type="text" as="textarea" name={ id } id={ id } disabled={ disabled } rows={ rows } className="form-control" />
    </div>
  );
}

function PropertyCheckbox(props) {
  const {
    id,
    name,
    value
  } = props;

  return (
    <div className="form-group">
      <div className="custom-control custom-checkbox">
        <Field type="checkbox" name={ id } id={ id } className="custom-control-input" />
        <label htmlFor={ id } className="custom-control-label" style={ { display: 'flex', 'align-items': 'center' } }>
          <pre style={ { display: 'inline', margin: 0 } }>{ name }</pre>
          <svg style={ { margin: '0 10px 0 8px' } } xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="001616">
            <polygon fill="#909090" fill-rule="evenodd" points="8 3 8 7 15 7 15 9 8 9 8 13 2 8" />
          </svg>
          <pre style={ { display: 'inline', margin: 0 } }>{ value.toString() }</pre>
        </label>
      </div>
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