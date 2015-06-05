/**************************************************
** GAME VARIABLES
**************************************************/
var canvas,			// Canvas DOM element
	ctx,			// Canvas rendering context
	localPlayer;	// Local player
	
var x = 150;
var y = 75;
var name;
var myDataRef = new Firebase('https://intense-fire-4089.firebaseio.com/');
var myChatRef = new Firebase('https://chatcontainer.firebaseio.com/');
var childRef;
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
	// Declare the canvas and rendering context
	canvas = document.getElementById("gameCanvas");
	ctx = canvas.getContext("2d");
	$(canvas).fadeIn(1500);
	// Maximise the canvas
	canvas.width = window.innerWidth- 25;
	canvas.height = window.innerHeight-180;

	// Calculate a random start position for the local player
	// The minus 5 (half a player size) stops the player being
	// placed right on the egde of the screen
	var startX = Math.round(Math.random()*(canvas.width-5)),
		startY = Math.round(Math.random()*(canvas.height-5));
			childRef = myDataRef.child(name);
			xRef = childRef.child('x');
			yRef = childRef.child('y');
			xRef.set(startX);
			yRef.set(startY);

	// Start listening for events
	setEventHandlers();
	x=startX;
	y=startY;
	draw();
	
};


/**************************************************
** GAME EVENT HANDLERS
**************************************************/
function setEventHandlers(){
	// Keyboard
	window.addEventListener("keydown", onKeydown, false);
	window.addEventListener("keyup", onKeyup, false);

	// Window resize
	window.addEventListener("resize", onResize, false);
}

// Keyboard key down
function onKeydown(e) {

		c = e.keyCode;
		switch (c) {
			// Controls
			case 37: // Left
				x-=6;
				draw();
				ctx.fillText("Left",10,10);
				xRef.set(x);
				break;
			case 38: // Up
				y-=6;
				draw();
				ctx.fillText("Up",10,10);
				yRef.set(y);
				break;
			case 39: // Right
				x+=6;
				draw();// Will take priority over the left key
				ctx.fillText("Right",10,10);
				xRef.set(x);
				break;
			case 40: // Down
				y+=6;
				draw();	
				ctx.fillText("Down",10,10);
				yRef.set(y);
				break;
		};
		
		xRef.on('value', function(snapshot) {

});
		
};

// Keyboard key up
function onKeyup(e) {
};

// Browser window resize
function onResize(e) {
	// Maximise the canvas
	canvas.width = window.innerWidth-100;
	canvas.height = window.innerHeight-100;
	draw();
};


/**************************************************
** GAME DRAW
**************************************************/
function draw() {
	// Wipe the canvas clean
	
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "#FF0000";
	
			
ctx.fillRect(x,y,100,100);

myDataRef.on('value', function(dataSnapshot) {

ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "#FF0000";
ctx.fillRect(x,y,100,100);

 dataSnapshot.forEach(function(childSnapshot) {
 ctx.fillStyle = "#000";
  var childX = childSnapshot.child('x').val();
  var childY = childSnapshot.child('y').val();
    //document.getElementById("caption").innerHTML += ;
   // document.getElementById("caption").innerHTML += childY + " ";
   if (childSnapshot.name() != name)
   {
   ctx.fillRect(childX,childY,100,100);
   }
});
	});	

};

// Initialise the game
		$('#nameInput').keypress(function (e) {
        if (e.keyCode == 13) {
          name = $('#nameInput').val();
		  
		  document.getElementById("nameInput").style.display="none";
		  document.getElementById("messageInput").style.display="initial";
		  
		  init();
        }
      });
	  
	  //Chat Box Code
	  
      $('#messageInput').keypress(function (e) {
        if (e.keyCode == 13) {
		
        var text = $('#messageInput').val();
		
		myChatRef.push({name: name, text: text});
          // myChatRef.push({name: names, text: text});
          $('#messageInput').val('');
        }
      });
	  
       myChatRef.on('child_added', function(snapshot) {
        var message = snapshot.val();
        displayChatMessage(message.name, message.text);
      });
	  
      function displayChatMessage(names, text) {
        $('<div/>').text(text).prepend($('<em/>').text(names+ ' ' + datetime + ' : ')).appendTo($('#messagesDiv'));
        $('#messagesDiv')[0].scrollTop = $('#messagesDiv')[0].scrollHeight;
      };
	
	//built in function, but deletes all my data, i only wanna delete one user
	//myDataRef.onDisconnect().childRef.remove();
 window.onbeforeunload = confirmExit;
  function confirmExit()
  {
  childRef.remove();
  }