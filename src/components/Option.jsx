import { classSelectors } from "../utils/selectors";

export const Option = (props) => {
    return <span className={classSelectors.option}>{props.option.label}</span>
}