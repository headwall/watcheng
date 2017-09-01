
 function GetPageContent(url) {
 	var xhr = new XMLHttpRequest();
 	xhr.open("GET", url);
 	xhr.send();
 	xhr.onreadystatechange = function() {
 		// <----------------------------------------
 	}
 	console.log(xhr.status);
 	if (xhr.status != 200) {
 		return null;
 	} else {
 		r = xhr.response;
 		return r;
 	}
 	
 }

 function EpisodeExistance(url) {
 	var xhr = new XMLHttpRequest();
 	xhr.open("HEAD", url, false);
 	xhr.send();
 	console.log(`xhr.status(HEAD): ${xhr.status}`);

 	// xhr.open("GET", url, false);
 	// xhr.send();
 	// console.log(`xhr.status(GET): ${xhr.status}`);

 	if (xhr.status != 200) {
 		return false;
 	}
 	else {
 		return true;
 	}
 }

 function AXHRHandler() {

 }
 
 function ChangeEpisode(curPosition, direction) {
 	var curPos = JSON.parse(JSON.stringify(curPosition));
 	curPos["episode"] += direction;
 	console.log(JSON.stringify(curPos));
 	var nextEpisodeUrl = MakeEpisodeLink(curPos)
 	console.log(nextEpisodeUrl);
 	episodeExistanceFlag = EpisodeExistance(nextEpisodeUrl);
 	console.log(episodeExistanceFlag);
 	if (episodeExistanceFlag) {
 		return nextEpisodeUrl;
 	}
 	else {
 		curPos["episode"] = 1;
 		curPos["season"] += direction;
 		return MakeEpisodeLink(curPos);
 	}
 	return false;
 };
 
 function MakeEpisodeLink(curPos) {
	var BASE_URL = "https://watcheng.com/ru/show";
 	return `${BASE_URL}/${curPos["series"]}/season-${curPos["season"]}/episode-${curPos["episode"]}`;
 }

 var BASE_URL = "https://watcheng.com/ru/show";

 var curUrl = document.URL;
 var episodeUrlTemplate = /https:\/\/watcheng\.com\/ru\/show\/([\w-]*)\/season-([0-9]*)\/episode-([0-9]*)/;
 var episodeMeta = curUrl.match(episodeUrlTemplate);
 
 var seriesName = episodeMeta[1];
 var curSeason = episodeMeta[2];
 var curEpisode = episodeMeta[3];

 var curPosition = {
 	"series" : seriesName,
 	"season" : parseInt(curSeason),
 	"episode" : parseInt(curEpisode)
 };


 // ----------- Episode controls
 
 var mainSeriesUrl = `${BASE_URL}/${seriesName}`;

 var controlsDiv = document.createElement("div");
 controlsDiv.className = "episode__controls";

 var nextButton = document.createElement("div");
 nextButton.className = "episode__controls__next-button";
 var nextEpisodeUrl = ChangeEpisode(curPosition, 1);
 nextButton.innerHTML = `<a href="${nextEpisodeUrl}">></a>`;
 // nextButton.innerHTML = "<a href=\"" + nextEpisodeUrl + "\">" + ">" + "</a>";

 var prevButton = document.createElement("div");
 prevButton.className = "episode__controls__prev-button";
 var prevEpisodeUrl = ChangeEpisode(curPosition, -1);
 prevButton.innerHTML = `<a href="${prevEpisodeUrl}"><</a>`;
 // prevButton.innerHTML = "<a href=\"" + prevEpisodeUrl + "\">" + "<" + "</a>";

 controlsDiv.appendChild(prevButton);
 controlsDiv.appendChild(nextButton);

 var parentNode = document.getElementsByClassName("episode__wrap")[0];
 controlsPlace = document.getElementsByClassName("episode__release-date")[0];

 parentNode.insertBefore(controlsDiv, controlsPlace.nextSibling);

 var navBlock = document.createElement("div");
 navBlock.className = "navigation";
 var preloader = document.createElement("div");
 preloader.className = "preloader";
 navBlock.appendChild(preloader);
 var navigationPlace = document.getElementsByClassName("episode__controls")[0];
 parentNode.insertBefore(navBlock, navigationPlace.nextSibling);
 
 var mainPageContent = GetPageContent(mainSeriesUrl);
 if (mainPageContent == null) {
 	navBlock.innerHTML = "<p> Error </p>";
 } else {
	var div = document.createElement("div");
 	div.innerHTML = mainPageContent;
 	navBlock = div.getElementsByClassName("navigation")[0];
 }