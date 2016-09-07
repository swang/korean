'use strict';

var correct = parseInt(window.localStorage.getItem('correct')) || 0;
var incorrect = parseInt(window.localStorage.getItem('incorrect')) || 0;

function updateScore() {
  $('div.score').html(correct.toString() + '/' + (correct + incorrect) + ' ' + (correct/(correct + incorrect) * 100).toFixed(2) + '%')
}

$(document).ready(function() {
  const kchar = {
    'ㄱ': 'k',
    'ㄴ': 'n',
    'ㄷ': 'd',
    'ㄹ': 'l',
    'ㅁ': 'm',
    'ㅂ': 'b',
    'ㅅ': 's',
    'ㅈ': 'j',
    'ㅎ': 'h',
    'ㅣ': 'i',
    'ㅏ': 'a',
    'ㅓ': 'eo',
    'ㅡ': 'eu',
    'ㅜ': 'u',
    'ㅗ': 'o',
  }
  function pickOne(ary) {
    return ary[~~(Math.random() * ary.length)]
  }
  var k

  function nextOne() {
    var kk
    do {
      kk = pickOne(Object.keys(kchar))
    } while (kk === k)
    k = kk
    $('div.centered').html(k)
  }
  nextOne();

  Object.keys(kchar).forEach(function(k) {
    $('div.answer').append('<button>' + kchar[k] + '</button>');
  })

  $('div.answer').on('click', 'button', function() {
    var self = $(this)
    if (kchar[k] === $(this).text()) {
      correct++
      window.localStorage.setItem('correct', correct)
      $('div.result').addClass('correct').html('Correct!')
      $(this).css('background', 'green')
    } else {
      incorrect++
      window.localStorage.setItem('incorrect', incorrect)
      $('div.result').addClass('incorrect').html('Incorrect! It is: ' + kchar[k])

      $(this).css('background', 'red')
    }

    setTimeout(function() {
      self.css('background', '')
      $('div.result').removeClass('correct').removeClass('incorrect').html('Result')
      nextOne()
    }, 500)

    updateScore()
  })
  updateScore()
})
