// ==UserScript==
// @name		MafiaUniverse Account Switcher
// @namespace	https://lxravine.github.io/
// @version		1.1
// @description	Conveniently swap between multiple accounts. Set usernames and password hashes in top of the script.
// @author		annulus
// @match		https://www.mafiauniverse.com/*
// @grant		none
// ==/UserScript==

// don't run the script if there are less than two entries here. one of the entries should be your main account. passwords must be hashed using md5
var usernames = ["username1", "username2", "username3"];
var passwordHashes = ["passwordHash1", "passwordHash2", "passwordHash3"];

// redirect with post data https://stackoverflow.com/a/23347763
$.extend({
	redirectPost: function(location, args) {
		var form = '';
		$.each(args, function(key, value) {
			value = value.split('"').join('\"')
			form += '<input type="hidden" name="'+key+'" value="'+value+'">';
		});
		$('<form action="' + location + '" method="POST">' + form + '</form>').appendTo($(document.body)).submit();
	}
});

$(document).ready(function() {
	if ($(".isuser").length) { // if user is logged in
		var loggedInUsername = $(".welcomelink a").text();
		var loggedInIndex = usernames.indexOf(loggedInUsername);
		usernames.splice(loggedInIndex, 1);
		passwordHashes.splice(loggedInIndex, 1);
		
		var selectedIndex = 0;
		var selectedUsername = usernames[selectedIndex];
		
		$(".isuser").html("<li class=\"welcomelink\" style=\"margin-right: 10px;\"><p id=\"swap-user\" class=\"aliased\" style=\"cursor: pointer\"></p></li>" + $(".isuser").html());
		var swapUser = $("#swap-user");
		swapUser.html("[" + selectedUsername + "]");
		
		var logoutButton = $(".isuser li:last a");
		var logoutURL = $(".isuser li:last a").attr("href");
		logoutButton.attr("onclick", "");
		logoutButton.attr("href", logoutURL + "&into=" + selectedUsername);

		// fix broken vbulletin notifications menu
		var factory = new PopupFactory();
		factory.register(document.getElementById("yui-gen1"));
		
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
			var passwordHash = passwordHashes[index];
			
			$.redirectPost("https://www.mafiauniverse.com/forums/login.php?do=login", {
				cookieUser: "1",
				do: "login",
				s: "",
				securityToken: "guest",
				vb_login_md5password: passwordHash,
				vb_login_md5password_utf: passwordHash,
				vb_login_password: "",
				vb_login_password_hint: "Password",
				vb_login_username: username,
			});
		}
	}
});