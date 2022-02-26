import React from "react";
import ReactDOM from "react-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.css";

import "../src/styles/index.scss";
import ReactTagInput from "../src/index";

const root = document.getElementById("root");

const initialSettings = {
  options: [
    {label: "Machine - 1", value: "machine-1"},
    {label: "Machine - 2", value: "machine-2"},
    {label: "Machine - 3", value: "machine-3"},
    {label: "Machine - 4", value: "machine-4"},
    {label: "Machine - 5", value: "machine-5"},
    {label: "Machine - 6", value: "machine-6"},
    {label: "Machine - 7", value: "machine-7"},
    {label: "Machine - 8", value: "machine-8"},
    {label: "Machine - 9", value: "machine-9"},
    {label: "Machine - 10", value: "machine-10"},
    {label: "Machine - 11", value: "machine-11"},
    {label: "Machine - 12", value: "machine-12"},
    {label: "Machine - 13", value: "machine-13"},
    {label: "Machine - 14", value: "machine-14"},
    {label: "Machine - 15", value: "machine-15"},
    {label: "Machine - 16", value: "machine-16"},
    {label: "Machine - 17", value: "machine-17"},
    {label: "Machine - 18", value: "machine-18"},
    {label: "Machine - 19", value: "machine-19"},
    {label: "Machine - 20", value: "machine-20"},

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
  validator: undefined,
  keepOptionsOpenAfterSelect: false,
};

function Example() {
  const [values, setValues] = React.useState([
    "machine-1", "machine-2",
  ]);
  const [settings, setSettings] = React.useState(initialSettings);
  console.log(values, settings);

  return (
    <div className="container pt-5" style={{maxWidth: "800px"}}>

      <h1>React Select3</h1>

      <div className="row mt-5">
        <div className="col">
          <ReactTagInput
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
              onChange={(e) => setSettings({ ...settings, validator: e.target.checked ? (val) => val.indexOf("@") !== -1 : undefined })}
            />
            <label className="form-check-label" htmlFor="validator">Custom validator (validate if input contains "@")</label>
          </div>
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(<Example/>, root);
