// Generated by CoffeeScript 1.12.4
(function() {
  var actualMatches, matchAll, noflo;

  noflo = require('noflo');

  matchAll = function(string, regexp) {
    var matches;
    matches = [];
    string.replace(regexp, function() {
      var arr, extras;
      arr = [].slice.call(arguments, 0);
      extras = arr.splice(-2);
      arr.index = extras[0];
      arr.input = extras[1];
      matches.push(arr);
    });
    if (matches.length) {
      return matches;
    } else {
      return [];
    }
  };

  actualMatches = function(matches) {
    if (matches.length === 0) {
      return [[]];
    }
    return matches.map(function(match) {
      return match[0];
    });
  };

  exports.getComponent = function() {
    var c;
    c = new noflo.Component({
      description: 'Find all of the instances of `word` in `content` and send them out in a stream',
      inPorts: {
        word: {
          datatype: 'string',
          description: 'the word we are looking for instances of',
          control: true,
          required: true
        },
        content: {
          datatype: 'string',
          description: 'the content which we look for the word in',
          required: true
        },
        surrounding: {
          datatype: 'boolean',
          description: 'whether to get surrounding characters, symbols before and after until space',
          "default": false,
          control: true
        }
      },
      outPorts: {
        matches: {
          datatype: 'string',
          description: 'the resulting findings as a stream of data packets',
          required: true
        }
      }
    });
    c.forwardBrackets = {
      content: 'matches'
    };
    return c.process(function(input, output) {
      var content, i, len, match, matches, r, word;
      if (input.ip.type !== 'data') {
        return input.buffer.get().pop();
      }
      if (!input.has('word', 'content', function(ip) {
        return ip.type === 'data';
      })) {
        return;
      }
      output.send({
        matches: new noflo.IP('openBracket', content)
      });
      word = input.getData('word');
      content = input.getData('content');
      r = /([.?!]*eh[.?!]*)/gi;
      matches = matchAll(content, r);
      matches = actualMatches(matches);
      for (i = 0, len = matches.length; i < len; i++) {
        match = matches[i];
        output.send({
          matches: match
        });
      }
      return output.sendDone({
        matches: new noflo.IP('closeBracket', content)
      });
    });
  };

}).call(this);
