// YOUR CODE HERE:

class ChatterClient {
  constructor() {
    this.server = 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages';
    this.$chatFeed = $('#chats');
    this.user = {users: []};
  }
  init() {
    
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
        console.log('chatterbox: Message sent');
      },
      error: this.error
    });
  }
  fetch() {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        // take care of bizzzness 
      },
      error: this.error
    });
  }
  clearMessages() {
    this.$chatFeed.empty();
  }
  renderMessage(message) {
    var $thing = $('<p></p>');
    $thing.html(JSON.stringify(message));
    this.$chatFeed.append($thing);
  }
  renderRoom(roomName) {
    var $optionThing = $(`<option value="${roomName}">${roomName}</option>`);
    $('#roomSelect').append($optionThing);
  }
}

$(function() {
  window.app = new ChatterClient();
});
