// ==UserScript==
// @name		MafiaUniverse Spoiler Opener
// @namespace	https://lxravine.github.io/
// @version		1.0
// @description	Automatically open nested spoilers.
// @author		annulus
// @match		https://www.mafiauniverse.com/*
// @grant		none
// ==/UserScript==

document.body.addEventListener("click", function(event) {
	if (event.target.matches(".spoilerButton")) {
		openChildren(event.target.nextSibling);
	}
});

function openChildren(element) {
	for (var i = 0; i < element.children.length; i++) {
		if (element.children[i].matches(".spoilerButton")) {
			element.children[i].click();
		} else if (!element.children[i].matches(".spoilerContent")) {
			openChildren(element.children[i]);
		}
	}
}