import React from "react";
import ReactDOM from "react-dom";
import ReactSelect3 from "../src/index";

const root = document.getElementById("root");

const OptionComponent = (props) => {
  return (
    <div style={{
      backgroundColor: props.option.value,
    }}>
      <span style={{
        filter: "invert(1)",
        mixBlendMode: "difference",
      }}>
        {`${props.option.label} (${props.option.value})`}
      </span>
    </div>
  )
}

const initialSettings = {
  options: [
    {label: "Green", value: "#66B132"},
    {label: "Blue-green", value: "#3E92CE"},
    {label: "Blue", value: "#3C47FE"},
    {label: "Blue-violet", value: "#3E02A4"},
    {label: "Violet", value: "#8601AF"},
    {label: "Red-violet", value: "#A7194B"},
    {label: "Red", value: "#F12815"},
    {label: "Red-orange", value: "#F2530B"},
    {label: "Orange", value: "#F49906"},
    {label: "Yellow-orange", value: "#F6BC02"},
    {label: "Yellow", value: "#FAFE33"},
    {label: "Yellow-green", value: "#D0EA2B"},

    (searchPattern) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if(!searchPattern) {
            resolve([]);
          } else {
            resolve([
              {label: searchPattern, value: searchPattern},
            ]);
          }
        }, 3000);
      });
    }
  ],
  onChange: (tags) => {},
  placeholder: "Type and press enter",
  maxTags: 10,
  editable: true,
  readOnly: false,
  removeOnBackspace: true,
  validator: null,
  keepOptionsOpenAfterSelect: false,
  OptionComponent: null,
};

function Example() {
  const [values, setValues] = React.useState([
    "#66B132", "#3E92CE",
  ]);
  const [settings, setSettings] = React.useState(initialSettings);
  console.log(values, settings);

  return (
    <div className="container pt-5" style={{maxWidth: "800px"}}>

      <h1>React Select5</h1>

      <div className="row mt-5">
        <div className="col">
          <ReactSelect3
            {...settings}
            values={values}
            onChange={(value) => setValues(value)}
          />
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-12  mb-3">
          <label htmlFor="placeholder" className="form-label">Placeholder</label>
          <input
            id="placeholder"
            className="form-control"
            type="text"
            value={settings.placeholder}
            onChange={(e) => setSettings({ ...settings, placeholder: e.target.value })}
          />
        </div>

        <div className="col-12 mb-3">
          <label htmlFor="maxtags" className="form-label">Max tags</label>
          <input
            id="maxtags"
            className="form-control"
            type="number"
            value={settings.maxTags}
            onChange={(e) => setSettings({ ...settings, maxTags: parseInt(e.target.value, 10) })}
          />
        </div>

        <div className="col-12 mb-3">
          <div className="form-check">
            <input
              id="editable"
              className="form-check-input"
              type="checkbox"
              checked={settings.editable}
              onChange={(e) => setSettings({ ...settings, editable: e.target.checked })}
            />
            <label className="form-check-label" htmlFor="editable">Editable</label>
          </div>
        </div>

        <div className="col-12 mb-3">
          <div className="form-check">
            <input
              id="readonly"
              className="form-check-input"
              type="checkbox"
              checked={settings.readOnly}
              onChange={(e) => setSettings({ ...settings, readOnly: e.target.checked })}
            />
            <label className="form-check-label" htmlFor="readonly">Read only</label>
          </div>
        </div>

        <div className="col-12 mb-3">
          <div className="form-check">
            <input
              id="keepOptionsOpenAfterSelect"
              className="form-check-input"
              type="checkbox"
              checked={settings.keepOptionsOpenAfterSelect}
              onChange={(e) => setSettings({ ...settings, keepOptionsOpenAfterSelect: e.target.checked })}
            />
            <label className="form-check-label" htmlFor="keepOptionsOpenAfterSelect">Keep options list open after selection</label>
          </div>
        </div>

        <div className="col-12 mb-3">
          <div className="form-check">
            <input
              id="removeonbackspace"
              className="form-check-input"
              type="checkbox"
              checked={settings.removeOnBackspace}
              onChange={(e) => setSettings({ ...settings, removeOnBackspace: e.target.checked })}
            />
            <label className="form-check-label" htmlFor="removeonbackspace">Remove on backspace</label>
          </div>
        </div>

        <div className="col-12 mb-3">
          <div className="form-check">
            <input
              id="validator"
              className="form-check-input"
              type="checkbox"
              checked={!!settings.validator}
              onChange={(e) => setSettings({ ...settings, validator: e.target.checked ? (val) => val.indexOf("@") !== -1 : null })}
            />
            <label className="form-check-label" htmlFor="validator">Custom validator (validate if input contains "@")</label>
          </div>
        </div>

        <div className="col-12 mb-3">
          <div className="form-check">
            <input
              id="OptionComponent"
              className="form-check-input"
              type="checkbox"
              checked={!!settings.OptionComponent}
              onChange={(e) => setSettings({ ...settings, OptionComponent: e.target.checked ? OptionComponent : null })}
            />
            <label className="form-check-label" htmlFor="OptionComponent">Custom "Option" component</label>
          </div>
        </div>

      </div>
    </div>
  );
}

ReactDOM.render(<Example/>, root);
