import { h, Component } from 'preact';
import Header from './Header';
import Input from './Input';
import Alert from './Alert';

// HERO
class Hero extends Component {
	state = {
		alertShow: false,
		alertMessage: '',
		alertType: ''
	};

	constructor(props) {
		super();
	}

	pull(sub, sort) {
		if (sub == '') {
			this.setState({
				alertShow: true,
				alertMessage: 'Please enter a subreddit name',
				alertType: 'warning'
			});
		} else {
			this.setState({
				alertShow: false,
				alertMessage: '',
				alertType: ''
			});
			this.props.pull(sub, sort);
		}
	}

	render() {
		return (
			<div className='card text-center' id='hero'>
				<Header />
				<div className='card-body container mt-3 p-0 pb-4 px-4 px-sm-0 mx-auto'>
					<Input pull={this.pull.bind(this)} />
					<Alert
						alertShow={this.state.alertShow}
						alertMessage={this.state.alertMessage}
						alertType={this.state.alertType}
					/>
				</div>
			</div>
		);
	}
}

export default Hero;
