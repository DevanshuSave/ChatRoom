// Require the packages we will use:
var http = require("http"),
	socketio = require("socket.io"),
	fs = require("fs");
 
// Listen for HTTP connections.  This is essentially a miniature static file server that only serves our one file, client.html:
var app = http.createServer(function(req, resp){
	// This callback runs when a new connection is made to our HTTP server.
 
	fs.readFile("client.html", function(err, data){
		// This callback runs when the client.html file has been read from the filesystem.
 
		if(err) return resp.writeHead(500);
		resp.writeHead(200);
		resp.end(data);
	});
});
app.listen(3456);

// Do the Socket.IO magic:
var io = socketio.listen(app);
// Structure refered from https://github.com/sterlingrollins/CSE330/
var clients = [];
rooms = {{home:{"members":[],	"master":null, "pwd":null, "banned_users":[]}};
io.sockets.on("connection", function(socket){
	// This callback runs when a new Socket.IO connection is established.
	var userObject = null;
	var server_user = null;
	var myRoom = "home";
	
	socket.on('message_to_server', function(data) {
		// This callback runs when the server receives a new message from the client.
		myData = data['room'];
		console.log("message: "+data["message"]); // log it to the Node.JS output
		for (var i = 0; i < clients.length; i++) {
			if (clients[i].room == message_room) {
				id = clients[i].id;
				//Do not broadcast
				io.to(id).emit("message_to_client",{ message:data["message"], user:data['user'] });
			}
		}
	});
	
	socket.on('private_msg', function(data) {
		slave = data['slave'];
		pm = data['msg'];
		recipient = null;
		master = data['master'];
		
		for (var i = 0; i < clients.length; i++ ) {
			if (clients[i].username == slave) {
				recipient = clients[i].id;
			}
		}
		if (recipient != null) {
			io.sockets.connected[recipient].emit("pm", {pm:pm, master:master});
		}
	});
	
	
	//User login
	socket.on('in',function(data){
		server_user = {'username':data['user'], 'id':socket.id, 'room':"home"};
		rooms.home.members.push(server_user);
		myRoom = "home";
		clients.push(server_user); //={"id":socket.id,"cur_room":"home"};
		io.sockets.emit("display_newUsers", {room:'home', users:rooms.home.members});
		var my_rooms = Object.keys(rooms);
		io.sockets.emit('display_newRoom', {rooms:my_rooms, masater: null});
		//socket.emit("user_join_callback" , {user:server_user, success:true});
		console.log('Login by '+data['user']);
	});
	
	//User logout
	//Code from https://github.com/sterlingrollins/
	socket.on('out', function(data) {
		var temp_user = new_user.username;
		var userObject = null;
		for (var i= 0; i < clients.length;i++) {
			if( clients[i].id==socket.id ) {
				userObject = clients[i];
			}
			//
			var count = clients.indexOf(userObject);
			if(count > -1) {
				clients.splice(count,1);
			}
		}
		userObject = null;
		var room_keys = Object.keys(rooms);
		var room_index = -1;
		the_room = null;
		var user_room = null;
		for (var i = 0; i<room_keys.length; i++) {
			if(room_keys[i] == current_room) {
				room_index = i;
				the_room = room_keys[i];
			}
		}
		user_room = rooms[the_room];
		for (var i = 0; i<user_room.members.length; i++) {
			if(user_room.members[i].id ==socket.id) {
				userObject = user_room.members[i]; 
			}
			var roomIndex = user_room.members.indexOf(userObject);
			if(roomIndex >-1) {
				user_room.members.splice(roomIndex,1);
			}

		}
 
		//socket.emit('user_logout_callback', {success:true});
		io.sockets.emit('display_users', {room:the_room, users:rooms.home.members});
	});
	
	socket.on('new_public', function(data){
		rooms[data.room_name] = {"members":[],"master":data.master,"pwd":null,"banned_users":[]};
		list_rooms = Object.keys(rooms);
		io.sockets.emit('display_newRoom', {rooms:list_rooms, master: data.master});	
		console.log("User - " + data.master + "created a new public room - " + data.room_name);
	});
	
	socket.on('new_private', function(data){
		rooms[data.room_name] = {"members":[],"master":data.master,"pwd":null,"banned_users":[]};
		list_rooms = Object.keys(rooms);
		io.sockets.emit('display_newRoom', {rooms:list_rooms, master: data.master});	
		console.log("User - " + data.master + "created a new private room - " + data.room_name + "with password" + data.pwd);
	});
	
	socket.on('kick', function(data) {
		var room = data['room'];
		var master = data['master'];
		var slave = data['slave'];
		var room = rooms[room_name];
		var temp_master = room.admin;
		if (temp_master == master) {
			var temp = null;
			for (var i = 0; i<clients.length; i++) {
				if (slave == clients[i].username) {
					temp = clients[i];
					break;
				}
			}
				
		for (var i =0; i<clients.length; i++) {
			if(clients[i] != null) {
			if(clients[i].id == banned_user.id) {
				userObject = clients[i];
				console.log("the userObject got set, userObject.username = " +  userObject.username);
			}}
		}
		userObject.room = 'lobby_room';
		
		var room_keys = Object.keys(rooms);
		console.log("Room keys is:");
		console.log(room_keys);
		var old_room_index = -1;
		var old_key_room = null;
		var old_room = room_name;
		console.log("old_room_index is " + old_room_index);
		for (var i = 0; i<room_keys.length; i++) {
			//var currRoom = room_keys[i]
			if(room_keys[i] == old_room) {
				old_room_index = i;
				old_key_room = room_keys[i];
				//user_room = currRoom;
				//console.log("typeof currRoom is " + typeof(currRoom));
			}
		}
		console.log("old_room_index is " + old_room_index);
		var old_user_room = rooms[old_key_room];
		console.log("old_user_room is ");
		console.log(old_user_room);
		//console.log("old_user_room.members is" + old_user_room.members);
		
		var new_user_room = rooms['home'];
		new_user_room.members.push(userObject);
		console.log("new_user_room.members is " + new_user_room.members);
		
		
		//iterate through the room, remove the user when you find them by id
		for (var i = 0; i<old_user_room.members.length; i++) {
			if(old_user_room.members[i].id == banned_user.id) {
				userObject = old_user_room.members[i]; 
			}
			var roomIndex = old_user_room.members.indexOf(userObject);
			if(roomIndex > -1) {
				old_user_room.members.splice(roomIndex,1);
			}

		}
		io.sockets.connected[banned_user.id].emit('public_room_switch', {new_room:'home'});
		io.sockets.connected[banned_user.id].emit('kick_call_back', {success:true, room:room_name});
		io.sockets.emit('update_users_list', {room:old_key_room, users:old_user_room.members});
		
		} else {return;}
	
			
					console.log("the kicked user did switch rooms!");
					io.sockets.emit('update_users_list', {room:'home', users:new_user_room.members});
	
	
	});
	
	socket.on('ban', function(data) {
		var room = data['room'];
		var master = data['master'];
		var slave = data['slave'];
		var room = rooms[room_name];
		var temp_master = room.admin;
		
		if (temp_master == master) {
			var banned_user = null;
			for (var i = 0; i<clients.length; i++) {
				if (slave == clients[i].username) {
					banned_user = clients[i];
					break;
				}
			}
			
		for (var i =0; i<clients.length; i++) {
			if(clients[i].id == banned_user.id) {
				userObject = clients[i];
				console.log("the userObject got set, userObject.username = " +  userObject.username);
			}
		}
		userObject.room = 'home';
		
		//find the index of the user's old room in the rooms object/array
		var room_keys = Object.keys(rooms);
		console.log("Room keys is:");
		console.log(room_keys);
		var old_room_index = -1;
		var old_key_room = null;
		var old_room = room_name;
		console.log("old_room_index is " + old_room_index);
		for (var i = 0; i<room_keys.length; i++) {
			if(room_keys[i] == old_room) {
				old_room_index = i;
				old_key_room = room_keys[i];
			}

		}
		console.log("old_room_index is " + old_room_index);
		var old_user_room = rooms[old_key_room];
		console.log("old_user_room is ");
		console.log(old_user_room);		
		

		var new_user_room = rooms['home'];
		new_user_room.members.push(userObject);
		console.log("new_user_room.members is " + new_user_room.members);
		
		//iterate through the room, remove the user when you find them by id
		for (var i = 0; i<old_user_room.members.length; i++) {
			if(old_user_room.members[i].id == banned_user.id) {
				userObject = old_user_room.members[i]; 
			}
			var roomIndex = old_user_room.members.indexOf(userObject);
			if(roomIndex > -1) {
				old_user_room.members.splice(roomIndex,1);
			}

		}
		io.sockets.connected[banned_user.id].emit('public_room_switch', {new_room:'home'});
		io.sockets.connected[banned_user.id].emit('ban_call_back', {success:true, room:room_name});
		io.sockets.emit('update_users_list', {room:old_key_room, users:old_user_room.members});
		

			room.banned.push(banned_user);
		} else {return;}
					console.log("the banned user did switch rooms!");
					io.sockets.emit('update_users_list', {room:'home', users:new_user_room.members});
		
	});
});
