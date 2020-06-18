// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src/Board.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DeadZone = exports.Board = exports.Cell = void 0;

var Cell =
/** @class */
function () {
  function Cell(position, piece) {
    this.position = position;
    this.piece = piece;
    this.isActive = false;
    this._el = document.createElement("div");

    this._el.classList.add("cell");
  }

  Cell.prototype.put = function (piece) {
    this.piece = piece;
  };

  Cell.prototype.getPiece = function () {
    return this.piece;
  };

  Cell.prototype.active = function () {
    this.isActive = true;
  };

  Cell.prototype.deactive = function () {
    this.isActive = false;
  };

  Cell.prototype.render = function () {
    if (this.isActive) this._el.classList.add("active");else this._el.classList.remove("active");
    this._el.innerHTML = this.piece ? this.piece.render() : "";
  };

  return Cell;
}();

exports.Cell = Cell; // export interface piece {
//   row: number;
//   col: number;
// }

var Board =
/** @class */
function () {
  function Board(upperPlayer, lowerPlayer) {
    this.cells = [];
    this._el = document.createElement("div"); // weakMap :  ?

    this.map = new WeakMap();
    this._el.className = "board";

    var _loop_1 = function _loop_1(row) {
      var rowEl = document.createElement("div");
      rowEl.className = "row";

      this_1._el.appendChild(rowEl);

      var _loop_2 = function _loop_2(col) {
        var piece = upperPlayer.getPieces().find(function (_a) {
          var currentPosition = _a.currentPosition;
          return currentPosition.col === col && currentPosition.row === row;
        }) || lowerPlayer.getPieces().find(function (_a) {
          var currentPosition = _a.currentPosition;
          return currentPosition.col === col && currentPosition.row === row;
        });
        console.log(piece);
        var cell = new Cell({
          row: row,
          col: col
        }, piece);
        this_1.map.set(cell._el, cell);
        this_1.cells.push(cell);
        rowEl.appendChild(cell._el);
      };

      for (var col = 0; col < 3; col++) {
        _loop_2(col);
      }
    };

    var this_1 = this;

    for (var row = 0; row < 4; row++) {
      _loop_1(row);
    }
  }

  Board.prototype.render = function () {
    this.cells.forEach(function (v) {
      return v.render();
    });
  };

  return Board;
}();

exports.Board = Board;

var DeadZone =
/** @class */
function () {
  function DeadZone(type) {
    this.type = type;
    this.cells = [];
    this.deadzoneEl = document.getElementById(this.type + "_deadzone").querySelector(".card-body");

    for (var col = 0; col < 4; col++) {
      var cell = new Cell({
        col: col,
        row: 0
      }, null);
      this.cells.push(cell);
      this.deadzoneEl.appendChild(cell._el);
    }
  }

  DeadZone.prototype.put = function (piece) {
    var emptyCell = this.cells.find(function (v) {
      return v.getPiece() === null;
    });
    emptyCell.put(piece);
    emptyCell.render();
  };

  DeadZone.prototype.render = function () {
    this.cells.forEach(function (v) {
      return v.render();
    });
  };

  return DeadZone;
}();

exports.DeadZone = DeadZone;
},{}],"src/Player.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Player = exports.PlayerType = void 0;

var Piece_1 = require("./Piece");

var PlayerType;

(function (PlayerType) {
  PlayerType["UPPER"] = "UPPER";
  PlayerType["LOWER"] = "LOWER";
})(PlayerType = exports.PlayerType || (exports.PlayerType = {}));

var Player =
/** @class */
function () {
  // readonly upperPlayer = new Player(PlayerType.UPPER);
  // readonly lowerPlayer = new Player(PlayerType.LOWER);
  function Player(type) {
    this.type = type;

    if (type === PlayerType.UPPER) {
      this.pieces = [new Piece_1.Griff(PlayerType.UPPER, {
        row: 0,
        col: 0
      }), new Piece_1.Lion(PlayerType.UPPER, {
        row: 0,
        col: 1
      }), new Piece_1.Elephant(PlayerType.UPPER, {
        row: 0,
        col: 2
      }), new Piece_1.Chick(PlayerType.UPPER, {
        row: 1,
        col: 1
      })];
    } else {
      this.pieces = [new Piece_1.Elephant(PlayerType.LOWER, {
        row: 3,
        col: 0
      }), new Piece_1.Lion(PlayerType.LOWER, {
        row: 3,
        col: 1
      }), new Piece_1.Griff(PlayerType.LOWER, {
        row: 3,
        col: 2
      }), new Piece_1.Chick(PlayerType.LOWER, {
        row: 2,
        col: 1
      })];
    }
  }

  Player.prototype.getPieces = function () {
    return this.pieces;
  };

  return Player;
}();

exports.Player = Player;
},{"./Piece":"src/Piece.ts"}],"src/images/lion.png":[function(require,module,exports) {
module.exports = "/lion.0a55027b.png";
},{}],"src/images/chicken.png":[function(require,module,exports) {
module.exports = "/chicken.3d0d4a2d.png";
},{}],"src/images/griff.png":[function(require,module,exports) {
module.exports = "/griff.78de84a7.png";
},{}],"src/images/elophant.png":[function(require,module,exports) {
module.exports = "/elophant.66e48f21.png";
},{}],"src/Piece.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Chick = exports.Griff = exports.Elephant = exports.Lion = exports.MoveResult = void 0;

var Player_1 = require("./Player");

var MoveResult =
/** @class */
function () {
  function MoveResult(killedPiece) {
    this.killedPiece = killedPiece;
    this.ownerType = Player_1.PlayerType;
  }

  MoveResult.prototype.getKilled = function () {
    return this.killedPiece;
  };

  return MoveResult;
}();

exports.MoveResult = MoveResult;

var DefaultPiece =
/** @class */
function () {
  function DefaultPiece(ownerType, currentPosition) {
    this.ownerType = ownerType;
    this.currentPosition = currentPosition;
  }

  DefaultPiece.prototype.move = function (from, to) {
    if (!this.canMove(to.position)) throw new Error("can not move!");
    var moveResult = new MoveResult(to.getPiece() != null ? to.getPiece() : null);
    to.put(this);
    from.put(null);
    this.currentPosition = to.position;
    return moveResult;
  };

  return DefaultPiece;
}();

var lion_png_1 = __importDefault(require("./images/lion.png"));

var chicken_png_1 = __importDefault(require("./images/chicken.png"));

var griff_png_1 = __importDefault(require("./images/griff.png"));

var elophant_png_1 = __importDefault(require("./images/elophant.png"));

console.log(griff_png_1.default);

var Lion =
/** @class */
function (_super) {
  __extends(Lion, _super);

  function Lion() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  Lion.prototype.canMove = function (pos) {
    var canMove = pos.row === this.currentPosition.row + 1 && pos.col === this.currentPosition.col || pos.row === this.currentPosition.row - 1 && pos.col === this.currentPosition.col || pos.col === this.currentPosition.col + 1 && pos.row === this.currentPosition.row || pos.col === this.currentPosition.col - 1 && pos.row === this.currentPosition.row || pos.row === this.currentPosition.row + 1 && pos.col === this.currentPosition.col + 1 || pos.row === this.currentPosition.row + 1 && pos.col === this.currentPosition.col - 1 || pos.row === this.currentPosition.row - 1 && pos.col === this.currentPosition.col + 1 || pos.row === this.currentPosition.row - 1 && pos.col === this.currentPosition.col - 1;
    return canMove;
  };

  Lion.prototype.render = function () {
    return "<img class=\"piece " + this.ownerType + "\" src=\"" + lion_png_1.default + "\" width=\"90%\" height=\"90%\"/>";
  };

  return Lion;
}(DefaultPiece);

exports.Lion = Lion;

var Elephant =
/** @class */
function (_super) {
  __extends(Elephant, _super);

  function Elephant() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  Elephant.prototype.canMove = function (pos) {
    return pos.row === this.currentPosition.row + 1 && pos.col === this.currentPosition.col + 1 || pos.row === this.currentPosition.row + 1 && pos.col === this.currentPosition.col - 1 || pos.row === this.currentPosition.row - 1 && pos.col === this.currentPosition.col + 1 || pos.row === this.currentPosition.row - 1 && pos.col === this.currentPosition.col - 1;
  };

  Elephant.prototype.render = function () {
    return "<img class=\"piece " + this.ownerType + "\" src=\"" + elophant_png_1.default + "\" width=\"90%\" height=\"90%\"/>";
  };

  return Elephant;
}(DefaultPiece);

exports.Elephant = Elephant;

var Griff =
/** @class */
function (_super) {
  __extends(Griff, _super);

  function Griff() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  Griff.prototype.canMove = function (pos) {
    return pos.row === this.currentPosition.row + 1 && pos.col === this.currentPosition.col || pos.row === this.currentPosition.row - 1 && pos.col === this.currentPosition.col || pos.col === this.currentPosition.col + 1 && pos.row === this.currentPosition.row || pos.col === this.currentPosition.col - 1 && pos.row === this.currentPosition.row;
  };

  Griff.prototype.render = function () {
    return "<img class=\"piece " + this.ownerType + "\" src=\"" + griff_png_1.default + "\" width=\"90%\" height=\"90%\"/>";
  };

  return Griff;
}(DefaultPiece);

exports.Griff = Griff;

var Chick =
/** @class */
function (_super) {
  __extends(Chick, _super);

  function Chick() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  Chick.prototype.canMove = function (pos) {
    return this.currentPosition.row + (this.ownerType == Player_1.PlayerType.UPPER ? +1 : -1) === pos.row;
  };

  Chick.prototype.render = function () {
    return "<img class=\"piece " + this.ownerType + "\" src=\"" + chicken_png_1.default + "\" width=\"90%\" height=\"90%\"/>";
  };

  return Chick;
}(DefaultPiece);

exports.Chick = Chick;
},{"./Player":"src/Player.ts","./images/lion.png":"src/images/lion.png","./images/chicken.png":"src/images/chicken.png","./images/griff.png":"src/images/griff.png","./images/elophant.png":"src/images/elophant.png"}],"src/Game.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Game = void 0;

var Board_1 = require("./Board");

require("./Piece");

var Player_1 = require("./Player");

var Piece_1 = require("./Piece");

var Game =
/** @class */
function () {
  function Game() {
    var _this = this;

    this.turn = 0;
    this.currentPlayer = Player_1.Player;
    this.gameInfoEl = document.querySelector(".alert");
    this.state = "STARED";
    this.upperPlayer = new Player_1.Player(Player_1.PlayerType.UPPER);
    this.lowerPlayer = new Player_1.Player(Player_1.PlayerType.LOWER);
    this.board = new Board_1.Board(this.upperPlayer, this.lowerPlayer);
    this.upperDeadZone = new Board_1.DeadZone("upper");
    this.lowerDeadZone = new Board_1.DeadZone("lower");
    var boardContainer = document.querySelector(".board-container");
    boardContainer.firstChild.remove();
    boardContainer.appendChild(this.board._el);
    this.currentPlayer = this.upperPlayer;
    this.board.render();
    this.renderInfo();

    this.board._el.addEventListener("click", function (e) {
      if (_this.state === "END") {
        return false;
      }

      if (e.target instanceof HTMLElement) {
        var cellEl = void 0;

        if (e.target.classList.contains("cell")) {
          cellEl = e.target;
        } else if (e.target.classList.contains("piece")) {
          cellEl = e.target.parentElement;
        } else {
          return false;
        }

        var cell = _this.board.map.get(cellEl);

        if (_this.isCurrentUserPiece(cell)) {
          _this.select(cell);

          return false;
        }

        if (_this.selectCell) {
          _this.move(cell);

          _this.changeTurn();
        }
      }
    });
  }

  Game.prototype.select = function (cell) {
    if (cell.getPiece() == null) return;
    if (cell.getPiece().ownerType !== this.currentPlayer.type) return;

    if (this.selectCell) {
      this.selectCell.deactive();
      this.selectCell.render();
    }

    this.selectCell = cell;
    cell.active();
    cell.render();
  };

  Game.prototype.isCurrentUserPiece = function (cell) {
    return cell != null && cell.getPiece() != null && cell.getPiece().ownerType === this.currentPlayer.type;
  };

  Game.prototype.move = function (cell) {
    this.selectCell.deactive();
    var killed = this.selectCell.getPiece().move(this.selectCell, cell).getKilled();
    this.selectCell = cell;

    if (killed) {
      if (killed.ownerType === Player_1.PlayerType.UPPER) {
        this.lowerDeadZone.put(killed);
      } else {
        this.upperDeadZone.put(killed);
      }

      if (killed instanceof Piece_1.Lion) {
        this.state = "END";
      }
    }
  };

  Game.prototype.renderInfo = function (extraMessage) {
    this.gameInfoEl.innerHTML = "#" + this.turn + "\uD134 " + this.currentPlayer.type + " \uCC28\uB840 " + (extraMessage ? " | " + extraMessage : "");
  };

  Game.prototype.changeTurn = function () {
    this.selectCell.deactive();
    this.selectCell = null;

    if (this.state === "END") {
      this.renderInfo("END!");
    } else {
      this.turn += 1;
      this.currentPlayer = this.currentPlayer === this.lowerPlayer ? this.upperPlayer : this.lowerPlayer;
      this.renderInfo();
    }

    this.board.render();
  };

  return Game;
}();

exports.Game = Game;
},{"./Board":"src/Board.ts","./Piece":"src/Piece.ts","./Player":"src/Player.ts"}],"node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"node_modules/bootstrap/dist/css/bootstrap.css":[function(require,module,exports) {

        var reloadCSS = require('_css_loader');
        module.hot.dispose(reloadCSS);
        module.hot.accept(reloadCSS);
      
},{"_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js"}],"src/styles/style.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js"}],"src/index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Game_1 = require("./Game");

require("bootstrap/dist/css/bootstrap.css");

require("./styles/style.css");

new Game_1.Game();
},{"./Game":"src/Game.ts","bootstrap/dist/css/bootstrap.css":"node_modules/bootstrap/dist/css/bootstrap.css","./styles/style.css":"src/styles/style.css"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "60962" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/index.ts"], null)
//# sourceMappingURL=/src.f10117fe.js.map