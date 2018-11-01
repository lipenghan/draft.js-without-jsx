Components.FieldMappings.StaticDatetimeInputField = React.createClass({
  getInitialState: function() {
    var props = this.props;
    return {
      value: props.value,
      validationProps: props.validationProps
    };
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({
      value: nextProps.value,
      validationProps: nextProps.validationProps
    });
  },

  handleChange: function(evt) {
    if (this.props.onChange !== undefined) {
      this.props.onChange(evt.toISOString());
    }

    this.setState({
      value: evt.toISOString()
    });
  },

  render: function() {
    var self = this;
    return React.createElement(DatePicker, {
      selected: moment(self.props.value),
      onChange: self.handleChange,
      showMonthDropdown: true,
      dateFormat: 'YYYY/MM/DD HH:mm'
    });
  }
});
