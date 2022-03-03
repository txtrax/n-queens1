// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


    /*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

    */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      // Check for more than one 1 in given array
      // Need to get array
      var result = false;
      var row = this.rows()[rowIndex];
      row.forEach(function(square, index) {
        // Check to see if there is more than one 1 -> false
        // if a second index of '1' exists -> true
        // if there is a 1 on the row
        if (square === 1) {
          // compare its index to the first occurance of 1
          if (row.indexOf(1) !== index) {
            result = true;
            return;
          }
        }
      });
      return result;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      // if 'this' has no conflict at any rows
      var result = false;
      var rows = this.rows();
      for (var i = 0; i < rows.length; i++) {
        if (this.hasRowConflictAt(i)) {
          return true;
        }
      }
      return result;
    },

    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      //create transpose board
      var columns = [];
      var rows = this.rows();
      //make transpose board
      for (var i = 0; i < rows.length; i++) {
        // push new empty column to columns
        columns.push([]);
      }
      for (var i = 0; i < rows.length; i++) {
        for (var j = 0; j < rows[i].length; j++) {
          columns[j].push(rows[i][j]);
        }
      }

      // var reduce = columns[colIndex].reduce(function(element, index) {
      //   if (index !== columns[colIndex].indexOf(element)) {
      //     return true;
      //   }
      // }, false);
      // console.log(reduce);

      var sum = 0;
      for (var e = 0; e < columns[colIndex].length; e++) {
        sum += columns[colIndex][e];
        if (sum > 1) {
          return true;
        }
      }
      return false;
    },


    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      //get every array of columns indices
      var columnIndex = this.get('n') - 1;
      for (var i = 0; i <= columnIndex; i++) {
        if (this.hasColConflictAt(i)) {
          return true;
        }
      }

      return false;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      //  x = 0
      // [1, 0, 0]
      // [0, 1, 0] <-
      // [0, 0, 1]
      // M[0][0], M[1][1], M[2][2]
      // M[r][c], M[r + 1][c + 1], M[r + 2][...] *
      // M[x][x] -> this would only check the center diagonal
      var n = this.get('n');
      var board = this.rows();

      for (var i = 0; i < n; i++) {
        var startingCol = majorDiagonalColumnIndexAtFirstRow - i;
        var sum = 0;

        for (var r = 0; r < n; r++) {
          let col = startingCol + r;
          if(this._isInBounds(r, col)) {
            //console.log(board[r][col]);
            sum += 1;
            if (sum > 1) {
              return true;
            }
          }
        }
      }
      return false;
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      return false; // fixme
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      //  x  x  x
      // [0, 0, 1]
      // [0, 1, 0]
      // [1, 0, 0]
      //
      return false; // fixme
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      return false; // fixme
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());

// window.toyBoard = new Board({n: 3});