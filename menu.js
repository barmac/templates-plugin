module.exports = function(electronApp, menuState) {
  return [
    {
      label: 'Create Template',
      enabled: function() {
        return true;
      },
      action: function() {
        electronApp.emit('menu:action', 'emit-event', {
          type: 'templates-plugin:openModal'
        });
      }
    }
  ];
};
