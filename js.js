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
  var correct = 0;
  var incorrect = 0;
  var k

  function nextOne() {
    // var kk = pickOne(Object.keys(kchar))
    do {
      kk = pickOne(Object.keys(kchar))
    } while (kk === k && kk === '')
    k = kk
    $('div.centered').html(k)
  }
  nextOne();

  Object.keys(kchar).forEach(function(k) {
    $('div.answer').append('<button>' + kchar[k] + '</button>');
  })

  $('div.answer').on('click', 'button', function() {
    if (kchar[k] === $(this).text()) {
      correct++
      $('div.result').addClass('correct').html('Correct!')
      $(this).css('background', 'green')
    } else {
      incorrect++
      $('div.result').addClass('incorrect').html('Incorrect! It is ' + kchar[k])
      $(this).css('background', 'red')
    }

    setTimeout(function() {
      $(this).css('background', '')
      $('div.result').removeClass('correct').removeClass('incorrect').html('Result')
      nextOne()
    }, 500)

    var outta = correct.toString() + '/' + (correct + incorrect).toString()

    $('div.score').html(outta + ' ' + (correct/(correct + incorrect) * 100).toFixed(2) + '%')
  })

})
