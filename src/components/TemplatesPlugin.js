import React, { Component } from 'camunda-modeler-plugin-helpers/react';

import TemplatesPluginModal from './TemplatesPluginModal';

import additionalModule from '../modeler';

const TAB_TYPE_BPMN = 'bpmn';


class TemplatesPlugin extends Component {
  constructor() {
    super();

    this.state = {
      activeTab: null,
      modalOpen: false
    };
  }

  componentDidMount() {
    const { subscribe } = this.props;

    this.subscriptions = [
      subscribe('app.activeTabChanged', (...args) => this.handleActiveTabChanged(...args)),
      subscribe('templates-plugin:openModal', () => this.openModal()),
      subscribe('bpmn.modeler.configure', (...args) => this.handleBpmnModelerConfigure(...args))
    ];
  }

  componentWillUnmount() {
    if (this.subscriptions && this.subscriptions.length) {
      this.subscriptions.forEach(subscription => subscription.cancel());
    }
  }

  handleActiveTabChanged = ({ activeTab }) => {
    this.setState({ activeTab });
  }

  handleBpmnModelerConfigure = async ({ middlewares }) => {
    middlewares.push(config => {
      return {
        ...config,
        additionalModules: [
          ...config.additionalModules || [],
          additionalModule
        ],
        propertiesProvider: {
          ...config.propertiesProvider || {},
          openCreateTemplateModal: this.openModal
        }
      };
    });
  }

  addTemplate = async (template) => {
    const {
      config,
      displayNotification
    } = this.props;

    const elementTemplates = await config.get('elementTemplates') || [];

    await this.setElementTemplates([
      ...elementTemplates,
      template
    ]);

    const { name } = template;

    displayNotification(templateAddedNotification(name));
  }

  setElementTemplates = async elementTemplates => {
    const {
      config,
      triggerAction
    } = this.props;

    const { activeTab } = this.state;

    await config.set('elementTemplates', elementTemplates);

    if (activeTab && activeTab.type === TAB_TYPE_BPMN) {
      triggerAction('elementTemplates.reload');
    }
  }

  openModal = () => {
    this.setState({
      modalOpen: true
    });
  }

  closeModal = () => {
    this.setState({
      modalOpen: false
    });
  }

  renderModal = () => {
    const { triggerAction } = this.props;

    return (
      <TemplatesPluginModal
        onClose={ this.closeModal }
        onSubmit={ this.addTemplate }
        triggerAction={ triggerAction } />
    );
  }

  render() {
    const {
      activeTab,
      modalOpen
    } = this.state;

    const hasActiveTab = activeTab && activeTab.type !== 'empty';

    return (
      <React.Fragment>
        { hasActiveTab && modalOpen && this.renderModal() }
      </React.Fragment>
    );
  }
}

export default TemplatesPlugin;

// Helpers //////////

function templateAddedNotification(name) {
  return {
    type: 'success',
    title: 'Template Created',
    content: `Template ${ name } has been created successfully.`
  };
}