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
      }, {
          "title": "Olahraga",
          "body": "Atlet itu sedang berlari dengan cepat di lintasan. Pembelajaran olahraga sangat penting bagi siswa.",
          "id": 3
      }, {
          "title": "Kata kerja",
          "body": "Adik sedang membaca buku di kamar. Buku itu dibaca oleh kakak juga.",
          "id": 4
      }
  ],
  tests: [
      {
          what: "never find a word that does not exist, like %w",
          search: "inexistent",
          found: 0
      }, {
          what: "stem 'berlari' to 'lari'",
          search: "lari",
          found: 1
      }, {
          what: "stem 'pembelajaran' to 'ajar'",
          search: "ajar",
          found: 1
      }, {
          what: "stem 'dibaca' to 'baca'",
          search: "baca",
          found: 1
      }
  ]
}