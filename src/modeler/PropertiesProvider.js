import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';


export default class PropertiesProvider {
  constructor(config, propertiesPanel, translate) {

    propertiesPanel.registerProvider(this);

    this._translate = translate;
    this._config = config;
  }

  getTabs = element => {
    return tabs => {

      const generalTab = tabs.find(({ id }) => id === 'general');

      if (!generalTab) {
        return tabs;
      }

      const { groups } = generalTab;

      const generalGroup = groups.find(({ id }) => id === 'general');

      if (!generalGroup) {
        return tabs;
      }

      const { entries } = generalGroup;

      this.addCreateTemplateModalEntry(entries);

      return tabs;
    };
  };

  addCreateTemplateModalEntry = entries => {
    const elementTemplatesModalEntry = entries.find(({ id }) => id === 'elementTemplatesModal');

    const { openCreateTemplateModal } = this._config;

    entries.push(entryFactory.link(this._translate, {
      id: 'createTemplateModal',
      buttonLabel: this._translate('Create Template'),
      handleClick: openCreateTemplateModal,
      label: elementTemplatesModalEntry ? undefined : this._translate('Template'),
      cssClasses: 'bpp-entry-link-button'
    }));
  }
}

PropertiesProvider.$inject = [
  'config.propertiesProvider',
  'propertiesPanel',
  'translate'
];