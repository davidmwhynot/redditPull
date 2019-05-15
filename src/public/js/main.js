/*

	title: main.js
	desc: Front-end javascript for redditpull app
	author: David Whynot
	email: davidmwhynot@gmail.com
	Project: redditpull
	Created: 9/1/18
	Updated: 10/22/18

*/

/* XXX GLOBALS XXX */

/* XXX EVENTS XXX */

/* XXX CLICK HANDLERS XXX */

/* XXX KEY HANDLERS XXX */

/* XXX FUNCTIONS XXX */
function alertFactory(input, type, span = false) {
	let elementType = span ? 'span' : 'div';
	return `<${elementType} class="alert flash-msg alert-${type}" role="alert">${input}</${elementType}>`;
}

function formTextFactory(input, type, area) {
	return `<small class="text-${type} form-text pw-${area}">${input}</small>`;
}

function log(s) {
	console.log(s);
}

function log2(s) {
	// console.log(s);
}
