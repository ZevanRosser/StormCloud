$(function() {


  function randomize(a, b) {
    return Math.round(Math.random() * 2) - 1;
  }

  function StormCloud() {
    var self = this;
    var win = $(window);
    self.elem = $("#content").grab(self);

    self.wordMap = {};
    
    win.resize(function(){
      self.words.height(win.height() - self.words.offset().top - 20);
      
    }).trigger("resize");
    

    //new Word({text:"test"});
    if (localStorage.stormCloud) {
      self.wordMap = JSON.parse(localStorage.stormCloud);
      for (var i in self.wordMap) {
        new Word({
          text: i
        }).elem.prependTo(self.words);
      }
    }

    self.save = function() {
      localStorage.stormCloud = JSON.stringify(self.wordMap);
    };

    self.render = function() {

      self.cloud.html("");

      var words = [];
      for (var i in self.wordMap) {
        words.push(i);
      }

      words.sort(randomize);

      for (var i = 0; i < words.length; i++) {
        $("<span>", {
          text: words[i] + " ",
          css: {
            fontSize: 10 + Math.random() * 30
          }
        }).appendTo(self.cloud);
      }
    };

    self.render();
    setInterval(self.render, 1000);

    self.addWord.submit(function(e) {
      e.preventDefault();
      var value = $.trim(self.word.val());
      if (value.length > 0) {
        self.word.val("");
        new Word({
          text: value
        }).elem.prependTo(self.words);
        self.render();
        self.save();
      }
    });

  }

  function Word(params) {
    this.elem = $("#word").grab(this, params);
    this.value = params.text;
    if (stormCloud) stormCloud.wordMap[params.text] = 1;
    this.ex.click($.proxy(this.remove, this));
  }
  Word.prototype.remove = function() {
    this.elem.remove();
    delete stormCloud.wordMap[this.value];
    stormCloud.render();
    stormCloud.save();
    //console.log(stormCloud.wordMap, Math.random());
  };

  var stormCloud = new StormCloud();


});