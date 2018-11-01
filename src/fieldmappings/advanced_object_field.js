Components.FieldMappings.ObjectField = React.createClass({
  getInitialState: function() {
    return {
      selectedOption: ''
    };
  },

  handleChangei: function(selectedOption) {
    this.setState({ selectedOption: selectedOption });
    // selectedOption can be null when the `x` (close) button is clicked
    if (selectedOption) {
      console.log(`Selected: ${selectedOption.label}`);
    }
  },

  onChange: function(selectedOption) {
    var props = this.props;

    if (props.onChange !== undefined) {
      //       props.onChange(event.target.value);
    }
    if (selectedOption) {
      console.log(`Selected: ${selectedOption.label}`);
    }
    this.setState({ selectedOption: selectedOption });
  },

  render: function() {
    var self = this;

    return React.createElement(Select, {
      name: 'form-field-name',
      value: this.state.selectedOption,
      onChange: this.onChange,
      options: [{ value: 'one', label: 'One' }, { value: 'two', label: 'Two' }]
    });
  }
});
