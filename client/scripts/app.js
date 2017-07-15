// YOUR CODE HERE:

class ChatterClient {
  constructor() {
    this.server = 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages' + '?order=-updatedAt';
    this.$batFeed = $('#chats');
    this.user = {users: []};

    this.init();
  }
  init() {
    this.fetch();
  }
  _error(data) {
    // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
    console.error('chatterbox: Failed to send message', data);
  } 
  send(message) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log(data);
      },
      error: this.error
    });

    this.renderMessage(message);
  }
  fetch() {
    $('.spinner').show();
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'GET',
      contentType: 'application/json',
      success: (data) => {
        // take care of bizzzness
        var results = data.results.reverse().filter(function(item) {
          return (item.hasOwnProperty('text') && item.text &&
            item.hasOwnProperty('roomname') &&
            item.hasOwnProperty('username'));
        });
        
        console.log(results);
        results.forEach((item) => {
          this.renderMessage(item);
        });

        $('.spinner').hide();
      },
      error: this.error
    });
  }
  clearMessages() {
    this.$batFeed.empty();
  }
  renderMessage({username, text, roomname, updatedAt = 'The Beginning'}) {
    var $batSignal = $('<div></div>');

    var $userName = $(`<a href="#" class="username" data-username="${username}">${username}:</a>`);
    $userName.on('click', (event) => {
      this.handleUsernameClick(event.target);
      event.preventDefault();
    });

    $batSignal.html($userName);
    
    var $text = $('<div class="userMessage"></div>');
    $text.append(document.createTextNode(text));
    // add time later
    $batSignal.append($text);
    $batSignal.addClass('chat');
    this.$batFeed.prepend($batSignal);
  }
  renderRoom(roomName) {
    var $optionThing = $(`<option value="${roomName}">${roomName}</option>`);
    $('#roomSelect').append($optionThing);
  }

  handleUsernameClick(userNode) {
    $(userNode).toggleClass('friend');
  }
  handleSubmit() {
    var batText = $('#message').val();
    var batRoom = $('#roomSelect').val();
    var batName = window.location.search.split('=')[1];
    this.send({username: batName, roomname: batRoom, text: batText});
    console.log(batName, batText, batRoom);
    
  }
}

$(function() {
  window.app = new ChatterClient();
  $('#send').on('submit', (event) => {
    app.handleSubmit();
    event.preventDefault();
  });
});
