// YOUR CODE HERE:

class ChatterClient {
  constructor() {
    this.server = 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages';
    this.$chatFeed = $('#chats');
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
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: this.server + '?order=-updatedAt',
      type: 'GET',
      contentType: 'application/json',
      success: (data) => {
        // take care of bizzzness
        var results = data.results.reverse().filter(function(item) {
          return (item.hasOwnProperty('text') &&
            item.hasOwnProperty('roomname') &&
            item.hasOwnProperty('username'));
        });
        
        console.log(results);
        results.forEach((item) => {
          this.renderMessage(item);
        });
      },
      error: this.error
    });
  }
  clearMessages() {
    this.$chatFeed.empty();
  }
  renderMessage({username, text, roomname, updatedAt = 'The Beginning'}) {
    var $thing = $('<div></div>');

    var $userName = $(`<a href="#" class=".username" data-username="${username}">${username}:</a>`);
    $userName.on('click', (event) => this.handleUsernameClick(event.target));
    $thing.html($userName);
    
    var $text = $('<div class="userMessage"></div>');
    $text.append(document.createTextNode(text));
    // add time later
    $thing.append($text);

    this.$chatFeed.prepend($thing);
  }
  renderRoom(roomName) {
    var $optionThing = $(`<option value="${roomName}">${roomName}</option>`);
    $('#roomSelect').append($optionThing);
  }

  handleUsernameClick(userNode) {
    console.log($(userNode).data('username'));
  }
  handleSubmit(){

  }
}

$(function() {
  window.app = new ChatterClient();
});
