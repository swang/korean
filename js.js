'use strict';

function pickOne(ary) {
  return ary[~~(Math.random() * ary.length)]
}

var kconst = {
  0x1107: 'b', // 'ㅂ'
  0x1111: 'p', // 'ᄑ'
  0x110c: 'j', // 'ㅈ'
  // 'ㄷ': 'd',
  // 'ㄱ': 'k',
  0x1109: 's', // 'ㅅ'
  0x1106: 'm', // 'ㅁ'
  // 'ㄴ': 'n',
  // 'ㅎ': 'h',
  // 'ㄹ': 'l',
  0x110e: 'ch', // 'ㅊ'
}

var kvowel = {
  0x1175: 'i', //'ㅣ'
  0x1161: 'a', //'ㅏ'
  0x1165: 'eo', //'ㅓ'
  0x1163: 'ya', //'ㅑ'
  0x1167: 'yeo', //'ㅕ'
  0x1173: 'eu', //'ㅡ'
  0x1169: 'o', //'ㅗ'
  0x116e: 'u', //'ㅜ'
  0x116d: 'yo', //'ㅛ'
  0x1172: 'yu', //'ㅠ'
}
var count = 0
var kcombo = {}

// use javascript predicted ordering of keys to combine constants/vowels
Object.keys(kconst).forEach(function(c) {
  Object.keys(kvowel).forEach(function(v) {
    kcombo[String.fromCharCode(c, v)] = kconst[c] + kvowel[v]
    count++
  })
})

var eventBus = new Vue({
  data: {
    hangul: '',
    romanji: '',
    kcomboKeys: Object.keys(kcombo),
    correct: 0,
    incorrect: 0,
    route: '',
  },
  methods: {
    nextOne: function() {
      var kk
      do {
        kk = pickOne(this.kcomboKeys)
      } while (kk === this.hangul)
      this.hangul = kk
      this.romanji = kcombo[kk]
      return this.hangul
    }
  },
  created: function() {
    var self = this
    this.correct = parseInt(window.localStorage.getItem('correct'), 10) || 0
    this.incorrect = parseInt(window.localStorage.getItem('incorrect'), 10) || 0
    this.$emit('updatescore', this.correct, this.incorrect)
    this.$on('correct', function() {
      window.localStorage.setItem('correct', self.correct + 1)
      self.nextOne()
    })
    this.$on('incorrect', function() {
      window.localStorage.setItem('incorrect', this.incorrect + 1)
      self.nextOne()
    })

    this.$on('updatescore', function(correct, incorrect) {
      self.correct = correct
      self.incorrect = incorrect
      window.localStorage.setItem('correct', correct)
      window.localStorage.setItem('incorrect', incorrect)
    })

    this.nextOne();
  }
})

Vue.component('play-button', {
  template: '<button id="play-button" v-on:click="click">Play</button>',
  methods: {
    click: function(e) {
      eventBus.$emit('play', eventBus.romanji);
    }
  }
})

Vue.component('clear-button', {
  template: '<button v-on:click="click" class="clear">Clear Score</button>',
  methods: {
    click: function(e) {
      if (confirm('Are you sure you want to clear scores?')) {
        eventBus.$emit('updatescore', 0, 0);
      }
    }
  }
})

Vue.component('audio-player', {
  data: function() {
    return {
      src: ''
    }
  },
  created: function() {
    var self = this
    eventBus.$on('play', function(audio) {
      self.src = 'mp3/' + audio +'.mp3'
      self.$el.load()
      self.$el.play()
    })
  },
  template: '<audio ref="audio"><source v-bind:src="src" type="audio/mpeg"></audio>'
})
Vue.component('result-item', {
  data: function() {
    return {
      classCss: {
        correct: false,
        incorrect: false
      },
    }
  },
  mounted: function() {
    var self = this
    eventBus.$on('correct', function() {
      self.classCss = { correct: true, incorrect: false }
    })

    eventBus.$on('incorrect', function() {
      self.classCss = { correct: false, incorrect: true }
    })
  },
  template: '<div class="result" v-bind:class="classCss"></div>'
})

Vue.component('last-answer', {
  data: function() {
    return {
      answer: '?'
    }
  },
  mounted: function() {
    var self = this
    eventBus.$on('correct', function(hangul) {
      self.answer = hangul
    })
    eventBus.$on('incorrect', function(hangul) {
      self.answer = hangul
    })
  },
  template: '<div class="centered">{{answer}}</div>'
})

Vue.component('answer-buttons', {
  props: ['kcombo', 'method'],
  methods: {
    playAudio: function() {
      var c = kconst[this.kcombo.codePointAt(0)]
      var v = kvowel[this.kcombo.codePointAt(1)]
      eventBus.$emit('play', c + v);
    },
    isRightSyllable: function() {
      if (this.kcombo === eventBus.hangul) {
        eventBus.$emit('correct', eventBus.hangul)
      } else {
        eventBus.$emit('incorrect', eventBus.hangul)
      }
    },
    exec: function() {
      this[this.method]()
    }
  },
  mounted: function() {
  },
  template: '<button v-on:click="exec">{{kcombo}}</button>'
})

Vue.component('score', {
  data: function() {
    return {
      correct: 0,
      incorrect: 0
    }
  },
  computed: {
    perc: function() {
      var tot = (this.incorrect + this.correct)
      return (tot > 0 ? (this.correct / tot) : 0).toFixed(2)
    }
  },
  mounted: function() {
    var self = this
    eventBus.$on('correct', function() {
      self.correct++
    })
    eventBus.$on('incorrect', function() {
      self.incorrect++
    })
    eventBus.$on('updatescore', function(correct, incorrect) {
      self.correct = correct
      self.incorrect = incorrect

    })
  },
  template: '<div class="score">{{correct}}/{{correct+incorrect}} ({{perc}}%)</div>'
})

Vue.component('dropdown-item', {
  props: ['item', 'open'],
  computed: {
    activePage: function() {
      return eventBus.route === this.item[0]
    }
  },
  mounted: function() {
    var self = this
    eventBus.$on('route', function(url) {
      eventBus.route = url
    })
  },
  methods: {
    loadurl: function(e) {
      if (e.target.className.indexOf('active') === -1) {
        eventBus.$emit('route', this.item[0])
      }
    }
  },
  template: '<div class="label" v-on:click="loadurl" v-bind:class="{ active: activePage }">{{item[1]}}</div>'
})

Vue.component('dropdown', {
  data: function() {
    return {
      open: false,
      currentRoute: ''
    }
  },
  props: ['items'],
  methods: {
    toggle: function() {
      this.open = !this.open
    }
  },
  mounted: function() {
  },
  template: '<div class="dropdown" v-on:taphold="toggle" v-on:click="toggle" v-bind:items="items" v-bind:class="{ active: open }"> \
    <dropdown-item v-for="item in items" v-bind:item="item"></dropdown-item> \
  </div>'
})

var lq = Vue.component('template-listen-quiz', {
  template: '#listen-quiz-template',
  props: ['kcomboKeys'],
  data: function() {
    return {
      currentView: 'template-listen-quiz',
      kcombo: kcombo,
      // kcomboKeys: Object.keys(kcombo),
      currentSyllable: null,
      result: null,
    }
  },
  created: function() {
    this.currentSyllable = pickOne(this.kcomboKeys)
  }
})

var sb = Vue.component('template-soundboard', {
  template: '#soundboard-template',
  props: ['kcomboKeys']
})

var dropdown = new Vue({
  el: '#dropdown',
  data: {
    items: [['template-soundboard', 'Sound Board'], ['template-listen-quiz', 'Listen Quiz']],
  }
})

var app = new Vue({
  el: '#app',
  data: {
    currentView: 'template-listen-quiz',
    kcombo: kcombo,
    kcomboKeys: Object.keys(kcombo),
    currentSyllable: null,
    result: null,
  },
  created: function() {
    var self = this
    eventBus.$on('route', function(url) {
      self.currentView = url
    })
    this.$nextTick(function() {
      eventBus.$emit('route', 'template-soundboard')
    })
  },
  methods: {
    changeView: function(template) {
      this.currentView = template
    }
  }
})

