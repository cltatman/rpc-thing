(function () {
  var make_server_interface = function () {
    var web_socket = new WebSocket('ws://' + location.host);
    var request_handlers = {};

    var handle_request = function (type, handler) {
      request_handlers[type] = handler;
    };

    var send_request = function (request, data) {
      var message = JSON.stringify({ request: request, data: data });
      web_socket.send(message);
    };

    web_socket.onmessage = function (event) {
      var message = JSON.parse(event.data);
      var respond = function (data) {
        send_request(message.request, data);
      };

      request_handlers[message.request](respond, message.data);
    };

    return {
      handle_request: handle_request,
      send_request: send_request
    };
  };


  var server_interface = make_server_interface();
  var on = server_interface.handle_request;


  { // the 'now check this out' feature
    var input = document.getElementById('the-input');
    var button = document.getElementById('the-go-button');

    on('what is b?', function (respond, data) {
      button.innerHTML = data.encouragement;

      button.onclick = function () {
        respond(parseInt(input.value));
      };
    });

    on('add these please my friend', function (respond, data) {
      respond(data.a + data.b);
    });

    on('now multiply these ones', function (respond, data) {
      respond(data.a * data.b);
    });

    on('proud of yourself?', function (respond, data) {
      alert('i said ' + data.you_said + '!');

      button.remove();
      input.remove();
    });
  }
})();
