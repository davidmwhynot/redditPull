/*

	title: index.js
	desc: Front-end js/react for app index (main) page
	author: David Whynot
	email: davidmwhynot@gmail.com
	Project: redditpull
	Created: 9/1/18
	Updated: 10/22/18

*/

import { h, render, Component } from 'preact';
import Hero from './components/Hero';
import Post from './components/Post';

/* XXX GLOBALS XXX */
let imgErrCnt = 0;

// MAIN
class App extends Component {
	state = {
		loggedIn: false,
		level: 0,
		sub: 'all',
		sort: 'hot',
		posts: [],
		lastPostName: '',
		loading: false,
		loadingId: 'loading',
		bottomListenerAttached: false,
		more: false
	};

	componentWillMount() {
		log('componentWillMount');
		this.pull('all', 'hot');
	}

	componentDidUpdate(prevProps, prevState) {
		log('componentDidUpdate');
		$('img').off();
		$('img').on('error', err => {
			log('img error count: ' + ++imgErrCnt);
			$('#' + err.target.id.substring()).remove();
		});
		let $grid = $('.posts-grid').masonry({
			itemSelector: '.card',
			percentPosition: true,
			gutter: 10
			// horizontalOrder: true
		});
		$grid.imagesLoaded().progress(() => {
			$grid.masonry('layout');
		});
		$grid.masonry('reloadItems');
		$grid.masonry('layout');
		if (!this.state.bottomListenerAttached) {
			inView('#bottom').on('enter', () => {
				log('bottom in view');
				log('this.state.loading');
				log(this.state.loading);
				if (!this.state.loading) {
					log2('requesting more');
					this.requestMore();
				}
			});
			this.setState({
				bottomListenerAttached: true
			});
		}
	}

	pull(sub, sort) {
		this.setState({
			loading: true,
			posts: [],
			sub: sub,
			sort: sort,
			loadingId: 'loading',
			more: true
		});
		let context = this;
		$.ajax({
			method: 'POST',
			url: '/reddit',
			dataType: 'json',
			data: {
				sub: sub,
				sort: sort
			},
			success: function(d) {
				context.setState({
					lastPostName: d[d.length - 1].name,
					posts: d,
					loading: false,
					loadingId: 'bottom'
				});
			}
		});
	}

	requestMore() {
		let context = this;
		if (this.state.lastPostName) {
			$.ajax({
				method: 'POST',
				url: '/reddit/more',
				dataType: 'json',
				data: {
					after: context.state.lastPostName,
					sub: context.state.sub,
					sort: context.state.sort
				},
				success: function(d) {
					let more = d[0];
					d = d[1];
					let oldPosts = context.state.posts;
					d.forEach(i => {
						oldPosts.push(i);
					});
					context.setState({
						lastPostName: oldPosts[oldPosts.length - 1].name,
						posts: oldPosts,
						more: more
					});
				}
			});
		}
	}

	render() {
		log('this.state.posts');
		log(this.state.posts);
		const ellipsis = (
			<div className='lds-css ng-scope'>
				<div
					style={{ width: 100 + '%', height: 100 + '%' }}
					className='lds-ellipsis'
				>
					<div>
						<div />
					</div>
					<div>
						<div />
					</div>
					<div>
						<div />
					</div>
					<div>
						<div />
					</div>
					<div>
						<div />
					</div>
				</div>
			</div>
		);
		return (
			<div>
				<Hero pull={this.pull.bind(this)} />
				<div className='m-2 posts-grid' id='posts'>
					{this.state.loading
						? ''
						: this.state.posts.map((post, i) => <Post key={i} post={post} />)}
				</div>
				<div id={this.state.loadingId}>{ellipsis}</div>
			</div>
		);
	}
}

render(<App />, document.getElementById('app'));
