(function () {
  // DOM 引用
  var documentRef = $(document);
  var windowRef = $(window);
  var htmlRef = $("html");

  var Waterfall = function (node) {
    this.index = 0;
    this.step = 4;
    this.node = node;
    this.queue = [];
    this.shown = 0;
    this.compare = 150;
    this.init();
  };
  // 继承EventProxy
  _.extend(Waterfall.prototype, EventProxy.prototype);
  Waterfall.prototype.init = function () {
    this._listenMouseWheel();
    this._listenEvents();
  };

  Waterfall.prototype._listenEvents = function () {
      var that = this;
    this.on("shown", function (index) {
      if (index !== -1) {
        this.shown++;
      }
      if (this.shown === this.source.length) {
        that.fire("end", this.source.length);
      }
      if (!that.isFilled()) {
        that.tryShow();
      } else {
        that.tryPreload();
      }
    });

    this.on("preloaded", function () {
      if (!that.isFilled()) {
        that.tryShow();
      }
      if (that.index < that.source.length && that.queue.length < that.step) {
        that.tryPreload();
      }
    });
    
    this.on("drop", function () {
      that.tryShow();
    });
  };

  Waterfall.prototype._listenMouseWheel = function () {
    var that = this;
    $(window).bind("mousewheel", function(event, delta) {
      if (delta < 0) {
        that.emit("drop");
      }
    });
  };

  Waterfall.prototype.setCompare = function (compare) {
    this.compare = compare;
  };

  // 重设瀑布流
  Waterfall.prototype.reset = function () {
    this.node.empty();
    this.index = 0;
    this.shown = 0;
    this.queue = [];
  };

  Waterfall.prototype.show = function (item) {
    this.node.append("<li>" + item + "</li>");
  };
  
  Waterfall.prototype.preload = function (item, callback) {
    callback(item);
  };
  
  Waterfall.prototype.isFilled = function () {
    if (htmlRef.height() < documentRef.height()) {
      return false;
    }
    return (documentRef.scrollTop() + windowRef.height() < documentRef.height() - this.compare);
  };

  Waterfall.prototype.setSource = function (source) {
    this.source = source;
    this.fire("shown", -1);
  };

  Waterfall.prototype.tryShow = function () {
    if (this.queue.length) {
      var item = this.queue.shift();
      this.show(item);
      this.fire("shown");
    } else {
      if (this.index < this.source.length) {
        this.fire("loading");
      }
      this.tryPreload();
    }
  };

  Waterfall.prototype.tryPreload = function () {
    if (this.status === "pending") {
      return;
    }
    if (this.index < this.source.length) {
      var item = this.source[this.index];
      this.status = "pending";
      var that = this;
      this.preload(item, function (ret) {
        that.status = "ready";
        that.queue.push(ret);
        that.index++;
        that.fire("preloaded");
      });
    }
  };
  window.Waterfall = Waterfall;
})()
