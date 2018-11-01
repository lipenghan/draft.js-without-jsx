// deeply learn draft.js
// https://www.youtube.com/watch?v=vOZAO3jFSHI&list=PLiEcA6UC2sE0yRDcCx0lCZLW1-4AGZwX1
// https://draft-js-samples.now.sh/

Constants.FieldMappings.TokenType = {
  OBJECT: 'OBJECT',
  STATIC_DATE: 'STATIC_DATE',
  DYNAMIC_DATE: 'DYNAMIC_DATE'
};

Components.FieldMappings.Advanced = {};

Components.FieldMappings.Advanced.Utils = {
  mergeEntityData: function(editorState, data) {
    var entityKey = editorState.block.getEntityAt(0);
    var newContentState = editorState.contentState.mergeEntityData(
      entityKey,
      data
    );
    editorState.blockProps.onFinishEdit(newContentState);
  }
};

/**
 * Token PopoverContentComponent
 */
Components.FieldMappings.Advanced.PopoverContent = React.createClass({
  _objectFieldForField: function(field, validationProps) {
    var self = this;
    // TODO: add project logic
    return React.createElement(Components.FieldMappings.ObjectField, {
      value: field.value,
      onChange: function(value) {
        field.value = value;
        self._updateField(field);
      }
    });
  },

  _staticDateFieldForField: function(field, validationProps) {
    var self = this;
    return React.createElement(
      Components.FieldMappings.StaticDatetimeInputField,
      {
        className: 'static-date-input',
        value: field.value,
        disabled: this.props.disabled,
        validationProps: validationProps,
        onChange: function(value) {
          field.value = value;
          self._updateField(field);
        }
      }
    );
  },

  _dynamicDateFieldForField: function(field, validationProps) {
    var self = this;
    return React.createElement(Components.FieldMappings.DynamicDateInputField, {
      value: field.offset,
      unit: field.unit,
      disabled: this.props.disabled,
      validationProps: validationProps,
      onUnitChange: function(unit) {
        field.unit = unit;
        self._updateField(field);
      },
      onOffsetChange: function(offset) {
        field.offset = offset;
        self._updateField(field);
      }
    });
  },

  _updateField: function(field) {
    Components.FieldMappings.Advanced.Utils.mergeEntityData(
      this.props.editorState,
      { value: field }
    );
  },

  _getContentComponent: function(type) {
    var self = this,
      entity = this.props.entity,
      validationProps = { isValid: true },
      data = entity.getData(),
      field = data.value;

    var component = React.createElement('div', {}, '');

    if (type === Constants.FieldMappings.TokenType.OBJECT) {
      component = self._objectFieldForField(field, validationProps);
    } else if (type === Constants.FieldMappings.TokenType.STATIC_DATE) {
      component = self._staticDateFieldForField(field, validationProps);
    } else if (type === Constants.FieldMappings.TokenType.DYNAMIC_DATE) {
      component = self._dynamicDateFieldForField(field, validationProps);
    }

    return component;
  },

  render: function() {
    var type = this.props.type;

    var contentComponent = this._getContentComponent(type);
    return React.createElement(
      'div',
      { className: 'token-popover-content' },
      contentComponent
    );
  }
});

/**
 * Token-Label
 */
Components.FieldMappings.Advanced.TokenLabel = React.createClass({
  getLabelStyle: function(type) {
    var value = 'token-label-dynamic-date';
    if (type === Constants.FieldMappings.TokenType.OBJECT) {
      value = 'token-label-object';
    } else if (type === Constants.FieldMappings.TokenType.STATIC_DATE) {
      value = 'token-label-static-date';
    } else if (type === Constants.FieldMappings.TokenType.DYNAMIC_DATE) {
      value = 'token-label-dynamic-date';
    }

    return value;
  },

  getLabelCaption: function(type, field) {
    var value = '';
    if (type === Constants.FieldMappings.TokenType.OBJECT) {
      // TODO: add object display logic
      value = field.value;
    } else if (type === Constants.FieldMappings.TokenType.STATIC_DATE) {
      value = field.value;
    } else if (type === Constants.FieldMappings.TokenType.DYNAMIC_DATE) {
      value = `Current Date ${field.offset} ${field.unit}`;
    }

    return value;
  },

  render: function() {
    var self = this,
      type = this.props.type,
      field = this.props.field,
      disabled = this.props.disabled;

    return React.createElement(
      'div',
      null,
      React.createElement(
        ReactBootstrap.Label,
        {
          className: this.getLabelStyle(type),
          onClick: this.props.onClick
        },
        this.getLabelCaption(type, field),
        React.createElement(
          'span',
          {
            className: 'token-remove-button',
            onClick: this.props.removeToken,
            style: { display: disabled ? 'none' : 'inline-block' }
          },
          'x'
        )
      )
    );
  }
});

/**
 * Draft Token Component
 */
Components.FieldMappings.Advanced.Token = React.createClass({
  onHide: function() {
    this.refs.overlayTrigger.hide();
  },

  onShow: function() {
    this.refs.overlayTrigger.show();
  },

  // auto show when insert Token
  componentDidMount: function() {
    var entityKey = this.props.block.getEntityAt(0);
    var entity = this.props.contentState.getEntity(entityKey);
    var data = entity.getData();
    if (data.isNew) {
      Components.FieldMappings.Advanced.Utils.mergeEntityData(this.props, {
        isNew: 0
      });
      this.refs.overlayTrigger.show();
    }
  },

  getTitleCaption: function(type) {
    var value = '';
    if (type === Constants.FieldMappings.TokenType.OBJECT) {
      value = 'Eloqua Object';
    } else if (type === Constants.FieldMappings.TokenType.STATIC_DATE) {
      value = 'Static Date';
    } else if (type === Constants.FieldMappings.TokenType.DYNAMIC_DATE) {
      value = 'Dynamic Date';
    }

    return value;
  },

  removeToken: function(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.blockProps.onRemove(this.props.block.getKey());
  },

  render: function() {
    var self = this,
      entityKey = this.props.block.getEntityAt(0),
      entity = this.props.contentState.getEntity(entityKey),
      type = entity.getType(),
      data = entity.getData(),
      disabled = data.disabled,
      field = data.value;

    return React.createElement(
      'div',
      null,
      React.createElement(
        ReactBootstrap.OverlayTrigger,
        {
          trigger: 'click',
          placement: 'bottom',
          rootClose: false,
          ref: 'overlayTrigger',
          overlay: React.createElement(
            ReactBootstrap.Popover,
            { title: '', className: 'token-popover' },
            React.createElement(
              'div',
              null,
              React.createElement(
                'div',
                { className: 'popover-title' },
                React.createElement(
                  'span',
                  {
                    className: 'popover-title-span'
                  },
                  this.getTitleCaption(type)
                ),
                React.createElement(ReactBootstrap.Glyphicon, {
                  glyph: 'remove',
                  style: { float: 'right', cursor: 'pointer' },
                  onClick: this.onHide
                })
              )
            ),
            React.createElement(
              Components.FieldMappings.Advanced.PopoverContent,
              {
                entity: entity,
                editorState: this.props,
                type: type,
                disabled: disabled
              }
            )
          )
        },
        React.createElement(Components.FieldMappings.Advanced.TokenLabel, {
          type: type,
          field: field,
          disabled: disabled,
          removeToken: this.removeToken,
          onClick: function() {
            self.onShow();
          }
        })
      )
    );
  }
});

/**
 * Advanced Mode Component
 */
Components.FieldMappings.AdvancedField = React.createClass({
  getInitialState: function() {
    return this._baseDefaultInitialState();
  },

  componentWillReceiveProps: function(nextProps) {
    if (this.props.disabled != nextProps.disabled) {
      this.setState(this._baseDefaultInitialState(nextProps));
    }
  },

  _baseDefaultInitialState: function(nextProps) {
    var props = nextProps || this.props,
      children = props.children || [],
      disabled = props.disabled;

    var editorState;
    if (children.length > 0) {
      var rawContent = this.convertToRaw(children);
      var contentState = Draft.convertFromRaw(rawContent);
      editorState = Draft.EditorState.createWithContent(contentState);
    } else {
      editorState = Draft.EditorState.createEmpty();
    }

    return {
      editorState: editorState,
      disabled: disabled
    };
  },

  handleKeyCommand: function(command, editorState) {
    var newEditorState = Draft.RichUtils.handleKeyCommand(editorState, command);
    if (newEditorState) {
      this.editorChanged(newEditorState);
      return true;
    }
    return false;
  },

  editorChanged: function(editorState) {
    this.setState(
      {
        editorState: editorState
      },
      function() {
        // console.log(Draft.convertToRaw(this.state.editorState.getCurrentContent()))
        var contentState = this.state.editorState.getCurrentContent();
        var rawContent = Draft.convertToRaw(contentState);
        var children = this.convertFromRaw(rawContent);

        if (this.props.onChange) {
          this.props.onChange(children);
        }
        // if (this.props.log) {
        //   this.props.log(rawContent);
        // }
      }
    );
  },

  convertToRaw: function(children) {
    var rawContent = {
      blocks: [],
      entityMap: {}
    };

    for (var i = 0; i < children.length; i++) {
      var attribute = children[i].attribute;
      var block;
      var entity;
      var entityKey = Object.keys(rawContent.entityMap).length;
      if (attribute.type === 'static') {
        if (attribute.dataType === 'date') {
          entity = {
            mutability: 'IMMUTABLE',
            type: Constants.FieldMappings.TokenType.STATIC_DATE,
            data: { value: attribute }
          };
          rawContent.entityMap[entityKey] = entity;

          rawContent.blocks.push({
            type: 'atomic',
            text: ' ',
            entityRanges: [{ key: entityKey, length: 1, offset: 0 }]
          });
        } else {
          // text
          rawContent.blocks.push({
            type: 'unstyled',
            text: attribute.value
          });
        }
      } else if (attribute.type === 'dynamic') {
        entity = {
          mutability: 'IMMUTABLE',
          type: Constants.FieldMappings.TokenType.DYNAMIC_DATE,
          data: { value: attribute }
        };
        rawContent.entityMap[entityKey] = entity;

        rawContent.blocks.push({
          type: 'atomic',
          text: ' ',
          entityRanges: [{ key: entityKey, length: 1, offset: 0 }]
        });
      } else {
        entity = {
          mutability: 'IMMUTABLE',
          type: Constants.FieldMappings.TokenType.OBJECT,
          data: { value: attribute }
        };
        rawContent.entityMap[entityKey] = entity;

        rawContent.blocks.push({
          type: 'atomic',
          text: ' ',
          entityRanges: [{ key: entityKey, length: 1, offset: 0 }]
        });
      }
    }

    return rawContent;
  },

  convertFromRaw: function(rawContent) {
    var children = [];
    if (rawContent.blocks) {
      var blocks = rawContent.blocks;
      var entityMap = rawContent.entityMap;
      blocks.forEach(function(block) {
        if (block.text !== '' && block.type === 'unstyled') {
          children.push({ attribute: { type: 'static', value: block.text } });
        } else if (block.type === 'atomic') {
          var entityRanges = block.entityRanges;
          if (entityRanges.length > 0) {
            var entityKey = entityRanges[0].key;
            var entity = entityMap[entityKey];

            if (entity.type === Constants.FieldMappings.TokenType.OBJECT) {
              // TODO: add object convert service logic
              children.push({ attribute: { value: entity.data.value } });
            } else if (
              entity.type === Constants.FieldMappings.TokenType.DYNAMIC_DATE
            ) {
              children.push({
                attribute: {
                  type: 'dynamic',
                  dataType: 'date',
                  offset: entity.data.value.offset,
                  value: entity.data.value.unit
                }
              });
            } else if (
              entity.type === Constants.FieldMappings.TokenType.STATIC_DATE
            ) {
              children.push({
                attribute: {
                  type: 'static',
                  dataType: 'date',
                  value: entity.data.value.value
                }
              });
            }
          }
        }
      });
    }

    return children;
  },

  _defaultFieldValue: function(type) {
    var data = {};
    if (type === Constants.FieldMappings.TokenType.STATIC_DATE) {
      data = {
        type: 'static',
        dataType: 'date',
        value: moment()
          .local()
          .startOf('day')
          .toISOString()
      };
    }
    if (type === Constants.FieldMappings.TokenType.DYNAMIC_DATE) {
      data = {
        type: 'dynamic',
        dataType: 'date',
        offset: 0,
        unit: 'DAYS'
      };
    }
    if (type === Constants.FieldMappings.TokenType.OBJECT) {
      // TODO:  default object data
      data = { value: 'TODO add Object', type: 'object' };
    }
    return data;
  },

  onRemove: function(blockKey) {
    var self = this;
    var editorState = self.state.editorState;
    var content = editorState.getCurrentContent();
    var newSelection = new Draft.SelectionState({
      anchorKey: blockKey,
      anchorOffset: 0,
      focusKey: blockKey,
      focusOffset: 0
    });

    var afterKey = content.getKeyAfter(blockKey);
    var afterBlock = content.getBlockForKey(afterKey);
    var targetRange;

    // Only if the following block the last with no text then the whole block
    // should be removed. Otherwise the block should be reduced to an unstyled block
    // without any characters.
    if (afterBlock) {
      targetRange = new Draft.SelectionState({
        anchorKey: blockKey,
        anchorOffset: 0,
        focusKey: afterKey,
        focusOffset: 0
      });
    } else {
      targetRange = new Draft.SelectionState({
        anchorKey: blockKey,
        anchorOffset: 0,
        focusKey: blockKey,
        focusOffset: 0
      });
    }

    // change the blocktype and remove the characterList entry with the sticker
    content = Draft.Modifier.setBlockType(content, targetRange, 'unstyled');
    content = Draft.Modifier.removeRange(content, targetRange, 'backward');

    // force to new selection
    var newState = Draft.EditorState.push(editorState, content, 'remove-token');

    var newEditorState = Draft.EditorState.forceSelection(
      newState,
      newSelection
    );
    self.editorChanged(newEditorState);
  },

  insertToken: function(type) {
    var editorState = this.state.editorState;
    var contentState = editorState.getCurrentContent();
    var contentStateWithEntity = contentState.createEntity(type, 'IMMUTABLE', {
      value: this._defaultFieldValue(type),
      disabled: this.props.disabled,
      isNew: 1 // Redundant field, don't update it's just for tag a new insert Token.
    });
    var entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    var newEditorState = Draft.EditorState.set(editorState, {
      currentContent: contentStateWithEntity
    });

    return Draft.AtomicBlockUtils.insertAtomicBlock(
      newEditorState,
      entityKey,
      ' '
    );
  },

  // because of draft.js can't support inline-block when build customComponent,
  // so just find a solution, insert empty inputText before insert Token.
  insertEmpty: function() {
    var editorState = this.state.editorState;
    var selectState = editorState.getSelection();
    var contentState = editorState.getCurrentContent();
    var newContentState = Draft.Modifier.insertText(
      contentState,
      selectState,
      ' '
    );
    var newEditorState = Draft.EditorState.push(
      editorState,
      newContentState,
      'insert-characters'
    );
    return newEditorState;
  },

  selectHandler: function(type) {
    // react setState() is asynchronous method, so at the first insertEmptyText than insertToken.
    // this is the hack method.
    this.setState(
      {
        editorState: this.insertEmpty()
      },
      function() {
        var newEditorState = this.insertToken(type);
        this.editorChanged(newEditorState);
      }
    );
  },

  render: function() {
    var self = this;
    return React.createElement(
      'div',
      { className: 'fieldmapping-advanced-field' },

      // Insert.Menu
      React.createElement(
        'div',
        { className: 'fieldmapping-advanced-toolbar' },
        'Advanced Mode',
        React.createElement(
          ReactBootstrap.DropdownButton,
          {
            title: 'Insert Object',
            bsSize: 'xsmall',
            onSelect: this.selectHandler,
            disabled: this.props.disabled
          },
          React.createElement(
            ReactBootstrap.MenuItem,
            { eventKey: Constants.FieldMappings.TokenType.OBJECT },
            'Eloqua Object'
          ),
          React.createElement(
            ReactBootstrap.MenuItem,
            { eventKey: Constants.FieldMappings.TokenType.STATIC_DATE },
            'Static Date'
          ),
          React.createElement(
            ReactBootstrap.MenuItem,
            { eventKey: Constants.FieldMappings.TokenType.DYNAMIC_DATE },
            'Dynamic Date'
          )
        )
      ),

      // Draft.js Editor
      React.createElement(
        'div',
        { className: 'fieldmapping-advanced-editor' },
        React.createElement(Draft.Editor, {
          editorState: this.state.editorState,
          handleKeyCommand: this.handleKeyCommand,
          onChange: this.editorChanged,
          blockRendererFn: this.renderBlock,
          readOnly: this.state.disabled,
          ref: 'domEditor'
        })
      )
    );
  },

  focus: function() {
    this.refs.domEditor.focus();
  },

  renderBlock: function(block) {
    var self = this;
    if (block.getType() === 'atomic') {
      return {
        component: Components.FieldMappings.Advanced.Token,
        editable: false,
        props: {
          onFinishEdit: function(newContentState) {
            var newEditorState = Draft.EditorState.createWithContent(
              newContentState
            );
            self.editorChanged(newEditorState);
          },
          onRemove: function(blockKey) {
            self.onRemove(blockKey);
          }
        }
      };
    }

    return null;
  }
});
