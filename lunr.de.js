/*!
 * Lunr languages, `German` language
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
    lunr.de = function() {
      this.pipeline.reset();
      this.pipeline.add(
        lunr.de.trimmer,
        lunr.de.stopWordFilter,
        lunr.de.stemmer
      );

      // for lunr version 2
      // this is necessary so that every searched word is also stemmed before
      // in lunr <= 1 this is not needed, as it is done using the normal pipeline
      if (this.searchPipeline) {
        this.searchPipeline.reset();
        this.searchPipeline.add(lunr.de.stemmer)
      }
    };

    /* lunr trimmer function */
    lunr.de.wordCharacters = "A-Za-z\xAA\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02B8\u02E0-\u02E4\u1D00-\u1D25\u1D2C-\u1D5C\u1D62-\u1D65\u1D6B-\u1D77\u1D79-\u1DBE\u1E00-\u1EFF\u2071\u207F\u2090-\u209C\u212A\u212B\u2132\u214E\u2160-\u2188\u2C60-\u2C7F\uA722-\uA787\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA7FF\uAB30-\uAB5A\uAB5C-\uAB64\uFB00-\uFB06\uFF21-\uFF3A\uFF41-\uFF5A";
    lunr.de.trimmer = lunr.trimmerSupport.generateTrimmer(lunr.de.wordCharacters);

    lunr.Pipeline.registerFunction(lunr.de.trimmer, 'trimmer-de');

    /* lunr stemmer function */
    lunr.de.stemmer = (function() {
      /* create the wrapped stemmer object */
      var Among = lunr.stemmerSupport.Among,
        SnowballProgram = lunr.stemmerSupport.SnowballProgram,
        st = new function GermanStemmer() {
          var a_0 = [new Among("", -1, 6), new Among("U", 0, 2),
              new Among("Y", 0, 1), new Among("\u00E4", 0, 3),
              new Among("\u00F6", 0, 4), new Among("\u00FC", 0, 5)
            ],
            a_1 = [
              new Among("e", -1, 2), new Among("em", -1, 1),
              new Among("en", -1, 2), new Among("ern", -1, 1),
              new Among("er", -1, 1), new Among("s", -1, 3),
              new Among("es", 5, 2)
            ],
            a_2 = [new Among("en", -1, 1),
              new Among("er", -1, 1), new Among("st", -1, 2),
              new Among("est", 2, 1)
            ],
            a_3 = [new Among("ig", -1, 1),
              new Among("lich", -1, 1)
            ],
            a_4 = [new Among("end", -1, 1),
              new Among("ig", -1, 2), new Among("ung", -1, 1),
              new Among("lich", -1, 3), new Among("isch", -1, 2),
              new Among("ik", -1, 2), new Among("heit", -1, 3),
              new Among("keit", -1, 4)
            ],
            g_v = [17, 65, 16, 1, 0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0, 8, 0, 32, 8
            ],
            g_s_ending = [117, 30, 5],
            g_st_ending = [
              117, 30, 4
            ],
            I_x, I_p2, I_p1, sbp = new SnowballProgram();
          this.setCurrent = function(word) {
            sbp.setCurrent(word);
          };
          this.getCurrent = function() {
            return sbp.getCurrent();
          };

          function habr1(c1, c2, v_1) {
            if (sbp.eq_s(1, c1)) {
              sbp.ket = sbp.cursor;
              if (sbp.in_grouping(g_v, 97, 252)) {
                sbp.slice_from(c2);
                sbp.cursor = v_1;
                return true;
              }
            }
            return false;
          }

          function r_prelude() {
            var v_1 = sbp.cursor,
              v_2, v_3, v_4, v_5;
            while (true) {
              v_2 = sbp.cursor;
              sbp.bra = v_2;
              if (sbp.eq_s(1, "\u00DF")) {
                sbp.ket = sbp.cursor;
                sbp.slice_from("ss");
              } else {
                if (v_2 >= sbp.limit)
                  break;
                sbp.cursor = v_2 + 1;
              }
            }
            sbp.cursor = v_1;
            while (true) {
              v_3 = sbp.cursor;
              while (true) {
                v_4 = sbp.cursor;
                if (sbp.in_grouping(g_v, 97, 252)) {
                  v_5 = sbp.cursor;
                  sbp.bra = v_5;
                  if (habr1("u", "U", v_4))
                    break;
                  sbp.cursor = v_5;
                  if (habr1("y", "Y", v_4))
                    break;
                }
                if (v_4 >= sbp.limit) {
                  sbp.cursor = v_3;
                  return;
                }
                sbp.cursor = v_4 + 1;
              }
            }
          }

          function habr2() {
            while (!sbp.in_grouping(g_v, 97, 252)) {
              if (sbp.cursor >= sbp.limit)
                return true;
              sbp.cursor++;
            }
            while (!sbp.out_grouping(g_v, 97, 252)) {
              if (sbp.cursor >= sbp.limit)
                return true;
              sbp.cursor++;
            }
            return false;
          }

          function r_mark_regions() {
            I_p1 = sbp.limit;
            I_p2 = I_p1;
            var c = sbp.cursor + 3;
            if (0 <= c && c <= sbp.limit) {
              I_x = c;
              if (!habr2()) {
                I_p1 = sbp.cursor;
                if (I_p1 < I_x)
                  I_p1 = I_x;
                if (!habr2())
                  I_p2 = sbp.cursor;
              }
            }
          }

          function r_postlude() {
            var among_var, v_1;
            while (true) {
              v_1 = sbp.cursor;
              sbp.bra = v_1;
              among_var = sbp.find_among(a_0, 6);
              if (!among_var)
                return;
              sbp.ket = sbp.cursor;
              switch (among_var) {
                case 1:
                  sbp.slice_from("y");
                  break;
                case 2:
                case 5:
                  sbp.slice_from("u");
                  break;
                case 3:
                  sbp.slice_from("a");
                  break;
                case 4:
                  sbp.slice_from("o");
                  break;
                case 6:
                  if (sbp.cursor >= sbp.limit)
                    return;
                  sbp.cursor++;
                  break;
              }
            }
          }

          function r_R1() {
            return I_p1 <= sbp.cursor;
          }

          function r_R2() {
            return I_p2 <= sbp.cursor;
          }

          function r_standard_suffix() {
            var among_var, v_1 = sbp.limit - sbp.cursor,
              v_2, v_3, v_4;
            sbp.ket = sbp.cursor;
            among_var = sbp.find_among_b(a_1, 7);
            if (among_var) {
              sbp.bra = sbp.cursor;
              if (r_R1()) {
                switch (among_var) {
                  case 1:
                    sbp.slice_del();
                    break;
                  case 2:
                    sbp.slice_del();
                    sbp.ket = sbp.cursor;
                    if (sbp.eq_s_b(1, "s")) {
                      sbp.bra = sbp.cursor;
                      if (sbp.eq_s_b(3, "nis"))
                        sbp.slice_del();
                    }
                    break;
                  case 3:
                    if (sbp.in_grouping_b(g_s_ending, 98, 116))
                      sbp.slice_del();
                    break;
                }
              }
            }
            sbp.cursor = sbp.limit - v_1;
            sbp.ket = sbp.cursor;
            among_var = sbp.find_among_b(a_2, 4);
            if (among_var) {
              sbp.bra = sbp.cursor;
              if (r_R1()) {
                switch (among_var) {
                  case 1:
                    sbp.slice_del();
                    break;
                  case 2:
                    if (sbp.in_grouping_b(g_st_ending, 98, 116)) {
                      var c = sbp.cursor - 3;
                      if (sbp.limit_backward <= c && c <= sbp.limit) {
                        sbp.cursor = c;
                        sbp.slice_del();
                      }
                    }
                    break;
                }
              }
            }
            sbp.cursor = sbp.limit - v_1;
            sbp.ket = sbp.cursor;
            among_var = sbp.find_among_b(a_4, 8);
            if (among_var) {
              sbp.bra = sbp.cursor;
              if (r_R2()) {
                switch (among_var) {
                  case 1:
                    sbp.slice_del();
                    sbp.ket = sbp.cursor;
                    if (sbp.eq_s_b(2, "ig")) {
                      sbp.bra = sbp.cursor;
                      v_2 = sbp.limit - sbp.cursor;
                      if (!sbp.eq_s_b(1, "e")) {
                        sbp.cursor = sbp.limit - v_2;
                        if (r_R2())
                          sbp.slice_del();
                      }
                    }
                    break;
                  case 2:
                    v_3 = sbp.limit - sbp.cursor;
                    if (!sbp.eq_s_b(1, "e")) {
                      sbp.cursor = sbp.limit - v_3;
                      sbp.slice_del();
                    }
                    break;
                  case 3:
                    sbp.slice_del();
                    sbp.ket = sbp.cursor;
                    v_4 = sbp.limit - sbp.cursor;
                    if (!sbp.eq_s_b(2, "er")) {
                      sbp.cursor = sbp.limit - v_4;
                      if (!sbp.eq_s_b(2, "en"))
                        break;
                    }
                    sbp.bra = sbp.cursor;
                    if (r_R1())
                      sbp.slice_del();
                    break;
                  case 4:
                    sbp.slice_del();
                    sbp.ket = sbp.cursor;
                    among_var = sbp.find_among_b(a_3, 2);
                    if (among_var) {
                      sbp.bra = sbp.cursor;
                      if (r_R2() && among_var == 1)
                        sbp.slice_del();
                    }
                    break;
                }
              }
            }
          }
          this.stem = function() {
            var v_1 = sbp.cursor;
            r_prelude();
            sbp.cursor = v_1;
            r_mark_regions();
            sbp.limit_backward = v_1;
            sbp.cursor = sbp.limit;
            r_standard_suffix();
            sbp.cursor = sbp.limit_backward;
            r_postlude();
            return true;
          }
        };

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

    lunr.Pipeline.registerFunction(lunr.de.stemmer, 'stemmer-de');

    lunr.de.stopWordFilter = lunr.generateStopWordFilter(' a ab aber ach acht achte achten achter achtes ag alle allein allem allen aller allerdings alles allgemeinen als also am an ander andere anderem anderen anderer anderes anderm andern anderr anders au auch auf aus ausser ausserdem außer außerdem b bald bei beide beiden beim beispiel bekannt bereits besonders besser besten bin bis bisher bist c d d.h da dabei dadurch dafür dagegen daher dahin dahinter damals damit danach daneben dank dann daran darauf daraus darf darfst darin darum darunter darüber das dasein daselbst dass dasselbe davon davor dazu dazwischen daß dein deine deinem deinen deiner deines dem dementsprechend demgegenüber demgemäss demgemäß demselben demzufolge den denen denn denselben der deren derer derjenige derjenigen dermassen dermaßen derselbe derselben des deshalb desselben dessen deswegen dich die diejenige diejenigen dies diese dieselbe dieselben diesem diesen dieser dieses dir doch dort drei drin dritte dritten dritter drittes du durch durchaus durfte durften dürfen dürft e eben ebenso ehrlich ei ei eigen eigene eigenen eigener eigenes ein einander eine einem einen einer eines einig einige einigem einigen einiger einiges einmal eins elf en ende endlich entweder er ernst erst erste ersten erster erstes es etwa etwas euch euer eure eurem euren eurer eures f folgende früher fünf fünfte fünften fünfter fünftes für g gab ganz ganze ganzen ganzer ganzes gar gedurft gegen gegenüber gehabt gehen geht gekannt gekonnt gemacht gemocht gemusst genug gerade gern gesagt geschweige gewesen gewollt geworden gibt ging gleich gott gross grosse grossen grosser grosses groß große großen großer großes gut gute guter gutes h hab habe haben habt hast hat hatte hatten hattest hattet heisst her heute hier hin hinter hoch hätte hätten i ich ihm ihn ihnen ihr ihre ihrem ihren ihrer ihres im immer in indem infolgedessen ins irgend ist j ja jahr jahre jahren je jede jedem jeden jeder jedermann jedermanns jedes jedoch jemand jemandem jemanden jene jenem jenen jener jenes jetzt k kam kann kannst kaum kein keine keinem keinen keiner keines kleine kleinen kleiner kleines kommen kommt konnte konnten kurz können könnt könnte l lang lange leicht leide lieber los m machen macht machte mag magst mahn mal man manche manchem manchen mancher manches mann mehr mein meine meinem meinen meiner meines mensch menschen mich mir mit mittel mochte mochten morgen muss musst musste mussten muß mußt möchte mögen möglich mögt müssen müsst müßt n na nach nachdem nahm natürlich neben nein neue neuen neun neunte neunten neunter neuntes nicht nichts nie niemand niemandem niemanden noch nun nur o ob oben oder offen oft ohne ordnung p q r recht rechte rechten rechter rechtes richtig rund s sa sache sagt sagte sah satt schlecht schluss schon sechs sechste sechsten sechster sechstes sehr sei seid seien sein seine seinem seinen seiner seines seit seitdem selbst sich sie sieben siebente siebenten siebenter siebentes sind so solang solche solchem solchen solcher solches soll sollen sollst sollt sollte sollten sondern sonst soweit sowie später startseite statt steht suche t tag tage tagen tat teil tel tritt trotzdem tun u uhr um und und? uns unse unsem unsen unser unsere unserer unses unter v vergangenen viel viele vielem vielen vielleicht vier vierte vierten vierter viertes vom von vor w wahr? wann war waren warst wart warum was weg wegen weil weit weiter weitere weiteren weiteres welche welchem welchen welcher welches wem wen wenig wenige weniger weniges wenigstens wenn wer werde werden werdet weshalb wessen wie wieder wieso will willst wir wird wirklich wirst wissen wo woher wohin wohl wollen wollt wollte wollten worden wurde wurden während währenddem währenddessen wäre würde würden x y z z.b zehn zehnte zehnten zehnter zehntes zeit zu zuerst zugleich zum zunächst zur zurück zusammen zwanzig zwar zwei zweite zweiten zweiter zweites zwischen zwölf über überhaupt übrigens'.split(' '));

    lunr.Pipeline.registerFunction(lunr.de.stopWordFilter, 'stopWordFilter-de');
  };
}))