// INPUT
import { h, Component } from 'preact';

class Input extends Component {
	state = {
		sub: '',
		sort: 'hot'
	};

	constructor(props) {
		super();
	}

	pull() {
		log(this.state.sub);
		log(this.state.sort);
		this.props.pull(this.state.sub, this.state.sort);
	}

	input(event) {
		this.setState({
			sub: event.target.value
		});
	}

	select(event) {
		this.setState({
			sort: event.target.value
		});
	}

	render() {
		let inputHtml;
		return (
			<div id='input' className='input-group'>
				<input
					onChange={event => this.input(event)}
					value={this.state.sub}
					id='sub'
					className='form-control form-control-lg'
					type='text'
					placeholder='Subreddit to pull...'
				/>
				<div className='input-group-append'>
					<select
						onChange={event => this.select(event)}
						value={this.state.sort}
						id='sort'
						className='form-control form-control-lg'
					>
						<option value='hot'>Hot</option>
						<option value='new'>New</option>
						<option value='top'>Top</option>
						<option value='controversial'>Controversial</option>
						<option value='rising'>Rising</option>
					</select>
					<button
						onClick={() => this.pull()}
						id='submit'
						className='btn btn-primary px-3'
					>
						Pull
					</button>
				</div>
			</div>
		);
	}
}

export default Input;
