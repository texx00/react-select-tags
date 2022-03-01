import React from "react";

import { Tag } from "./components/Tag";
import { Option } from "./components/Option";
import { Options } from "./components/Options";
import { Notificator } from "./components/Notificator";

import { classSelectors } from "./utils/selectors";
import { filter, validator } from "./utils/functions";

export default class ReactSelectTags extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      input: "",
      focused: false,
      invalid: false,
      showOptions: false,
      showOverflowedTags: false,
      overflowedTags: 0,
    };

    // Ref for the component itself
    this.componentRef = React.createRef();

    // Ref for the tags wrapper
    this.tagsRef = React.createRef();

    // Ref for the input element
    this.inputRef = React.createRef();

    this.handleClickOutside = this.handleClickOutside.bind(this);

    this._alreadyHandledClickOutside = true;

    this.asyncOptionsCacheStore = { current: [] };
  }

  __updateOverflowedTagsCounter() {
    if(this.tagsRef.current) {
      const tags = Array.from(this.tagsRef.current.children);

      let overflowedTags = [];
      if(tags.length > 0) {
        const baseOffset = tags[0].offsetTop;

        overflowedTags = tags.filter(tag => tag.offsetTop > baseOffset);
      }

      if(this.state.overflowedTags != overflowedTags.length) {
        this.setState({ overflowedTags: overflowedTags.length });
      }
    }
  }

  componentDidMount() {
    let { preloadAsyncOptions } = this.props;

    // If "true", open and close the options. That will trigger the
    // loadAsyncOptions() (this doesn't make any sense without the
    // cacheAsyncOptions option)
    preloadAsyncOptions = !!(preloadAsyncOptions ?? true); // force boolean, default to true

    document.addEventListener('mousedown', this.handleClickOutside, true);
    this.__updateOverflowedTagsCounter();

    if(preloadAsyncOptions) {
      this.setState({ showOptions: true }, () => {
        this.setState({ showOptions: false });
      });
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside, true);
  }

  handleClickOutside(event) {
    if (this.componentRef && !this.componentRef.current.contains(event.target)) {
      if(this._alreadyHandledClickOutside == false) {
        this.closeOptions();
        this.setState({
          showOverflowedTags: false,
          focused: false,
        });

        this._alreadyHandledClickOutside = true;
      }
    } else {
      if(!this.state.focused) {
        this.setState({ focused: true });
      }
      this._alreadyHandledClickOutside = false;
    }
  }

  componentDidUpdate() {
    this.__updateOverflowedTagsCounter();
  }

  onFocus(e) {
    // Check if the event was triggered by a human or by JS
    if(e.originalEvent !== undefined) {
      this.openOptions();
    }
  }

  onBlur() {
    const { input } = this.state;

    if(input == "") {
      this.setState({ invalid: false });
      return;
    }

    // Add input to values list, if valid
    if(this.validateTag(input)) {
      this.setState({ invalid: false });
      this.addTag(input);
    } else {
      this.setState({ invalid: true });
    }
  }

  onInputChange(e) {
    let { readOnly, editable } = this.props;

    // If false, tags can't be added / removed
    readOnly = !!readOnly; // force boolean

    // Tags can be editable if "readyOnly" is "false" and "editable" is "true"
    const isEditable = !readOnly && !!editable; // force boolean

    if(isEditable) {
      this.setState({ input: e.target.value });
    }
  }

  onInputKeyDown(e) {
    const { input, showOptions } = this.state;
    const { values, removeOnBackspace } = this.props;

    // On enter
    if(e.keyCode === 13) {
      // Prevent form submission if tag input is nested in <form>
      e.preventDefault();

      // Add input to tags list, if valid
      if(this.validateTag(input)) {
        this.setState({ invalid: false });
        this.addTag(input);
      } else {
        this.setState({ invalid: true });
      }
    }
    // On backspace or delete
    else if(removeOnBackspace && (e.keyCode === 8 || e.keyCode === 46)) {
      // If currently typing, do nothing
      if (input !== "") {
        this.setState({ invalid: false });
        return;
      }

      // If input is blank, remove previous tag
      this.removeTag(values.length - 1);
    }
    // On escape
    else if(e.keyCode === 27) {
      if(showOptions) {
        this.closeOptions();
      } else if(input != "") {
        this.setState({ input: "" });
      }
    }
    // We can't assure if the input if valid or not, so mark it as invalid...
    else {
      this.setState({ invalid: false });
    }
  }

  openOptions() {
    this.setState({ showOptions: true });
  }

  closeOptions() {
    this.setState({ showOptions: false });
  }

  validateTag(value) {
    // If input is blank, do nothing
    if (value === "") {
      return false;
    } else {
      // Check if input is valid
      return (this.props.validator ?? validator)(value);
    }
  }

  addTag(value) {
    const tags = this.getTags();

    let {
      maxTags,
      swapLastValue,
    } = this.props;

    maxTags = Number(maxTags) || 0;
    const maxTagsReached = maxTags !== 0 ? tags.length >= maxTags : false;

    swapLastValue = !!swapLastValue; // force boolean

    const values = [ ...this.props.values ];

    if(!values.includes(value)) {
      if(maxTagsReached && swapLastValue) {
        values.pop();
      }

      values.push(value);
      this.props.onChange(values);

      this.setState({ input: "" });
    } else {
      // We're trying to add a value that was already been added
      // notify error?
    }
  }

  removeTag(i) {
    const values = [ ...this.props.values ];
    values.splice(i, 1);
    this.props.onChange(values);
  }

  updateTag(i, value) {
    const values = [...this.props.values];

    const numOccurencesOfValue = values.reduce((prev, currentValue, index) => {
      return prev + (currentValue === value && index !== i ? 1 : 0);
    }, 0);
    if (numOccurencesOfValue > 0) {
      values.splice(i, 1);
    } else {
      values[i] = value;
    }

    this.props.onChange(values);
  }

  getTags() {
    const { values, options } = this.props;

    const vals = values.map(value => {
      let obj = options.find(opt => opt.value == value);

      if(obj) {
        obj.__locked = true;
      } else {
        obj = {
          label: value,
          value,
          __locked: false,
        };
      }

      return obj;
    });

    return vals;
  }

  render() {
    const tags = this.getTags();
    const {
      input,
      focused,
      invalid,
      showOptions,
      showOverflowedTags,
      overflowedTags,
    } = this.state;

    let {
      options,
      readOnly,
      editable,
      minTags,
      maxTags,
      className,
      placeholder,
      swapLastValue,
      removeOnBackspace,
      cacheAsyncOptions,
      keepOptionsOpenAfterSelect,

      OptionComponent,
      NotificatorComponent,
    } = this.props;

    // If false, tags can't be added / removed
    readOnly = !!readOnly; // force boolean

    // Tags can be editable if "readyOnly" is "false" and "editable" is "true"
    const isEditable = !readOnly && !!editable; // force boolean

    // Remove tags on backspace / delete (if the content is empty)
    removeOnBackspace = !!removeOnBackspace; // force boolean

    // Keep the options list open after selection
    keepOptionsOpenAfterSelect = !!keepOptionsOpenAfterSelect; // force boolean

    // If "true" the asynchronous options will be preserved after the options
    // list gets unmounted, and rendered along with the static options on the
    // next mount.
    cacheAsyncOptions = !!(cacheAsyncOptions ?? true); // force boolean, default to true

    minTags = Number(minTags) || 0; // force integer

    // Check if we reached the max tags added
    const minTagsReached = minTags !== 0 ? tags.length == minTags : false;

    maxTags = Number(maxTags) || 0; // force integer

    // Check if we reached the max tags added
    const maxTagsReached = maxTags !== 0 ? tags.length >= maxTags : false;

    swapLastValue = !!swapLastValue; // force boolean

    // We must show the input only if the component is not in readOnly mode and
    // either
    // a) we haven't reached the maximum selected tags
    // b) "swapLastValue" is "true"
    const showInput = !readOnly && (!maxTagsReached || swapLastValue);

    // We must show the options list only if the current value of "showOptions"
    // is "true" and either
    // a) we haven't reached the maximum selected tags
    // b) "swapLastValue" is "true"
    const showOptionsList = showOptions && (!maxTagsReached || swapLastValue);

    placeholder = placeholder ?? "Type and press enter";

    // Customizable components
    OptionComponent = OptionComponent ? OptionComponent : Option;
    NotificatorComponent = NotificatorComponent ? NotificatorComponent : Notificator;

    return (
      <div
        ref={this.componentRef}
        className={`
          ${classSelectors.component}
          ${showOverflowedTags ? "showOverflowedTags" : ""}
          ${focused ? "focused" : ""}
          ${className}
        `}
      >

        <div className={classSelectors.mainWrapper}>

          <div
            className={`
              ${classSelectors.inputWrapper}
              ${invalid ? classSelectors.inputInvalid : ""}
              ${tags.length > 0 ? "has-selected-tags" : ""}
            `}
          >
            <div className={classSelectors.tags} ref={this.tagsRef}>
              {tags.map((tag, index) => (
                <Tag
                  key={tag.value}
                  tag={tag}
                  index={index}
                  editable={isEditable}
                  readOnly={readOnly || minTagsReached}
                  inputRef={this.inputRef}
                  update={(index, value) => this.updateTag(index, value)}
                  remove={index => this.removeTag(index)}
                  validator={value => this.validateTag(value)}
                  removeOnBackspace={removeOnBackspace}
                />
              ))}
            </div>

            {
              (overflowedTags > 0 && !showOverflowedTags) &&
              <div
                className={classSelectors.expander}
                onClick={() => this.setState({ showOverflowedTags: !showOverflowedTags })}
              >+ { overflowedTags }</div>
            }

            {showInput &&
              <input
                ref={this.inputRef}
                value={input}
                spellCheck="false"
                className={classSelectors.input}
                placeholder={placeholder}
                onFocus={(e) => this.onFocus(e)}
                onBlur={() => this.onBlur()}
                onChange={(e) => this.onInputChange(e)}
                onKeyDown={(e) => this.onInputKeyDown(e)}
                onClick={() => showOptionsList ? this.closeOptions() : this.openOptions()}
              />
            }
          </div> {/* </inputWrapper> */}

          {showOptionsList &&
            <Options
              tags={tags}
              cacheAsyncOptions={cacheAsyncOptions}
              asyncOptionsCacheStore={this.asyncOptionsCacheStore}
              options={options}
              filter={this.props.filter ?? filter}
              select={(value) => {
                this.addTag(value);

                if(!keepOptionsOpenAfterSelect) {
                  this.closeOptions();
                }
              }}

              OptionComponent={OptionComponent}
              NotificatorComponent={NotificatorComponent}
            ></Options>
          }

        </div> {/* mainWrapper */}

      </div>
    );
  }
}
