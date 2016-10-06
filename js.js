'use strict';

var correct = parseInt(window.localStorage.getItem('correct')) || 0;
var incorrect = parseInt(window.localStorage.getItem('incorrect')) || 0;

var kconst = {
  // 'ㅂ': 'b',
  'ㅈ': 'j',
  // 'ㄷ': 'd',
  // 'ㄱ': 'k',
  'ㅅ': 's',
  // 'ㅁ': 'm',
  // 'ㄴ': 'n',
  // 'ㅎ': 'h',
  // 'ㄹ': 'l',
  'ㅊ': 'ch',
}
var kvowel = {
  'ㅣ': 'i',
  'ㅏ': 'a',
  'ㅓ': 'eo',
  'ㅑ': 'ya',
  'ㅕ': 'yeo',
  'ㅡ': 'eu',
  'ㅗ': 'o',
  'ㅜ': 'u',
  'ㅛ': 'yo',
  'ㅠ': 'yu',
}

var _kcombos = [
  // '비', '바', '버', '브', '부', '보',

  '지', '자', '저', '쟈', '져', '즈', '조', '주', '죠', '쥬',
  // '디', '다', '더', '드', '두', '도',
  // '기', '가', '거', '그', '구', '고',
  '시', '사', '서', '샤', '셔', '스', '소', '수', '쇼', '슈',
  // '미', '마', '머', '므', '무', '모',
  // '니', '나', '너', '느', '누', '노',
  // '히', '하', '허', '흐', '후', '호',
  // '리', '라', '러', '르', '루', '로',
  '치', '차', '처', '챠', '쳐', '츠', '초', '추', '쵸', '츄',
]

var count = 0
var kcombo = {}

// use javascript predicted ordering of keys to combine constants/vowels
Object.keys(kconst).forEach(function(c) {
  Object.keys(kvowel).forEach(function(v) {
    kcombo[_kcombos[count]] = kconst[c] + kvowel[v]
    count++
  })
})

function updateScore() {
  var perc = (correct/(correct + incorrect) * 100).toFixed(2)
  $('div.score').html(correct.toString() + '/' + (correct + incorrect) + ' ' + (isNaN(perc) ? '0' : perc) + '%')
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
  // var order = shuffle(Object.keys(kcombo))
  var order = Object.keys(kcombo)
  var html = []
  order.forEach(function(k) {
    html.push('<button>' + (k) + '</button>')
  })
  $('div.answer').html(html.join(''))
}

function pickOne(ary) {
  return ary[~~(Math.random() * ary.length)]
}

$(document).ready(function() {
  var k
  var pn = window.location.pathname.split("/").slice(-1)[0]
  function nextOne() {
    var kk
    do {
      kk = pickOne(Object.keys(kcombo))
    } while (kk === k)
    k = kk
  }
  function loadAudio(hangul) {
    $('audio > source').attr('src', 'mp3/' + kcombo[hangul] + '.mp3')
    $('audio')[0].load()
    $('audio')[0].play()
  }
  if (pn === 'sb.html') {
    redrawBtns();
    $('div.answer').on('click', 'button', function() {
      loadAudio($(this).text())
    })
  }
  if (pn === 'index.html' || pn === '') {

    $('div.answer').on('click', 'button', function() {
      var btn = $(this)
      // console.log(k, $(this).text(), kcombo[$(this).text()], '::', $('audio > source').attr('src'))
      if (k === btn.text()) {
        correct++
        window.localStorage.setItem('correct', correct)
        $('div.result').addClass('correct').removeClass('incorrect')
        $(this).addClass('correct')
      } else {
        incorrect++

        btn = $('div.answer button').filter(function(idx, _btn) {
          return (k === _btn.innerText)
        }).addClass('incorrect')

        window.localStorage.setItem('incorrect', incorrect)
        $('div.result').addClass('incorrect').removeClass('correct')
      }
      $('div.centered').html(k)

      setTimeout(function(btn) {
        return function() {
          $('div.result').removeClass('correct').removeClass('incorrect')
          btn.removeClass('correct').removeClass('incorrect')
          // $('div.centered').html('')
          nextOne()
          redrawBtns()
          updateScore()
        }
      }(btn), 700)


    })
    $('audio').on('ended', function() {
      console.log('audio over');
      $('#play-button').removeAttr('disabled');
    })

    $('#play-button').on('click', function() {
      loadAudio(k)
      $('#play-button').attr('disabled', '');
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
    updateScore()
    redrawBtns()
  }

  $('body').on('touchstart taphold', '.dropdown', function() {
    $(this).toggleClass('active');
    var active = $(this).find(".active").detach();
    active.appendTo($(this))
  })
  $('body').on('touchstart tap', '.dropdown > .label', function() {
    if ($(this).attr('data-url')) {
      window.location = $(this).attr('data-url')
    }
  })

  drawDropdown(pn)
})

function drawDropdown(curPage) {
  // console.log(curPage)
  $('body div.dropdown').remove();
  $('body').append('<div class="dropdown"></div>');
  ;[['sb.html', 'Sound Board'], ['index.html', 'Listen Quiz']].forEach(function(p) {
    if (p[0] === curPage || (p[0] === 'index.html' && curPage === '')) {
      $('.dropdown').append('<div class="label active">' + p[1] + '</div>')
    } else {
      $('.dropdown').append('<div data-url="' + p[0] + '" class="label">' + p[1] + '</div>')
    }
  })

}
