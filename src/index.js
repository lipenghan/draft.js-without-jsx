var rawContent = {};

var RootElement = React.createClass({
  getInitialState: function() {
    return { log: '' };
  },
  onChange: function(children) {
    this.log(children);
  },
  log: function(data) {
    var jsonStr = JSON.stringify(data, null, 1);
    this.setState({ log: jsonStr });
  },
  render: function() {
    return React.createElement(
      'div',
      { style: { minWidth: '400px' } },
      React.createElement(Components.FieldMappings.AdvancedField, {
        onChange: this.onChange,
        log: this.log
      }),
      React.createElement('br', null),
      React.createElement('pre', null, this.state.log)
    );
  }
});

ReactDOM.render(
  React.createElement(RootElement, null),
  document.getElementById('editor-container')
);
