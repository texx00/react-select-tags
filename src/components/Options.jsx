import React from "react";
import { classSelectors } from "../utils/selectors";

export class Options extends React.Component {
  constructor(props) {
    super(props);

    const { options } = this.props;

    this._isMounted = false;

    this.state = {
      filter: "",
      asyncFns: options.filter(opt => typeof opt == "function"),
      asyncOptions: [],
      loading: false,
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.loadAsyncOptions();
  }

  componentWillUnmount() {
    this._isMounted = false;
 }

  loadAsyncOptions(searchPattern) {
    const { asyncFns } = this.state;

    this.setState({ loading: true });

    Promise.all(asyncFns.map(fn => fn(searchPattern))).then(data => {
      data = data.reduce((v, a) => v.concat(a), []);

      this._isMounted && this.setState({
        asyncOptions: data,
        loading: false,
      });
    });
  }

  render() {
    const { options } = this.props;

    const { asyncOptions, loading } = this.state;

    const opts = options.filter(opt => typeof opt != "function").concat(asyncOptions);

    return (
      <div className={classSelectors.optionsWrapper}>

        <div className={classSelectors.filter}>
          <input
            placeholder="Search..."
            value={this.state.filter}
            onChange={(e) => {
              this.setState({ filter: e.target.value });
              this.loadAsyncOptions(e.target.value);
            }}
          />
        </div>

        { loading &&
          <div className={classSelectors.loader}>
            <div className="spinner"></div>
            <div>Some options are still loading, please wait...</div>
          </div>
        }

        {
          (!loading && opts.length == 0) ? (
            <div className={classSelectors.message}>
              <div>There are no options</div>
            </div>
          ) : ""
        }

        <div className={classSelectors.options}>
          {
            this.props.filter(opts, this.state.filter).map(option => {
              return (
                <div
                  key={option.value}
                  className={classSelectors.option}
                  onClick={() => this.props.select(option.value)}
                >
                  {option.label}
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}