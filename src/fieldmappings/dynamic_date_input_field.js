Components.FieldMappings.DynamicDateInputField = React.createClass({
  getInitialState: function() {
    var props = this.props,
      value = props.value || 0;

    return {
      unit: props.unit,
      value: value,
      negative: value < 0,
      validationProps: props.validationProps || {}
    };
  },

  handleUnitChange: function(value) {
    if (this.props.onUnitChange !== undefined) {
      this.props.onUnitChange(value);
    }
    this.setState({ unit: value });
  },

  handleOffsetChange: function(value, negative) {
    if (value == null || typeof value == undefined) {
      this.setState({ value: value, negative: negative });
      if (this.props.onOffsetChange !== undefined) {
        this.props.onOffsetChange(value);
      }
    } else if (/^(-?[0-9]*)$/.test(value)) {
      let absValue = Math.abs(value);
      let val = negative ? -Number(absValue) : Number(absValue);

      this.setState({ value: val, negative: negative });
      if (this.props.onOffsetChange !== undefined) {
        this.props.onOffsetChange(val);
      }
    }
  },

  render: function() {
    var self = this,
      state = this.state,
      props = this.props,
      validationProps = props.validationProps || { isValid: true },
      helpMessage = props.validationProps.message
        ? props.validationProps.message
        : '',
      isValid = props.validationProps.isValid === true,
      negative = state.negative === true;

    return React.createElement(
      ReactBootstrap.FormGroup,
      { validationState: isValid === true ? null : 'error' },
      [
        React.createElement(
          ReactBootstrap.Row,
          {},
          React.createElement(
            'div',
            { className: 'fieldmapping fieldmapping-dynamic-date-field' },
            React.createElement(
              ReactBootstrap.ControlLabel,
              { className: 'field-label' },
              props.label || 'Current Date'
            ),

            React.createElement(
              ReactBootstrap.ButtonToolbar,
              null,

              React.createElement(
                ReactBootstrap.ToggleButtonGroup,
                { name: 'dynamic-date-field-offset' },
                React.createElement(
                  ReactBootstrap.ToggleButton,
                  {
                    value: false,
                    checked: negative === false,
                    className: negative === false ? 'active' : '',
                    onClick: function() {
                      self.handleOffsetChange(state.value, false);
                    }
                  },
                  // React.createElement("i", { className: "ic ic-add" })
                  React.createElement(ReactBootstrap.Glyphicon, {
                    glyph: 'plus'
                  })
                ),
                React.createElement(
                  ReactBootstrap.ToggleButton,
                  {
                    value: true,
                    checked: negative === true,
                    className: negative === true ? 'active' : '',
                    onClick: function() {
                      self.handleOffsetChange(state.value, true);
                    }
                  },
                  // React.createElement("i", { className: "fa fa-minus" })
                  React.createElement(ReactBootstrap.Glyphicon, {
                    glyph: 'minus'
                  })
                ) // Need ic icon for minus
              )
            ),

            React.createElement(ReactBootstrap.FormControl, {
              className: 'field-value',
              disabled: props.disabled,
              type: 'text',
              value: state.value ? Math.abs(state.value) : 0,
              onChange: function(evt) {
                self.handleOffsetChange(evt.target.value, state.negative);
              }
            }),
            React.createElement(Select, {
              className: 'field-value',
              disabled: props.disabled,
              clearable: false,
              backspaceRemoves: false,
              labelKey: props.unitLabelKey || 'label',
              valueKey: props.unitValueKey || 'value',
              options: props.unitOptions || [
                { value: 'HOURS', label: 'Hours' },
                { value: 'DAYS', label: 'Days' },
                { value: 'WEEKS', label: 'Weeks' },
                { value: 'MONTHS', label: 'Months' }
              ],
              value: self.state.unit,
              onChange: function(value) {
                self.handleUnitChange(value.value);
              }
            })
          )
        )
      ]
    );
  }
});
