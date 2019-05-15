import { h, Component } from 'preact';

// POSTHEADER
class PostHeader extends Component {
	render() {
		let i = this.props.post;
		let postUrl = `https://www.reddit.com${i.permalink}`;
		let subUrl = `https://www.reddit.com/r/${i.subreddit}`;
		return(
			<div className="card-header">
				<h4><span className="text-info font-weight-bold">{i.score}</span> | <a target="_blank" href={postUrl}>{i.title}</a></h4>
				<p><a target="_blank" href={subUrl} className="text-muted">/r/{i.subreddit}</a></p>
			</div>
		);
	}
}

export default PostHeader;