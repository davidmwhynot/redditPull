import { h, Component } from 'preact';
import PostHeader from './PostHeader';

// POST
class Post extends Component {
	constructor(props) {
		super();
		this.state = {
			post: props.post
		};
	}

	textPost() {
		let i = this.state.post;
		return (
			<div
				className='card-body txt-card'
				dangerouslySetInnerHTML={{ __html: marked(i.selftext || '') }}
			/>
		);
	}

	urlImagePost() {
		let i = this.state.post;
		let linkId = `a_${i.name}`;
		let imgId = `img_${i.name}`;
		return (
			<a id={linkId} target='_blank' href={i.url}>
				<img id={imgId} src={i.url} />
			</a>
		);
	}

	thumbnailImagePost() {
		let i = this.state.post;
		let linkId = `a_${i.name}`;
		let imgId = `img_${i.name}`;
		let linkUrl = i.url;
		let imgUrl = '';
		let addButton = false;

		let hasPreview = i.preview != undefined;
		let isRedditMedia = i.domain == 'v.redd.it';

		if (hasPreview) {
			let hasVideoPreview = i.preview.reddit_video_preview != undefined;
			let hasPreviewImages = i.preview.images[0].resolutions[0] != undefined;

			if (hasPreviewImages) {
				imgUrl =
					i.preview.images[0].resolutions[
						i.preview.images[0].resolutions.length - 1
					].url;
				if (isRedditMedia || hasVideoPreview) {
					addButton = true;
					// if(isRedditMedia) {
					// 	linkUrl += '/DASH_2_4_M';
					// }
				}
			} else {
				imgUrl = i.thumbnail;
			}
			if (i.post_hint.includes('video')) {
				// TODO
				addButton = true;
			}
		} else {
			imgUrl = i.thumbnail;
		}
		return (
			<a
				id={linkId}
				target='_blank'
				href={linkUrl}
				className={addButton ? 'gif-overlay' : ''}
			>
				<img id={imgId} src={imgUrl} />
				{addButton ? <button className='playbutton' /> : ''}
			</a>
		);
	}

	render() {
		let i = this.state.post;
		// determine post type
		// use selftext
		let textPost = i.selftext != '';

		// use url
		let selfThumbnail = i.thumbnail == 'self';
		let defaultThumbnail = i.thumbnail == 'default';
		let noThumbnail = !selfThumbnail && !defaultThumbnail;
		let imageHint = i.post_hint == 'image';
		let imgPost = noThumbnail && imageHint;

		// everything left over
		let theRest = !textPost && !imgPost && !selfThumbnail;
		if (theRest) {
			log2('\n\n');
			log2('i');
			log2(i);
			log2('i.thumbnail');
			log2(i.thumbnail);
			log2('i.preview');
			log2(i.preview);
			if (i.preview) {
				log2('i.preview.reddit_video_preview');
				log2(i.preview.reddit_video_preview);
			}
		}
		// log('\n\n\ni');
		// log(i);
		// log('conflict');
		// log(conflict);
		// log('textPost');
		// log(textPost);
		// log('imgPost');
		// log(imgPost);
		return (
			<div id='{i.name}' className='card border-primary mb-2'>
				<PostHeader post={i} />
				{textPost ? this.textPost() : ''}
				{imgPost ? this.urlImagePost() : ''}
				{theRest ? this.thumbnailImagePost() : ''}
			</div>
		);
	}
}

export default Post;
