/**************************************************
** GAME VARIABLES
**************************************************/
var canvas,			// Canvas DOM element
ctx,			// Canvas rendering context
localPlayer;	// Local player

var x = 150;
var y = 75;
var name;
var myWordRef = new Firebase('https://gamewords.firebaseio.com/');
var myChatRef = new Firebase('https://typegamechat.firebaseio.com/');
var myUserRef = new Firebase('https://userson.firebaseio.com/');
var myHistoryRef = new Firebase('https://fastesthistory.firebaseio.com/');
var childRef;
var usersOnline;
var inGame = false;
var finishTimes = [];
var fastest;
var fastestName;
var fastestFinal;
var finalName;
var totalTime = 0;
var chosenWord;
var wordName;
var numCharacters = 0;
var wordsCompleted = 0;
var xRef;
var yRef;
var chatChildRef;
var currentdate = new Date(); 
var datetime = currentdate.getDate() + "/"
+ (currentdate.getMonth()+1)  + "/" 
+ currentdate.getFullYear() + "  "  
+ currentdate.getHours() + ":"  
+ currentdate.getMinutes() ;


/**************************************************
** GAME INITIALISATION
**************************************************/
function init() {
	childRef = myUserRef.child(name);
	currentdate  = new Date();
	datetime = currentdate.getDate() + "/"
	+ (currentdate.getMonth()+1)  +  "  "  
	+ currentdate.getHours() + ":"  
	+ currentdate.getMinutes() ;
	childRef.set(datetime);
	// Start listening for events
	setEventHandlers();
	// document.getElementById("scores").scrollTop = document.getElementById("scores").scrollHeight;
	// document.getElementById("players").scrollTop = document.getElementById("players").scrollHeight;
};


/**************************************************
** GAME EVENT HANDLERS
**************************************************/
function setEventHandlers(){

	// Window resize
	window.addEventListener("resize", onResize, false);
}


/**************************************************
** GAME DRAW
**************************************************/


function startGame()
{
	$("#Title").fadeOut(1500);
	$("#Start").fadeOut(1500);
	$("#Submit").fadeOut(1500);
	$("#timer").fadeIn(1500);
	$("#gameInput").fadeIn(1500);
	$("#highScore").fadeIn(1500);
	$('#gameInput').val("");
	findword();
}

function submitWord()
{
	document.getElementById("Title").innerHTML="Enter word to submit";
	$("#submitInput").fadeIn(1500);
	$("#Start").fadeOut(1500);
	$("#Submit").fadeOut(1500);
	$('#submitInput').keypress(function (e) {
		c = e.keyCode;
		switch (c) {
			// Controls
		case 13: // Enter
			var submit = $('#submitInput').val();
			if (submit.toLowerCase() == "menu" || submit.toLowerCase() == "restart")
			{
				document.getElementById("Title").innerHTML="TypeFast";
				$("#Title").fadeIn(1500);
				$("#Start").fadeIn(1500);
				$("#Submit").fadeIn(1500);
				$("#timer").fadeOut(1500);
				$("#submitInput").fadeOut(1500);
				$("#highScore").fadeOut(1500);
				$("#Word").fadeOut(1500);
				clearVariables();
			}
			else if (submit.toLowerCase().indexOf("fuck") > -1 || submit.toLowerCase().indexOf("nig") > -1)
			{
				$("#swear").css( "display", "initial" ).fadeOut( 1000 );
				$('#submitInput').val("");
			}
			else if ($('#submitInput').val() != "")
			{
				myWordRef.push({word: $('#submitInput').val(), fastest: 999999999, name: name});
				myHistoryRef.push({name: name, word: $('#submitInput').val(), type: "submit"});
				$("#submitInput").fadeOut(1500);
				startGame();
			}
			break;
		}
	});
}

function findword()
{

	myWordRef.on('value', function(dataSnapshot) {
		var wordIndex = Math.round((Math.random()*(dataSnapshot.numChildren()-1)));
		// document.getElementById("index").innerHTML=wordIndex;
		var index = 0;
		dataSnapshot.forEach(function(childSnapshot) {

			if (index == wordIndex)
			{
				if (chosenWord == childSnapshot.child('word').val())
				{
					index = 0;
					findword();
				}
				else
				{
					chosenWord = childSnapshot.child('word').val();
					fastest = childSnapshot.child('fastest').val();
					fastestName = childSnapshot.child('name').val();
					wordName = childSnapshot.name();
				}

			}
			index ++;

		});
		numCharacters += chosenWord.length;
		myWordRef.off();
		drawGame();
	});



}

function getTotalTime()
{
	for	(index = 0; index < finishTimes.length; ++index) {
		totalTime += finishTimes[index];
	}
}

function clearVariables()
{

	wordsCompleted = 0; //allow for first enter button
	finishTimes = [];
	totalTime = 0;
	numCharacters = 0;
	reset();
	$('#submitInput').val("");
	$('#gameInput').val("");
}

function drawGame()
{
	document.getElementById("Word").innerHTML=chosenWord;
	document.getElementById("highScore").innerHTML="Fastest Time: " + formatTime(fastest) + "<br>By: " + fastestName;
	$("#Word").fadeIn(1500);
	$("#gameInput").fadeIn(1500);
	

	$('#gameInput').focus(function () {
		start();
	});
	$('#gameInput').blur(function () {
		stop();
	});

	$('#gameInput').keypress(function (e) {
		c = e.keyCode;
		switch (c) {
			// Controls
		case 13: // Enter
			if ($('#gameInput').val() == "Menu")
			{
				$("#Title").fadeIn(1500);
				$("#Start").fadeIn(1500);
				$("#Submit").fadeIn(1500);
				$("#timer").fadeOut(1500);
				$("#gameInput").fadeOut(1500);
				$("#highScore").fadeOut(1500);
				$("#Word").fadeOut(1500);
				clearVariables();
			}

			else if (wordsCompleted == 6 && $('#gameInput').val().toLowerCase() == "restart")
			{
				clearVariables();
				reset();
				findword();
				start();
			}
			
			else if ($('#gameInput').val()== chosenWord)
			{
				
				if (wordsCompleted >=0)
				{
					
					var finishTime = formatTime(x.time());
					
					finishTimes[finishTimes.length] = x.time();     // adds a new element to finishTimes
					document.getElementById("players").innerHTML += chosenWord + " : " + finishTime + "<br>";
					$('#players')[0].scrollTop = $('#players')[0].scrollHeight;
					if (fastest > x.time())
					{
						currentdate = new Date(); 
						datetime = currentdate.getDate() + "/"
						+ (currentdate.getMonth()+1)  + "/" 
						+ currentdate.getFullYear() + "  "  
						+ currentdate.getHours() + ":"  
						+ currentdate.getMinutes() ;
						myWordRef.child(wordName).child('fastest').set(x.time());
						myWordRef.child(wordName).child('name').set(name);
						myHistoryRef.push({name: name, word: chosenWord, type: "score", date: datetime});
					}
					
				}
				wordsCompleted++;
				
				$('#gameInput').val("");
				
				if (wordsCompleted != 6)
				{
					reset();
					findword();
					start();
				}
				
				else
				{
					
					getTotalTime();
					document.getElementById("players").innerHTML += "Final Time: " + formatTime(totalTime) + "<br>Speed: " + (Math.round((totalTime/numCharacters) * 100) / 100) + " milliseconds/letter<br>";
					document.getElementById("Word").innerHTML = 'Type "Restart" to Restart';
					document.getElementById("highScore").innerHTML = "Fastest Typer: " + finalName + " <br>" + fastestFinal + " milliseconds/letter" ;
					if (fastestFinal > (Math.round((totalTime/numCharacters) * 100)/ 100))
					{
						currentdate = new Date(); 
						datetime = currentdate.getDate() + "/"
						+ (currentdate.getMonth()+1)  + "/" 
						+ currentdate.getFullYear() + "  "  
						+ currentdate.getHours() + ":"  
						+ currentdate.getMinutes() ;
						myHistoryRef.child('Fastest').remove();
						myHistoryRef.child('Fastest').set({name: name, time: (Math.round((totalTime/numCharacters) * 100)/ 100),type: "bestScore", date: datetime});
					}
					stop();
				}
				
			}
			else
			{
				
				$('#gameInput').val("");
				
			}
			break;
		}
	});

}


// Initialise the game
$('#nameInput').keypress(function (e) {
	if (e.keyCode == 13) {
		name = $('#nameInput').val();
		if (name.toLowerCase().indexOf("fuck") > -1 || name.toLowerCase().indexOf("nig") > -1)
		{
			$("#swear").css( "display", "initial" ).fadeOut( 1000 );
			$('#nameInput').val("");
		}
		else
		{
			$("#nameInput").fadeOut(1500);
			$("#Start").fadeIn(1500);
			$("#Submit").fadeIn(1500);
			$("#chatInput").fadeIn(1500);
			init();
		}
	}
});

myUserRef.on('value', function(dataSnapshot) {
	
	usersOnline = dataSnapshot.numChildren();

	document.getElementById("players").innerHTML += "Players online: " + usersOnline + "<br>";

});

lastMessagesQuery = myHistoryRef.endAt().limit(7);
lastMessagesQuery.on('child_added', function(childSnapshot) {
	var beatenWord = childSnapshot.child('word').val();
	var beatenName = childSnapshot.child('name').val();
	if (childSnapshot.child('type').val() == "score")
	{
		document.getElementById("players").innerHTML += beatenName + ' beat the record speed for ' + beatenWord + '<br>';
	}
	else if ( childSnapshot.child('type').val() == "bestScore")
	{
		fastestFinal = childSnapshot.child("time").val();
		finalName = childSnapshot.child("name").val();
		document.getElementById("players").innerHTML += beatenName + ' is now the fastest typer.<br>';
	}
	else
	{
		document.getElementById("players").innerHTML += beatenName + ' submitted ' + beatenWord + '<br>';
	}
});

function displayChatMessage(name, text, date) {

	$('<div/>').text(text).prepend($('<em/>').text(name+ ' ' + date + ' : ')).appendTo($('#scores'));
	$('#scores')[0].scrollTop = $('#scores')[0].scrollHeight;
};

//chat function
$('#chatInput').keypress(function (e) {
	if (e.keyCode == 13) {
		var text = $('#chatInput').val();
		currentdate  = new Date();
		datetime = currentdate.getDate() + "/"
		+ (currentdate.getMonth()+1)  +  "  "  
		+ currentdate.getHours() + ":"  
		+ currentdate.getMinutes() ;
		myChatRef.push({name: name, text: text , date: datetime});
		$('#chatInput').val('');
	}
});

myChatRef.on('child_added', function(snapshot) {
	var message = snapshot.val();
	
	document.title = "Donald Ngai - Message Recieved!";
	displayChatMessage(message.name, message.text, message.date);
	setTimeout(function() {	
		document.title = "Donald Ngai";
	},8000);
});



function playSound(){   
	document.getElementById("sound").innerHTML="<embed src='Facebook Pop.mp3' hidden=true autostart=true loop=false>";
}


//built in function, but deletes all my data, i only wanna delete one user
//myDataRef.onDisconnect().childRef.remove();
window.onbeforeunload = confirmExit;
function confirmExit()
{
	childRef.remove();
}

