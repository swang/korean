var kconst = {
  'ㅈ': 'j',
  'ㅅ': 's',
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
  '지', '자', '저', '쟈', '져', '즈', '조', '주', '죠', '쥬',
  '시', '사', '서', '샤', '셔', '스', '소', '수', '쇼', '슈',
  '치', '차', '처', '챠', '쳐', '츠', '초', '추', '쵸', '츄',
]

var kcombo = {}
var count = 0

// use javascript predicted ordering of keys to combine constants/vowels
Object.keys(kconst).forEach(function(c) {
  Object.keys(kvowel).forEach(function(v) {
    kcombo[_kcombos[count]] = kconst[c] + kvowel[v]
    count++
  })
})

function loadAudio(hangul) {
  $('audio > source').attr('src', 'mp3/' + kcombo[hangul] + '.mp3')
  $('audio')[0].load()
  $('audio')[0].play()
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

$(document).ready(function() {
  redrawBtns();
  $('div.answer').on('click', 'button', function() {
    loadAudio($(this).text())
  })
})
