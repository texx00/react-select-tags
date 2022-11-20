import { classSelectors } from "../utils/selectors";

export const Notificator = (props) => {
  const { loading, options } = props;

  if(loading) {
    return (
      <div className={classSelectors.loader}>
        <div className={classSelectors.spinner}></div>
        <div>Some options are still loading, please wait...</div>
      </div>
    );
  }

  if(!loading && options.length === 0) {
    return (
      <div className={classSelectors.message}>
        <div>There are no options</div>
      </div>
    );
  }

  return "";
}