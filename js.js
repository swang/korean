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
  let correct = 0;
  let incorrect = 0;
  let k

  function nextOne() {
    // let kk = pickOne(Object.keys(kchar))
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
    setTimeout(() => {
      $(this).css('background', '')
      $('div.result').removeClass('correct').removeClass('incorrect').html('Result');
      nextOne();
    }, 500)
    $('div.score').html(correct / (correct+incorrect) + ' ' + ((correct/(correct+incorrect)*100).toFixed(2)) + '%')
  })

})
