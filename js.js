'use strict';

var correct = parseInt(window.localStorage.getItem('correct')) || 0;
var incorrect = parseInt(window.localStorage.getItem('incorrect')) || 0;

var kchar = {
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

function updateScore() {
  $('div.score').html(correct.toString() + '/' + (correct + incorrect) + ' ' + (correct/(correct + incorrect) * 100).toFixed(2) + '%')
}

function shuffle(arr) {
  var rnd, tmp
  for (var i = 0; i < arr.length; i++) {
    rnd = i + ~~(Math.random() * (arr.length - i))
    tmp = arr[rnd]
    arr[rnd] = arr[i]
    arr[i] = tmp
  }
  return arr
}

function redrawBtns() {
  var order = shuffle(Object.keys(kchar))
  var html = []
  order.forEach(function(k) {
    html.push('<button>' + kchar[k] + '</button>')
  })
  $('div.answer').html(html.join(''))
}

function pickOne(ary) {
  return ary[~~(Math.random() * ary.length)]
}

$(document).ready(function() {
  var k

  function nextOne() {
    var kk
    do {
      kk = pickOne(Object.keys(kchar))
    } while (kk === k)
    k = kk
    $('div.centered').html(k)
  }

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
      redrawBtns()
      updateScore()
    }, 500)

  })
  $('button.clear').on('click', function() {
    if (confirm('Are you sure you want to clear scores?')) {
      correct = 0
      incorrect = 0
      window.localStorage.setItem('correct', 0)
      window.localStorage.setItem('incorrect', 0)
      redrawBtns()
      updateScore()

    }
  })

  nextOne()
  redrawBtns()
  updateScore()
})
