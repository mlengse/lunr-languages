module.exports = {
  fields: [
      {
          name: 'title',
          config: { boost: 10 }
      }, {
          name: 'body'
      }
  ],
  documents: [
      {
          "title": "Indonesia",
          "body": "Indonesia, dengan nama resmi Republik Indonesia,[a] adalah sebuah negara kepulauan di Asia Tenggara yang dilintasi garis khatulistiwa dan berada di antara daratan benua Asia dan Oseania sehingga dikenal sebagai negara lintas benua, serta antara Samudra Pasifik dan Samudra Hindia.",
          "id": 1
      }, {
          "title": "Pembagian administratif Indonesia",
          "body": "Secara umum, Indonesia dibagi atas empat tingkat pembagian administratif. Dua tingkatan tertinggi disebutkan dalam UUD 1945 dan merupakan daerah otonom, sedangkan dua tingkatan terakhir disebutkan dalam UU No. 23 Tahun 2014.",
          "id": 2
      }
  ],
  tests: [
      {
          what: "find the word %w",
          search: "Indonesia*",
          found: 3
      }, {
          what: "find the word %w",
          search: "tingkat",
          found: 3
      }, {
          what: "never find a word that does not exist, like %w",
          search: "inexistent",
          found: 0
      }, {
          what: "find a correctly stemmed word %w",
          search: "bagi",
          found: 3
      }
  ]
}