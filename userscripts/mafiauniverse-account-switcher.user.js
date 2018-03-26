// ==UserScript==
// @name         MafiaUniverse Account Switcher
// @namespace    https://lxravine.github.io/
// @version      1.0
// @description  Conveniently swap between multiple accounts. Set usernames and passwords in top of the script.
// @author       annulus
// @match        https://www.mafiauniverse.com/*
// @grant        none
// ==/UserScript==

// don't run the script if there are less than two entries here. one of the entries should be your main account.
var usernames = ["username1", "username2", "username3"];
var passwords = ["password1", "password2", "password3"];

$(document).ready(function() {
	if ($(".isuser").length) { // if user is logged in
		var loggedInUsername = $(".welcomelink a").text();
		var loggedInIndex = usernames.indexOf(loggedInUsername);
		usernames.splice(loggedInIndex, 1);
		passwords.splice(loggedInIndex, 1);
		
		var selectedIndex = 0;
		var selectedUsername = usernames[selectedIndex];
		
		$(".isuser").html("<li class=\"welcomelink\" style=\"margin-right: 10px;\"><p id=\"swap-user\" class=\"aliased\" style=\"cursor: pointer\"></p></li>" + $(".isuser").html());
		var swapUser = $("#swap-user");
		swapUser.html("[" + selectedUsername + "]");
		
		var logoutButton = $(".isuser li:last a");
		var logoutURL = $(".isuser li:last a").attr("href");
		logoutButton.attr("onclick", "");
		logoutButton.attr("href", logoutURL + "&into=" + selectedUsername);
		
		$("body").on("click", "#swap-user", function() {
			selectedIndex++;
			selectedIndex = selectedIndex % (usernames.length + 1);
			selectedUsername = usernames[selectedIndex];
			
			var fullURL = logoutURL;
			
			if (selectedIndex == usernames.length) {
				selectedUsername = "none";
			} else {
				fullURL += "&into=";
				fullURL += selectedUsername;
			}
			
			$(".isuser li:last a").attr("href", fullURL);
			swapUser.html("[" + selectedUsername + "]");
		});
	} else {
		var url = new URL(window.location.href);
		var into = url.searchParams.get("into");
		
		if (into) {
			var username = into;
			var index = usernames.indexOf(username);
			var password = passwords[index];
			
			$("input[name=\"vb_login_username\"]").val(username);
			$("input[name=\"vb_login_password\"]").val(password);
			$("input[name=\"cookieuser\"]").click();
			$("input[type=\"submit\"]").click();
		}
	}
});