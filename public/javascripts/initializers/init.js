$.ext.Class.namespace("Initializers");

Initializers.init = function(container) {
  Initializers.initLive(container);
  Initializers.initNonLive(container);
};

Initializers.initLive = function(container) {
  Initializers.fbox.init(container);
};

Initializers.initNonLive = function(container) {
  Initializers.qtip.init(container);
  Initializers.textarea_autosize.init(container);
};


