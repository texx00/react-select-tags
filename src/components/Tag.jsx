import React from "react";
import { classSelectors } from "../utils/selectors";

export class Tag extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      input: props.tag.value,
      invalid: false,
    };

    this.inputRef = React.createRef();
  }

  onBlur() {
    const { validator, update, remove, index } = this.props;
    const { input } = this.state;

    if(input) {
      if(validator(input)) {
        this.setState({ invalid: false });
        update(index, input);
      } else {
        this.setState({ invalid: true });
      }
    } else {
      remove(index);
    }
  }

  onKeyDown(e) {
    const { input } = this.state;
    const {
      validator,
      update,
      remove,
      index,
      removeOnBackspace,
      inputRef,
      tag,
    } = this.props;

    // On enter
    if(e.keyCode === 13) {
      // Prevent form submission if tag input is nested in <form>
      e.preventDefault();

      // Update input in tags list, if valid
      if(validator(input)) {
        this.setState({ invalid: false });
        update(index, input);
        inputRef.current.focus();
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

      // If input is blank, remove tag
      remove(index);

      inputRef.current.focus();
    }
    // On escape
    else if(e.keyCode === 27) {
      // If the current input value is different that the initial value, reset
      // it...
      if(this.state.input != tag.value) {
        this.setState({ input: tag.value });
      }
      // else, it means that the user hit Esc again (after resetting the input
      // to the initial value), so we should focus the main input
      else {
        inputRef.current.focus();
      }
    }
    // We can't assure if the input if valid or not, so mark it as invalid...
    else {
      this.setState({ invalid: false });
    }
  }

  render() {
    const { input, invalid } = this.state;
    const { tag, editable, readOnly, remove, index } = this.props;

    // The content of the tag should be editable only if we explicitly allowed editable tags and the tag itself
    // is not locked
    const isEditable = editable && !tag.__locked;

    return (
      <div className={`
        ${classSelectors.tag}
        ${tag.__locked || !editable ? classSelectors.tagLocked : ""}
        ${readOnly ? classSelectors.tagReadOnly : ""}
        ${invalid ? classSelectors.tagInvalid : ""}
      `}>
        <div className={classSelectors.tagWrapper}>

          <div className={classSelectors.contentWrapper}>
            <div className={classSelectors.tagContent}>
              { (tag.__locked ? tag.label : input) || "."}
            </div>

            {
              isEditable && (
                <input
                  ref={this.inputRef}
                  className={classSelectors.tagContent}
                  value={this.state.input}
                  onBlur={() => this.onBlur() }
                  onKeyDown={(e) => this.onKeyDown(e)}
                  onChange={(e) => this.setState({ input: e.target.value })}
                  spellCheck="false"
                />
              )
            }
          </div>

          {
            !readOnly && (
              <div
                className={classSelectors.tagRemove}
                onClick={(e) => remove(index)}
              ></div>
            )
          }
        </div>
      </div>
    );
  }
}
