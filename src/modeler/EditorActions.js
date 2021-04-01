export default class EditorActions {
  constructor(editorActions, selection, canvas) {

    // Register action to get the currently selected element
    editorActions.register('templatesPlugin:getSelectedElement', () => {
      return getSelectedElement();
    });

    // helper //////////////////////////////////

    /**
    * Get the currently selected element. If no explicit selection is made, the
    * root element is returned. If multiple elements are selected, null is returned.
    *
    * @returns {Shape} selected element or root element
    */
    function getSelectedElement() {
      const selectedElements = selection.get();

      if (selectedElements.length > 1 || selectedElements.length < 0) {
        return null;
      }

      if (selectedElements.length === 1) {
        return selectedElements[ 0 ];
      }

      if (selectedElements.length === 0) {
        return canvas.getRootElement();
      }
    }
  }
}

EditorActions.$inject = [
  'editorActions',
  'selection',
  'canvas'
];
