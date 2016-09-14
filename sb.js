var kconst = {
  'ㅂ': 'b',
  'ㅈ': 'j',
  'ㄷ': 'd',
  'ㄱ': 'k',
  'ㅅ': 's',
  'ㅁ': 'm',
  'ㄴ': 'n',
  'ㅎ': 'h',
  'ㄹ': 'l',
}
var kvowel = {
  'ㅣ': 'i',
  'ㅏ': 'a',
  'ㅓ': 'eo',
  'ㅡ': 'eu',
  'ㅜ': 'u',
  'ㅗ': 'o',
}

var _kcombos = [
  '비', '바', '버', '브', '부', '보',
  '지', '자', '저', '즈', '주', '조',
  '디', '다', '더', '드', '두', '도',
  '기', '가', '거', '그', '구', '고',
  '시', '사', '서', '스', '수', '소',
  '미', '마', '머', '므', '무', '모',
  '니', '나', '너', '느', '누', '노',
  '히', '하', '허', '흐', '후', '호',
  '리', '라', '러', '르', '루', '로',
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
