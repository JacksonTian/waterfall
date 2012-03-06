(function () {
  var documentRef = $(document);
  var windowRef = $(window);
  var Waterfall = function (node) {
    this.index = 0;
    this.node = node;
    this.queue = [];
    this.init();
  };
  // 继承EventProxy
  _.extend(Waterfall.prototype, EventProxy.prototype);
  Waterfall.prototype.init = function () {
    this._listenMouseWheel();
    this._listen();
  };
  Waterfall.prototype._listenMouseWheel = function () {
    var that = this;
    $(window).bind("mousewheel", function(event, delta) {
      if (delta < 0) {
        that.emit("drop");
      }
    });
  };
  // 重设瀑布流
  Waterfall.prototype.reset = function () {
    this.node.empty();
    this.index = 0;
    this.queue = [];
  };

  Waterfall.prototype.isFilled = function () {
    var filled = true;
    if (documentRef.scrollTop() + windowRef.height() < documentRef.height()) {
      filled = false;
    }
    return filled;
  };

  Waterfall.prototype.setSource = function (source) {
    this.source = source;
    this.fire("drop");
  };
  Waterfall.prototype.fall = function () {
    var item = this.source[this.index];
    this.index++;
    
  };
})()
