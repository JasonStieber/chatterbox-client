// YOUR CODE HERE:

class ChatterClient {
  constructor() {
    this.server = 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages' + '?order=-updatedAt&limit=1000' ;
    this.$batFeed = $('#chats');
    this.user = {users: []};

    this.init();
  }
  init() {
    this.clearMessages();
    this.fetch();

    setTimeout(() => this.init(), 15000);
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
            item.hasOwnProperty('roomname') && item.roomname &&
            item.hasOwnProperty('username') && item.username);
        });
        
        results.forEach((item) => {
          this.renderRoom(item.roomname);
        });

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
    if (roomname !== $('#roomSelect').val()) {
      return;
    }

    var $batSignal = $('<div></div>');

    $batSignal.append($('<div class="batFriend"></div>'));

    var $batName = $(`<a href="#" class="username" data-username="${username}"></a>`);
    $batName.text(`${username}:`);
    $batName.on('click', (event) => {
      this.handleUsernameClick(event.target);
      event.preventDefault();
    });

    $batSignal.append($batName);
    
    var $text = $('<div class="userMessage"></div>');
    $text.text(text.trim());
    // add time later
    $batSignal.append($text);
    $batSignal.addClass('chat');
    this.$batFeed.prepend($batSignal);
  }
  renderRoom(batRoom) {
    batRoom = batRoom.trim();
    if (!batRoom) {
      return;
    }
    let rooms = $('#roomSelect option');
    for (let i = 0; i < rooms.length; i++) {
      if ($(rooms[i]).val() === batRoom) { 
        return; 
      }
    }
    // if batRoom is empty (or all spaces)
    var $optionThing = $(`<option value="${batRoom}">${batRoom}</option>`);
    $('#roomSelect').append($optionThing);

    var options = $('#roomSelect option');
    var arr = options.map(function(_, o) { return { t: $(o).text(), v: o.value }; }).get();
    arr.sort(function(o1, o2) { return o1.t > o2.t ? 1 : o1.t < o2.t ? -1 : 0; });
    options.each(function(i, o) {
      o.value = arr[i].v;
      $(o).text(arr[i].t);
    });

  }

  handleUsernameClick(userNode) {
    $('#chats').find('.username').each(function(index, node) {
      if ($(node).data('username') === $(userNode).data('username')) {
        $(node).siblings('.batFriend').fadeToggle();
        $(node).toggleClass('friend');
      }
    });
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
    $('#message').val('');
  });
  $('#roomSelect').on('change', function(event) {
    app.clearMessages();
    app.fetch();
  });
  $('.room-button').click(function() {
    $(this).hide();
    $('#room-form').show();
  });
  $('#room-form').on('submit', (event) => {
    event.preventDefault();

    var batRoom = $('#new-room-message').val();
    app.renderRoom(batRoom);

    $('#roomSelect').val(batRoom);
    app.clearMessages();
    $('#new-room-message').val('');
    $('#room-form').hide();
    $('.room-button').show();
  });
});
