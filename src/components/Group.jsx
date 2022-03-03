import { classSelectors } from "../utils/selectors";

export const Group = (props) => {
  return <span className={classSelectors.group}>{props.group}</span>
}