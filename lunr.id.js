/*!
 * Lunr languages, `Indonesian` language
 * https://github.com/MihaiValentin/lunr-languages
 *
 * Copyright 2014, Mihai Valentin
 * http://www.mozilla.org/MPL/
 */
/*!
 * based on
 * Snowball JavaScript Library v0.3
 * http://code.google.com/p/urim/
 * http://snowball.tartarus.org/
 *
 * Copyright 2010, Oleg Mazko
 * http://www.mozilla.org/MPL/
 */

/**
 * export the module via AMD, CommonJS or as a browser global
 * Export code from https://github.com/umdjs/umd/blob/master/returnExports.js
 */
;
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(factory)
  } else if (typeof exports === 'object') {
    /**
     * Node. Does not work with strict CommonJS, but
     * only CommonJS-like environments that support module.exports,
     * like Node.
     */
    module.exports = factory()
  } else {
    // Browser globals (root is window)
    factory()(root.lunr);
  }
}(this, function() {
  /**
   * Just return a value to define the module export.
   * This example returns an object, but the module
   * can return a function as the exported value.
   */
  return function(lunr) {
    /* throw error if lunr is not yet included */
    if ('undefined' === typeof lunr) {
      throw new Error('Lunr is not present. Please include / require Lunr before this script.');
    }

    /* throw error if lunr stemmer support is not yet included */
    if ('undefined' === typeof lunr.stemmerSupport) {
      throw new Error('Lunr stemmer support is not present. Please include / require Lunr stemmer support before this script.');
    }

    /* register specific locale function */
    lunr.id = function() {
      this.pipeline.reset();
      this.pipeline.add(
        lunr.id.trimmer,
        lunr.id.stopWordFilter,
        lunr.id.stemmer
      );

      // for lunr version 2
      // this is necessary so that every searched word is also stemmed before
      // in lunr <= 1 this is not needed, as it is done using the normal pipeline
      if (this.searchPipeline) {
        this.searchPipeline.reset();
        this.searchPipeline.add(lunr.id.stemmer)
      }
    };

    /* lunr trimmer function */
    lunr.id.wordCharacters = "A-Za-z\xAA\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02B8\u02E0-\u02E4\u1D00-\u1D25\u1D2C-\u1D5C\u1D62-\u1D65\u1D6B-\u1D77\u1D79-\u1DBE\u1E00-\u1EFF\u2071\u207F\u2090-\u209C\u212A\u212B\u2132\u214E\u2160-\u2188\u2C60-\u2C7F\uA722-\uA787\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA7FF\uAB30-\uAB5A\uAB5C-\uAB64\uFB00-\uFB06\uFF21-\uFF3A\uFF41-\uFF5A";
    lunr.id.trimmer = lunr.trimmerSupport.generateTrimmer(lunr.id.wordCharacters);

    lunr.Pipeline.registerFunction(lunr.id.trimmer, 'trimmer-id');

    /* lunr stemmer function */
    lunr.id.stemmer = (function() {
      /* create the wrapped stemmer object */
      var Among = lunr.stemmerSupport.Among,
        SnowballProgram = lunr.stemmerSupport.SnowballProgram,
        st = new function IndonesianStemmer() {
          /** @const */
          var a_0 = [
            new Among("kah", -1, 1),
            new Among("lah", -1, 1),
            new Among("pun", -1, 1)
          ];

          /** @const */
          var a_1 = [
            new Among("nya", -1, 1),
            new Among("ku", -1, 1),
            new Among("mu", -1, 1)
          ];

          /** @const */
          var a_2 = [
            new Among("i", -1, 1, r_SUFFIX_I_OK),
            new Among("an", -1, 1, r_SUFFIX_AN_OK),
            new Among("kan", 1, 1, r_SUFFIX_KAN_OK)
          ];

          /** @const */
          var a_3 = [
            new Among("di", -1, 1),
            new Among("ke", -1, 2),
            new Among("me", -1, 1),
            new Among("mem", 2, 5),
            new Among("men", 2, 1),
            new Among("meng", 4, 1),
            new Among("meny", 4, 3, r_VOWEL),
            new Among("pem", -1, 6),
            new Among("pen", -1, 2),
            new Among("peng", 8, 2),
            new Among("peny", 8, 4, r_VOWEL),
            new Among("ter", -1, 1)
          ];

          /** @const */
          var a_4 = [
            new Among("be", -1, 3, r_KER),
            new Among("belajar", 0, 4),
            new Among("ber", 0, 3),
            new Among("pe", -1, 1),
            new Among("pelajar", 3, 2),
            new Among("per", 3, 1)
          ];

          /** @const */
          var /** Array<int> */ g_vowel = [17, 65, 16];

          var /** number */ I_prefix = 0;
          var /** number */ I_measure = 0;

          var sbp = new SnowballProgram();


          /** @return {boolean} */
          function r_remove_particle() {
            sbp.ket = sbp.cursor;
            if (sbp.find_among_b(a_0) == 0) {
              return false;
            }
            sbp.bra = sbp.cursor;
            if (!sbp.slice_del()) {
              return false;
            }
            I_measure -= 1;
            return true;
          };

          /** @return {boolean} */
          function r_remove_possessive_pronoun() {
            sbp.ket = sbp.cursor;
            if (sbp.find_among_b(a_1) == 0) {
              return false;
            }
            sbp.bra = sbp.cursor;
            if (!sbp.slice_del()) {
              return false;
            }
            I_measure -= 1;
            return true;
          };

          /** @return {boolean} */
          function r_SUFFIX_KAN_OK() {
            if (!(I_prefix != 3)) {
              return false;
            }
            if (!(I_prefix != 2)) {
              return false;
            }
            return true;
          };

          /** @return {boolean} */
          function r_SUFFIX_AN_OK() {
            if (!(I_prefix != 1)) {
              return false;
            }
            return true;
          };

          /** @return {boolean} */
          function r_SUFFIX_I_OK() {
            if (!(I_prefix <= 2)) {
              return false;
            } {
              var /** number */ v_1 = sbp.limit - sbp.cursor;
              lab0: {
                if (!(sbp.eq_s_b("s"))) {
                  break lab0;
                }
                return false;
              }
              sbp.cursor = sbp.limit - v_1;
            }
            return true;
          };

          /** @return {boolean} */
          function r_remove_suffix() {
            sbp.ket = sbp.cursor;
            if (sbp.find_among_b(a_2) == 0) {
              return false;
            }
            sbp.bra = sbp.cursor;
            if (!sbp.slice_del()) {
              return false;
            }
            I_measure -= 1;
            return true;
          };

          /** @return {boolean} */
          function r_VOWEL() {
            if (!(sbp.in_grouping(g_vowel, 97, 117))) {
              return false;
            }
            return true;
          };

          /** @return {boolean} */
          function r_KER() {
            if (!(sbp.out_grouping(g_vowel, 97, 117))) {
              return false;
            }
            if (!(sbp.eq_s("er"))) {
              return false;
            }
            return true;
          };

          /** @return {boolean} */
          function r_remove_first_order_prefix() {
            var /** number */ among_var;
            sbp.bra = sbp.cursor;
            among_var = sbp.find_among(a_3);
            if (among_var == 0) {
              return false;
            }
            sbp.ket = sbp.cursor;
            switch (among_var) {
              case 1:
                if (!sbp.slice_del()) {
                  return false;
                }
                I_prefix = 1;
                I_measure -= 1;
                break;
              case 2:
                if (!sbp.slice_del()) {
                  return false;
                }
                I_prefix = 3;
                I_measure -= 1;
                break;
              case 3:
                I_prefix = 1;
                if (!sbp.slice_from("s")) {
                  return false;
                }
                I_measure -= 1;
                break;
              case 4:
                I_prefix = 3;
                if (!sbp.slice_from("s")) {
                  return false;
                }
                I_measure -= 1;
                break;
              case 5:
                I_prefix = 1;
                I_measure -= 1;
                lab0: {
                  var /** number */ v_1 = sbp.cursor;
                  lab1: {
                    var /** number */ v_2 = sbp.cursor;
                    if (!(sbp.in_grouping(g_vowel, 97, 117))) {
                      break lab1;
                    }
                    sbp.cursor = v_2;
                    if (!sbp.slice_from("p")) {
                      return false;
                    }
                    break lab0;
                  }
                  sbp.cursor = v_1;
                  if (!sbp.slice_del()) {
                    return false;
                  }
                }
                break;
              case 6:
                I_prefix = 3;
                I_measure -= 1;
                lab2: {
                  var /** number */ v_3 = sbp.cursor;
                  lab3: {
                    var /** number */ v_4 = sbp.cursor;
                    if (!(sbp.in_grouping(g_vowel, 97, 117))) {
                      break lab3;
                    }
                    sbp.cursor = v_4;
                    if (!sbp.slice_from("p")) {
                      return false;
                    }
                    break lab2;
                  }
                  sbp.cursor = v_3;
                  if (!sbp.slice_del()) {
                    return false;
                  }
                }
                break;
            }
            return true;
          };

          /** @return {boolean} */
          function r_remove_second_order_prefix() {
            var /** number */ among_var;
            sbp.bra = sbp.cursor;
            among_var = sbp.find_among(a_4);
            if (among_var == 0) {
              return false;
            }
            sbp.ket = sbp.cursor;
            switch (among_var) {
              case 1:
                if (!sbp.slice_del()) {
                  return false;
                }
                I_prefix = 2;
                I_measure -= 1;
                break;
              case 2:
                if (!sbp.slice_from("ajar")) {
                  return false;
                }
                I_measure -= 1;
                break;
              case 3:
                if (!sbp.slice_del()) {
                  return false;
                }
                I_prefix = 4;
                I_measure -= 1;
                break;
              case 4:
                if (!sbp.slice_from("ajar")) {
                  return false;
                }
                I_prefix = 4;
                I_measure -= 1;
                break;
            }
            return true;
          };

          this.stem = /** @return {boolean} */ function() {
            I_measure = 0;
            var /** number */ v_1 = sbp.cursor;
            lab0: {
              while (true) {
                var /** number */ v_2 = sbp.cursor;
                lab1: {
                  golab2: while (true) {
                    lab3: {
                      if (!(sbp.in_grouping(g_vowel, 97, 117))) {
                        break lab3;
                      }
                      break golab2;
                    }
                    if (sbp.cursor >= sbp.limit) {
                      break lab1;
                    }
                    sbp.cursor++;
                  }
                  I_measure += 1;
                  continue;
                }
                sbp.cursor = v_2;
                break;
              }
            }
            sbp.cursor = v_1;
            if (!(I_measure > 2)) {
              return false;
            }
            I_prefix = 0;
            sbp.limit_backward = sbp.cursor;
            sbp.cursor = sbp.limit;
            var /** number */ v_4 = sbp.limit - sbp.cursor;
            r_remove_particle();
            sbp.cursor = sbp.limit - v_4;
            if (!(I_measure > 2)) {
              return false;
            }
            var /** number */ v_5 = sbp.limit - sbp.cursor;
            r_remove_possessive_pronoun();
            sbp.cursor = sbp.limit - v_5;
            sbp.cursor = sbp.limit_backward;
            if (!(I_measure > 2)) {
              return false;
            }
            lab4: {
              var /** number */ v_6 = sbp.cursor;
              lab5: {
                var /** number */ v_7 = sbp.cursor;
                if (!r_remove_first_order_prefix()) {
                  break lab5;
                }
                var /** number */ v_8 = sbp.cursor;
                lab6: {
                  var /** number */ v_9 = sbp.cursor;
                  if (!(I_measure > 2)) {
                    break lab6;
                  }
                  sbp.limit_backward = sbp.cursor;sbp.cursor = sbp.limit;
                  if (!r_remove_suffix()) {
                    break lab6;
                  }
                  sbp.cursor = sbp.limit_backward;
                  sbp.cursor = v_9;
                  if (!(I_measure > 2)) {
                    break lab6;
                  }
                  if (!r_remove_second_order_prefix()) {
                    break lab6;
                  }
                }
                sbp.cursor = v_8;
                sbp.cursor = v_7;
                break lab4;
              }
              sbp.cursor = v_6;
              var /** number */ v_10 = sbp.cursor;
              r_remove_second_order_prefix();
              sbp.cursor = v_10;
              var /** number */ v_11 = sbp.cursor;
              lab7: {
                if (!(I_measure > 2)) {
                  break lab7;
                }
                sbp.limit_backward = sbp.cursor;sbp.cursor = sbp.limit;
                if (!r_remove_suffix()) {
                  break lab7;
                }
                sbp.cursor = sbp.limit_backward;
              }
              sbp.cursor = v_11;
            }
            return true;
          };

          /**@return{string}*/

          this.setCurrent = function(word) {
            sbp.setCurrent(word);
          };

          this.getCurrent = function() {
            return sbp.getCurrent();
          };



          this['stemWord'] = function( /**string*/ word) {
            // sbp.setCurrent(word);
            this.stem();
            // return sbp.getCurrent();
          };
        };;

      /* and return a function that stems a word for the current locale */
      return function(token) {
        // for lunr version 2
        if (typeof token.update === "function") {
          return token.update(function(word) {
            st.setCurrent(word);
            st.stem();
            return st.getCurrent();
          })
        } else { // for lunr version <= 1
          st.setCurrent(token);
          st.stem();
          return st.getCurrent();
        }
      }
    })();

    lunr.Pipeline.registerFunction(lunr.id.stemmer, 'stemmer-id');

    lunr.id.stopWordFilter = lunr.generateStopWordFilter('ada adalah adanya adapun agak agaknya agar akan akankah akhir akhiri akhirnya aku akulah amat amatlah anda andalah antar antara antaranya apa apaan apabila apakah apalagi apatah artinya asal asalkan atas atau ataukah ataupun awal awalnya bagai bagaikan bagaimana bagaimanakah bagaimanapun bagi bagian bahkan bahwa bahwasanya bakal bakalan balik banyak bapak baru bawah beberapa begini beginian beginikah beginilah begitu begitukah begitulah begitupun bekerja belakang belakangan belum belumlah benar benarkah benarlah berada berakhir berakhirlah berakhirnya berapa berapakah berapalah berapapun berarti berawal berbagai berdatangan beri berikan berikut berikutnya berjumlah berkali-kali berkata berkehendak berkeinginan berkenaan berlainan berlalu berlangsung berlebihan bermacam bermacam-macam bermaksud bermula bersama bersama-sama bersiap bersiap-siap bertanya bertanya-tanya berturut berturut-turut bertutur berujar berupa besar betul betulkah biasa biasanya bila bilakah bisa bisakah boleh bolehkah bolehlah buat bukan bukankah bukanlah bukannya bulan bung cara caranya cukup cukupkah cukuplah cuma dahulu dalam dan dapat dari daripada datang dekat demi demikian demikianlah dengan depan di dia diakhiri diakhirinya dialah diantara diantaranya diberi diberikan diberikannya dibuat dibuatnya didapat didatangkan digunakan diibaratkan diibaratkannya diingat diingatkan diinginkan dijawab dijelaskan dijelaskannya dikarenakan dikatakan dikatakannya dikerjakan diketahui diketahuinya dikira dilakukan dilalui dilihat dimaksud dimaksudkan dimaksudkannya dimaksudnya diminta dimintai dimisalkan dimulai dimulailah dimulainya dimungkinkan dini dipastikan diperbuat diperbuatnya dipergunakan diperkirakan diperlihatkan diperlukan diperlukannya dipersoalkan dipertanyakan dipunyai diri dirinya disampaikan disebut disebutkan disebutkannya disini disinilah ditambahkan ditandaskan ditanya ditanyai ditanyakan ditegaskan ditujukan ditunjuk ditunjuki ditunjukkan ditunjukkannya ditunjuknya dituturkan dituturkannya diucapkan diucapkannya diungkapkan dong dulu empat enggak enggaknya entah entahlah guna gunakan hal hampir hanya hanyalah harus haruslah harusnya hendak hendaklah hendaknya hingga ia ialah ibarat ibaratkan ibaratnya ikut ingat ingat-ingat ingin inginkah inginkan ini inikah inilah itu itukah itulah jadi jadilah jadinya jangan jangankan janganlah jauh jawab jawaban jawabnya jelas jelaskan jelaslah jelasnya jika jikalau juga jumlah jumlahnya justru kala kalau kalaulah kalaupun kalian kami kamilah kamu kamulah kan kapan kapankah kapanpun karena karenanya kasus kata katakan katakanlah katanya ke keadaan kebetulan kecil kedua keduanya keinginan kelamaan kelihatan kelihatannya kelima keluar kembali kemudian kemungkinan kemungkinannya kenapa kepada kepadanya kesampaian keseluruhan keseluruhannya keterlaluan ketika khususnya kini kinilah kira kira-kira kiranya kita kitalah kok kurang lagi lagian lah lain lainnya lalu lama lamanya lanjut lanjutnya lebih lewat lima luar macam maka makanya makin malah malahan mampu mampukah mana manakala manalagi masa masalah masalahnya masih masihkah masing masing-masing mau maupun melainkan melakukan melalui melihat melihatnya memang memastikan memberi memberikan membuat memerlukan memihak meminta memintakan memisalkan memperbuat mempergunakan memperkirakan memperlihatkan mempersiapkan mempersoalkan mempertanyakan mempunyai memulai memungkinkan menaiki menambahkan menandaskan menanti menanti-nanti menantikan menanya menanyai menanyakan mendapat mendapatkan mendatang mendatangi mendatangkan menegaskan mengakhiri mengapa mengatakan mengatakannya mengenai mengerjakan mengetahui menggunakan menghendaki mengibaratkan mengibaratkannya mengingat mengingatkan menginginkan mengira mengucapkan mengucapkannya mengungkapkan menjadi menjawab menjelaskan menuju menunjuk menunjuki menunjukkan menunjuknya menurut menuturkan menyampaikan menyangkut menyatakan menyebutkan menyeluruh menyiapkan merasa mereka merekalah merupakan meski meskipun meyakini meyakinkan minta mirip misal misalkan misalnya mula mulai mulailah mulanya mungkin mungkinkah nah naik namun nanti nantinya nyaris nyatanya oleh olehnya pada padahal padanya paling panjang pantas para pasti pastilah penting pentingnya per percuma perlu perlukah perlunya pernah persoalan pertama pertama-tama pertanyaan pertanyakan pihak pihaknya pukul pula pun punya rasa rasanya rata rupanya saat saatnya saja sajalah saling sama sama-sama sambil sampai sampai-sampai sampaikan sana sangat sangatlah satu saya sayalah se sebab sebabnya sebagai sebagaimana sebagainya sebagian sebaik sebaik-baiknya sebaiknya sebaliknya sebanyak sebegini sebegitu sebelum sebelumnya sebenarnya seberapa sebesar sebetulnya sebisanya sebuah sebut sebutlah sebutnya secara secukupnya sedang sedangkan sedemikian sedikit sedikitnya seenaknya segala segalanya segera seharusnya sehingga seingat sejak sejauh sejenak sejumlah sekadar sekadarnya sekali sekali-kali sekalian sekaligus sekalipun sekarang sekarang sekecil seketika sekiranya sekitar sekitarnya sekurang-kurangnya sekurangnya sela selain selaku selalu selama selama-lamanya selamanya selanjutnya seluruh seluruhnya semacam semakin semampu semampunya semasa semasih semata semata-mata semaunya sementara semisal semisalnya sempat semua semuanya semula sendiri sendirian sendirinya seolah seolah-olah seorang sepanjang sepantasnya sepantasnyalah seperlunya seperti sepertinya sepihak sering seringnya serta serupa sesaat sesama sesampai sesegera sesekali seseorang sesuatu sesuatunya sesudah sesudahnya setelah setempat setengah seterusnya setiap setiba setibanya setidak-tidaknya setidaknya setinggi seusai sewaktu siap siapa siapakah siapapun sini sinilah soal soalnya suatu sudah sudahkah sudahlah supaya tadi tadinya tahu tahun tak tambah tambahnya tampak tampaknya tandas tandasnya tanpa tanya tanyakan tanyanya tapi tegas tegasnya telah tempat tengah tentang tentu tentulah tentunya tepat terakhir terasa terbanyak terdahulu terdapat terdiri terhadap terhadapnya teringat teringat-ingat terjadi terjadilah terjadinya terkira terlalu terlebih terlihat termasuk ternyata tersampaikan tersebut tersebutlah tertentu tertuju terus terutama tetap tetapi tiap tiba tiba-tiba tidak tidakkah tidaklah tiga tinggi toh tunjuk turut tutur tuturnya ucap ucapnya ujar ujarnya umum umumnya ungkap ungkapnya untuk usah usai waduh wah wahai waktu waktunya walau walaupun wong yaitu yakin yakni yang'.split(' '));

    lunr.Pipeline.registerFunction(lunr.id.stopWordFilter, 'stopWordFilter-id');
  };
}))