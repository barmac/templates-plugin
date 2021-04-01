import EditorActions from './EditorActions';
import PropertiesProvider from './PropertiesProvider';

export default {
  __init__: [
    'templatesPluginEditorActions',
    'templatesPluginPropertiesProvider'
  ],
  templatesPluginEditorActions: [ 'type', EditorActions ],
  templatesPluginPropertiesProvider: [ 'type', PropertiesProvider ]
};