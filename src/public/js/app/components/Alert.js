import { h } from 'preact';

// ALERT
const Alert = props => {
	if (props.alertShow) {
		let classes = `alert flash-msg alert-${props.alertType}`;
		return (
			<div id='alerts'>
				<span className={classes} role='alert'>
					{props.alertMessage}
				</span>
			</div>
		);
	} else {
		return '';
	}
};

export default Alert;
