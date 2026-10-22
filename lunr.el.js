/*!
 * Lunr languages, `Greek` language
 * https://github.com/MihaiValentin/lunr-languages
 *
 * Copyright 2023, Panos Bariamis
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
    lunr.el = function() {
      this.pipeline.reset();

      if (this.searchPipeline === undefined) {
        this.pipeline.add(
          lunr.el.trimmer,
          lunr.el.normilizer
        );
      }

      this.pipeline.add(
        lunr.el.stopWordFilter,
        lunr.el.stemmer
      );

      // for lunr version 2
      // this is necessary so that every searched word is also stemmed before
      // in lunr <= 1 this is not needed, as it is done using the normal pipeline
      if (this.searchPipeline) {
        this.searchPipeline.reset();
        this.searchPipeline.add(
          lunr.el.stemmer
        );
      }
    };

    /* lunr trimmer function */
    lunr.el.wordCharacters = "A-Za-zΑαΒβΓγΔδΕεΖζΗηΘθΙιΚκΛλΜμΝνΞξΟοΠπΡρΣσςΤτΥυΦφΧχΨψΩωΆάΈέΉήΊίΌόΎύΏώΪΐΫΰΐΰ";
    lunr.el.trimmer = lunr.trimmerSupport.generateTrimmer(lunr.el.wordCharacters);

    lunr.Pipeline.registerFunction(lunr.el.trimmer, 'trimmer-el');

    /* lunr stemmer function */
    lunr.el.stemmer = (function() {
      var stepOneExceptions = {
        'ΦΑΓΙΑ': 'ΦΑ',
        'ΦΑΓΙΟΥ': 'ΦΑ',
        'ΦΑΓΙΩΝ': 'ΦΑ',
        'ΣΚΑΓΙΑ': 'ΣΚΑ',
        'ΣΚΑΓΙΟΥ': 'ΣΚΑ',
        'ΣΚΑΓΙΩΝ': 'ΣΚΑ',
        'ΣΟΓΙΟΥ': 'ΣΟ',
        'ΣΟΓΙΑ': 'ΣΟ',
        'ΣΟΓΙΩΝ': 'ΣΟ',
        'ΤΑΤΟΓΙΑ': 'ΤΑΤΟ',
        'ΤΑΤΟΓΙΟΥ': 'ΤΑΤΟ',
        'ΤΑΤΟΓΙΩΝ': 'ΤΑΤΟ',
        'ΚΡΕΑΣ': 'ΚΡΕ',
        'ΚΡΕΑΤΟΣ': 'ΚΡΕ',
        'ΚΡΕΑΤΑ': 'ΚΡΕ',
        'ΚΡΕΑΤΩΝ': 'ΚΡΕ',
        'ΠΕΡΑΣ': 'ΠΕΡ',
        'ΠΕΡΑΤΟΣ': 'ΠΕΡ',
        'ΠΕΡΑΤΑ': 'ΠΕΡ',
        'ΠΕΡΑΤΩΝ': 'ΠΕΡ',
        'ΤΕΡΑΣ': 'ΤΕΡ',
        'ΤΕΡΑΤΟΣ': 'ΤΕΡ',
        'ΤΕΡΑΤΑ': 'ΤΕΡ',
        'ΤΕΡΑΤΩΝ': 'ΤΕΡ',
        'ΦΩΣ': 'ΦΩ',
        'ΦΩΤΟΣ': 'ΦΩ',
        'ΦΩΤΑ': 'ΦΩ',
        'ΦΩΤΩΝ': 'ΦΩ',
        'ΚΑΘΕΣΤΩΣ': 'ΚΑΘΕΣΤ',
        'ΚΑΘΕΣΤΩΤΟΣ': 'ΚΑΘΕΣΤ',
        'ΚΑΘΕΣΤΩΤΑ': 'ΚΑΘΕΣΤ',
        'ΚΑΘΕΣΤΩΤΩΝ': 'ΚΑΘΕΣΤ',
        'ΓΕΓΟΝΟΣ': 'ΓΕΓΟΝ',
        'ΓΕΓΟΝΟΤΟΣ': 'ΓΕΓΟΝ',
        'ΓΕΓΟΝΟΤΑ': 'ΓΕΓΟΝ',
        'ΓΕΓΟΝΟΤΩΝ': 'ΓΕΓΟΝ',
        'ΕΥΑ': 'ΕΥ'
      };
      var protectedWords = {
        'ΑΚΡΙΒΩΣ': true,
        'ΑΛΑ': true,
        'ΑΛΛΑ': true,
        'ΑΛΛΙΩΣ': true,
        'ΑΛΛΟΤΕ': true,
        'ΑΜΑ': true,
        'ΑΝΩ': true,
        'ΑΝΑ': true,
        'ΑΝΑΜΕΣΑ': true,
        'ΑΝΑΜΕΤΑΞΥ': true,
        'ΑΝΕΥ': true,
        'ΑΝΤΙ': true,
        'ΑΝΤΙΠΕΡΑ': true,
        'ΑΝΤΙΟ': true,
        'ΑΞΑΦΝΑ': true,
        'ΑΠΟ': true,
        'ΑΠΟΨΕ': true,
        'ΑΡΑ': true,
        'ΑΡΑΓΕ': true,
        'ΑΥΡΙΟ': true,
        'ΑΦΟΙ': true,
        'ΑΦΟΥ': true,
        'ΑΦΟΤΟΥ': true,
        'ΒΡΕ': true,
        'ΓΕΙΑ': true,
        'ΓΙΑ': true,
        'ΓΙΑΤΙ': true,
        'ΓΡΑΜΜΑ': true,
        'ΔΕΗ': true,
        'ΔΕΝ': true,
        'ΔΗΛΑΔΗ': true,
        'ΔΙΧΩΣ': true,
        'ΔΥΟ': true,
        'ΕΑΝ': true,
        'ΕΓΩ': true,
        'ΕΔΩ': true,
        'ΕΔΑ': true,
        'ΕΙΘΕ': true,
        'ΕΙΜΑΙ': true,
        'ΕΙΜΑΣΤΕ': true,
        'ΕΙΣΑΙ': true,
        'ΕΙΣΑΣΤΕ': true,
        'ΕΙΝΑΙ': true,
        'ΕΙΣΤΕ': true,
        'ΕΙΤΕ': true,
        'ΕΚΕΙ': true,
        'ΕΚΟ': true,
        'ΕΛΑ': true,
        'ΕΜΑΣ': true,
        'ΕΜΕΙΣ': true,
        'ΕΝΤΕΛΩΣ': true,
        'ΕΝΤΟΣ': true,
        'ΕΝΤΩΜΕΤΑΞΥ': true,
        'ΕΝΩ': true,
        'ΕΞΙ': true,
        'ΕΞΙΣΟΥ': true,
        'ΕΞΗΣ': true,
        'ΕΞΩ': true,
        'ΕΟΚ': true,
        'ΕΠΑΝΩ': true,
        'ΕΠΕΙΔΗ': true,
        'ΕΠΕΙΤΑ': true,
        'ΕΠΙ': true,
        'ΕΠΙΣΗΣ': true,
        'ΕΠΟΜΕΝΩΣ': true,
        'ΕΠΤΑ': true,
        'ΕΣΑΣ': true,
        'ΕΣΕΙΣ': true,
        'ΕΣΤΩ': true,
        'ΕΣΥ': true,
        'ΕΣΩ': true,
        'ΕΤΣΙ': true,
        'ΕΥΓΕ': true,
        'ΕΦΕ': true,
        'ΕΦΕΞΗΣ': true,
        'ΕΧΤΕΣ': true,
        'ΕΩΣ': true,
        'ΗΔΗ': true,
        'ΗΜΙ': true,
        'ΗΠΑ': true,
        'ΗΤΟΙ': true,
        'ΘΕΣ': true,
        'ΙΔΙΩΣ': true,
        'ΙΔΗ': true,
        'ΙΚΑ': true,
        'ΙΣΩΣ': true,
        'ΚΑΘΕ': true,
        'ΚΑΘΕΤΙ': true,
        'ΚΑΘΟΛΟΥ': true,
        'ΚΑΘΩΣ': true,
        'ΚΑΙ': true,
        'ΚΑΝ': true,
        'ΚΑΠΟΤΕ': true,
        'ΚΑΠΟΥ': true,
        'ΚΑΤΑ': true,
        'ΚΑΤΙ': true,
        'ΚΑΤΟΠΙΝ': true,
        'ΚΑΤΩ': true,
        'ΚΕΙ': true,
        'ΚΙΧ': true,
        'ΚΚΕ': true,
        'ΚΟΛΑΝ': true,
        'ΚΥΡΙΩΣ': true,
        'ΚΩΣ': true,
        'ΜΑΚΑΡΙ': true,
        'ΜΑΛΙΣΤΑ': true,
        'ΜΑΛΛΟΝ': true,
        'ΜΑΙ': true,
        'ΜΑΟ': true,
        'ΜΑΟΥΣ': true,
        'ΜΑΣ': true,
        'ΜΕΘΑΥΡΙΟ': true,
        'ΜΕΣ': true,
        'ΜΕΣΑ': true,
        'ΜΕΤΑ': true,
        'ΜΕΤΑΞΥ': true,
        'ΜΕΧΡΙ': true,
        'ΜΗΔΕ': true,
        'ΜΗΝ': true,
        'ΜΗΠΩΣ': true,
        'ΜΗΤΕ': true,
        'ΜΙΑ': true,
        'ΜΙΑΣ': true,
        'ΜΙΣ': true,
        'ΜΜΕ': true,
        'ΜΟΛΟΝΟΤΙ': true,
        'ΜΟΥ': true,
        'ΜΠΑ': true,
        'ΜΠΑΣ': true,
        'ΜΠΟΥΦΑΝ': true,
        'ΜΠΡΟΣ': true,
        'ΝΑΙ': true,
        'ΝΕΣ': true,
        'ΝΤΑ': true,
        'ΝΤΕ': true,
        'ΞΑΝΑ': true,
        'ΟΗΕ': true,
        'ΟΚΤΩ': true,
        'ΟΜΩΣ': true,
        'ΟΝΕ': true,
        'ΟΠΑ': true,
        'ΟΠΟΥ': true,
        'ΟΠΩΣ': true,
        'ΟΣΟ': true,
        'ΟΤΑΝ': true,
        'ΟΤΕ': true,
        'ΟΤΙ': true,
        'ΟΥΤΕ': true,
        'ΟΧΙ': true,
        'ΠΑΛΙ': true,
        'ΠΑΝ': true,
        'ΠΑΝΟ': true,
        'ΠΑΝΤΟΤΕ': true,
        'ΠΑΝΤΟΥ': true,
        'ΠΑΝΤΩΣ': true,
        'ΠΑΝΩ': true,
        'ΠΑΡΑ': true,
        'ΠΕΡΑ': true,
        'ΠΕΡΙ': true,
        'ΠΕΡΙΠΟΥ': true,
        'ΠΙΑ': true,
        'ΠΙΟ': true,
        'ΠΙΣΩ': true,
        'ΠΛΑΙ': true,
        'ΠΛΕΟΝ': true,
        'ΠΛΗΝ': true,
        'ΠΟΤΕ': true,
        'ΠΟΥ': true,
        'ΠΡΟ': true,
        'ΠΡΟΣ': true,
        'ΠΡΟΧΤΕΣ': true,
        'ΠΡΟΧΘΕΣ': true,
        'ΡΟΔΙ': true,
        'ΠΩΣ': true,
        'ΣΑΙ': true,
        'ΣΑΣ': true,
        'ΣΑΝ': true,
        'ΣΕΙΣ': true,
        'ΣΙΑ': true,
        'ΣΚΙ': true,
        'ΣΟΙ': true,
        'ΣΟΥ': true,
        'ΣΡΙ': true,
        'ΣΥΝ': true,
        'ΣΥΝΑΜΑ': true,
        'ΣΧΕΔΟΝ': true,
        'ΤΑΔΕ': true,
        'ΤΑΞΙ': true,
        'ΤΑΧΑ': true,
        'ΤΕΙ': true,
        'ΤΗΝ': true,
        'ΤΗΣ': true,
        'ΤΙΠΟΤΑ': true,
        'ΤΙΠΟΤΕ': true,
        'ΤΙΣ': true,
        'ΤΟΝ': true,
        'ΤΟΤΕ': true,
        'ΤΟΥ': true,
        'ΤΟΥΣ': true,
        'ΤΣΑ': true,
        'ΤΣΕ': true,
        'ΤΣΙ': true,
        'ΤΣΟΥ': true,
        'ΤΩΝ': true,
        'ΥΠΟ': true,
        'ΥΠΟΨΗ': true,
        'ΥΠΟΨΙΝ': true,
        'ΥΣΤΕΡΑ': true,
        'ΦΕΤΟΣ': true,
        'ΦΙΣ': true,
        'ΦΠΑ': true,
        'ΧΑΦ': true,
        'ΧΘΕΣ': true,
        'ΧΤΕΣ': true,
        'ΧΩΡΙΣ': true,
        'ΩΣ': true,
        'ΩΣΑΝ': true,
        'ΩΣΟΤΟΥ': true,
        'ΩΣΠΟΥ': true,
        'ΩΣΤΕ': true,
        'ΩΣΤΟΣΟ': true
      };

      var alphabet = /^[ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ]+$/;
      var stepOneRegExp = new RegExp('(.*)(' + Object.keys(stepOneExceptions).join('|') + ')$');

      var vowelRegExp = /[ΑΕΗΙΟΥΩ]$/;
      var vowel2RegExp = /[ΑΕΗΙΟΩ]$/;

      var step2aRegExp = /^(.+?)(ΑΔΕΣ|ΑΔΩΝ)$/;
      var step2aExceptionRegExp = /(ΟΚ|ΜΑΜ|ΜΑΝ|ΜΠΑΜΠ|ΠΑΤΕΡ|ΓΙΑΓΙ|ΝΤΑΝΤ|ΚΥΡ|ΘΕΙ|ΠΕΘΕΡ|ΜΟΥΣΑΜ|ΚΑΠΛΑΜ|ΠΑΡ|ΨΑΡ|ΤΖΟΥΡ|ΤΑΜΠΟΥΡ|ΓΑΛΑΤ|ΦΑΦΛΑΤ)$/;

      var step2bRegExp = /^(.+?)(ΕΔΕΣ|ΕΔΩΝ)$/;
      var step2bExceptionRegExp = /(ΟΠ|ΙΠ|ΕΜΠ|ΥΠ|ΓΗΠ|ΔΑΠ|ΚΡΑΣΠ|ΜΙΛ)$/;

      var step2cRegExp = /^(.+?)(ΟΥΔΕΣ|ΟΥΔΩΝ)$/;
      var step2cExceptionRegExp = /(ΑΡΚ|ΚΑΛΙΑΚ|ΠΕΤΑΛ|ΛΙΧ|ΠΛΕΞ|ΣΚ|Σ|ΦΛ|ΦΡ|ΒΕΛ|ΛΟΥΛ|ΧΝ|ΣΠ|ΤΡΑΓ|ΦΕ)$/;

      var step2dRegExp = /^(.+?)(ΕΩΣ|ΕΩΝ|ΕΑΣ|ΕΑ)$/;
      var step2dExceptionRegExp = /^(Θ|Δ|ΕΛ|ΓΑΛ|Ν|Π|ΙΔ|ΠΑΡ|ΣΤΕΡ|ΟΡΦ|ΑΝΔΡ|ΑΝΤΡ)$/;

      var step3aRegExp = /^(.+?)(ΕΙΟ|ΕΙΟΣ|ΕΙΟΙ|ΕΙΑ|ΕΙΑΣ|ΕΙΕΣ|ΕΙΟΥ|ΕΙΟΥΣ|ΕΙΩΝ)$/;

      var step3bRegExp = /^(.+?)(ΙΟΥΣ|ΙΑΣ|ΙΕΣ|ΙΟΣ|ΙΟΥ|ΙΟΙ|ΙΩΝ|ΙΟΝ|ΙΑ|ΙΟ)$/;
      var step3bExceptionRegExp = /^(ΑΓ|ΑΓΓΕΛ|ΑΓΡ|ΑΕΡ|ΑΘΛ|ΑΚΟΥΣ|ΑΞ|ΑΣ|Β|ΒΙΒΛ|ΒΥΤ|Γ|ΓΙΑΓ|ΓΩΝ|Δ|ΔΑΝ|ΔΗΛ|ΔΗΜ|ΔΟΚΙΜ|ΕΛ|ΖΑΧΑΡ|ΗΛ|ΗΠ|ΙΔ|ΙΣΚ|ΙΣΤ|ΙΟΝ|ΙΩΝ|ΚΙΜΩΛ|ΚΟΛΟΝ|ΚΟΡ|ΚΤΗΡ|ΚΥΡ|ΛΑΓ|ΛΟΓ|ΜΑΓ|ΜΠΑΝ|ΜΠΡ|ΝΑΥΤ|ΝΟΤ|ΟΠΑΛ|ΟΞ|ΟΡ|ΟΣ|ΠΑΝΑΓ|ΠΑΤΡ|ΠΗΛ|ΠΗΝ|ΠΛΑΙΣ|ΠΟΝΤ|ΡΑΔ|ΡΟΔ|ΣΚ|ΣΚΟΡΠ|ΣΟΥΝ|ΣΠΑΝ|ΣΤΑΔ|ΣΥΡ|ΤΗΛ|ΤΙΜ|ΤΟΚ|ΤΟΠ|ΤΡΟΧ|ΦΙΛ|ΦΩΤ|Χ|ΧΙΛ|ΧΡΩΜ|ΧΩΡ)$/;
      var step3bException2RegExp = /^(ΠΑΛ)$/;

      var step4RegExp = /^(.+?)(ΙΚΟΣ|ΙΚΟΝ|ΙΚΕΙΣ|ΙΚΟΙ|ΙΚΕΣ|ΙΚΟΥΣ|ΙΚΗ|ΙΚΗΣ|ΙΚΟ|ΙΚΑ|ΙΚΟΥ|ΙΚΩΝ|ΙΚΩΣ)$/;
      var step4ExceptionRegExp = /^(ΑΔ|ΑΛ|ΑΜΑΝ|ΑΜΕΡ|ΑΜΜΟΧΑΛ|ΑΝΗΘ|ΑΝΤΙΔ|ΑΠΛ|ΑΤΤ|ΑΦΡ|ΒΑΣ|ΒΡΩΜ|ΓΕΝ|ΓΕΡ|Δ|ΔΙΚΑΝ|ΔΥΤ|ΕΙΔ|ΕΝΔ|ΕΞΩΔ|ΗΘ|ΘΕΤ|ΚΑΛΛΙΝ|ΚΑΛΠ|ΚΑΤΑΔ|ΚΟΥΖΙΝ|ΚΡ|ΚΩΔ|ΛΟΓ|Μ|ΜΕΡ|ΜΟΝΑΔ|ΜΟΥΛ|ΜΟΥΣ|ΜΠΑΓΙΑΤ|ΜΠΑΝ|ΜΠΟΛ|ΜΠΟΣ|ΜΥΣΤ|Ν|ΝΙΤ|ΞΙΚ|ΟΠΤ|ΠΑΝ|ΠΕΤΣ|ΠΙΚΑΝΤ|ΠΙΤΣ|ΠΛΑΣΤ|ΠΛΙΑΤΣ|ΠΟΝΤ|ΠΟΣΤΕΛΝ|ΠΡΩΤΟΔ|ΣΕΡΤ|ΣΗΜΑΝΤ|ΣΤΑΤ|ΣΥΝΑΔ|ΣΥΝΟΜΗΛ|ΤΕΛ|ΤΕΧΝ|ΤΡΟΠ|ΤΣΑΜ|ΥΠΟΔ|Φ|ΦΙΛΟΝ|ΦΥΛΟΔ|ΦΥΣ|ΧΑΣ)$/;
      var step4Exception2RegExp = /(ΦΟΙΝ)$/;

      var step5a1RegExp = /^(.+?)(ΑΓΑΜΕ|ΗΣΑΜΕ|ΟΥΣΑΜΕ|ΗΚΑΜΕ|ΗΘΗΚΑΜΕ)$/;
      var step5a2RegExp = /^(.+?)(ΑΜΕ)$/;
      var step5a2ExceptionRegExp = /^(ΑΝΑΠ|ΑΠΟΘ|ΑΠΟΚ|ΑΠΟΣΤ|ΒΟΥΒ|ΞΕΘ|ΟΥΛ|ΠΕΘ|ΠΙΚΡ|ΠΟΤ|ΣΙΧ|Χ)$/;

      var step5b1RegExp = /^(.+?)(ΑΓΑΝΕ|ΗΣΑΝΕ|ΟΥΣΑΝΕ|ΙΟΝΤΑΝΕ|ΙΟΤΑΝΕ|ΙΟΥΝΤΑΝΕ|ΟΝΤΑΝΕ|ΟΤΑΝΕ|ΟΥΝΤΑΝΕ|ΗΚΑΝΕ|ΗΘΗΚΑΝΕ)$/;
      var step5b1ExceptionRegExp = /^(ΤΡ|ΤΣ)$/;
      var step5b2RegExp = /^(.+?)(ΑΝΕ)$/;
      var step5b2ExceptionRegExp = /^(ΒΕΤΕΡ|ΒΟΥΛΚ|ΒΡΑΧΜ|Γ|ΔΡΑΔΟΥΜ|Θ|ΚΑΛΠΟΥΖ|ΚΑΣΤΕΛ|ΚΟΡΜΟΡ|ΛΑΟΠΛ|ΜΩΑΜΕΘ|Μ|ΜΟΥΣΟΥΛΜΑΝ|ΟΥΛ|Π|ΠΕΛΕΚ|ΠΛ|ΠΟΛΙΣ|ΠΟΡΤΟΛ|ΣΑΡΑΚΑΤΣ|ΣΟΥΛΤ|ΤΣΑΡΛΑΤ|ΟΡΦ|ΤΣΙΓΓ|ΤΣΟΠ|ΦΩΤΟΣΤΕΦ|Χ|ΨΥΧΟΠΛ|ΑΓ|ΟΡΦ|ΓΑΛ|ΓΕΡ|ΔΕΚ|ΔΙΠΛ|ΑΜΕΡΙΚΑΝ|ΟΥΡ|ΠΙΘ|ΠΟΥΡΙΤ|Σ|ΖΩΝΤ|ΙΚ|ΚΑΣΤ|ΚΟΠ|ΛΙΧ|ΛΟΥΘΗΡ|ΜΑΙΝΤ|ΜΕΛ|ΣΙΓ|ΣΠ|ΣΤΕΓ|ΤΡΑΓ|ΤΣΑΓ|Φ|ΕΡ|ΑΔΑΠ|ΑΘΙΓΓ|ΑΜΗΧ|ΑΝΙΚ|ΑΝΟΡΓ|ΑΠΗΓ|ΑΠΙΘ|ΑΤΣΙΓΓ|ΒΑΣ|ΒΑΣΚ|ΒΑΘΥΓΑΛ|ΒΙΟΜΗΧ|ΒΡΑΧΥΚ|ΔΙΑΤ|ΔΙΑΦ|ΕΝΟΡΓ|ΘΥΣ|ΚΑΠΝΟΒΙΟΜΗΧ|ΚΑΤΑΓΑΛ|ΚΛΙΒ|ΚΟΙΛΑΡΦ|ΛΙΒ|ΜΕΓΛΟΒΙΟΜΗΧ|ΜΙΚΡΟΒΙΟΜΗΧ|ΝΤΑΒ|ΞΗΡΟΚΛΙΒ|ΟΛΙΓΟΔΑΜ|ΟΛΟΓΑΛ|ΠΕΝΤΑΡΦ|ΠΕΡΗΦ|ΠΕΡΙΤΡ|ΠΛΑΤ|ΠΟΛΥΔΑΠ|ΠΟΛΥΜΗΧ|ΣΤΕΦ|ΤΑΒ|ΤΕΤ|ΥΠΕΡΗΦ|ΥΠΟΚΟΠ|ΧΑΜΗΛΟΔΑΠ|ΨΗΛΟΤΑΒ)$/;

      var step5c1RegExp = /^(.+?)(ΗΣΕΤΕ)$/;
      var step5c2RegExp = /^(.+?)(ΕΤΕ)$/;
      var step5c2ExceptionRegExp = /(ΟΔ|ΑΙΡ|ΦΟΡ|ΤΑΘ|ΔΙΑΘ|ΣΧ|ΕΝΔ|ΕΥΡ|ΤΙΘ|ΥΠΕΡΘ|ΡΑΘ|ΕΝΘ|ΡΟΘ|ΣΘ|ΠΥΡ|ΑΙΝ|ΣΥΝΔ|ΣΥΝ|ΣΥΝΘ|ΧΩΡ|ΠΟΝ|ΒΡ|ΚΑΘ|ΕΥΘ|ΕΚΘ|ΝΕΤ|ΡΟΝ|ΑΡΚ|ΒΑΡ|ΒΟΛ|ΩΦΕΛ)$/;
      var step5c2Exception2RegExp = /^(ΑΒΑΡ|ΒΕΝ|ΕΝΑΡ|ΑΒΡ|ΑΔ|ΑΘ|ΑΝ|ΑΠΛ|ΒΑΡΟΝ|ΝΤΡ|ΣΚ|ΚΟΠ|ΜΠΟΡ|ΝΙΦ|ΠΑΓ|ΠΑΡΑΚΑΛ|ΣΕΡΠ|ΣΚΕΛ|ΣΥΡΦ|ΤΟΚ|Υ|Δ|ΕΜ|ΘΑΡΡ|Θ)$/;

      var step5dRegExp = /^(.+?)(ΟΝΤΑΣ|ΩΝΤΑΣ)$/;
      var step5dExceptionRegExp = /^ΑΡΧ$/;
      var step5dException2RegExp = /ΚΡΕ$/;

      var step5eRegExp = /^(.+?)(ΟΜΑΣΤΕ|ΙΟΜΑΣΤΕ)$/;
      var step5eExceptionRegExp = /^ΟΝ$/;

      var step5f1RegExp = /^(.+?)(ΙΕΣΤΕ)$/;
      var step5f1ExceptionRegExp = /^(Π|ΑΠ|ΣΥΜΠ|ΑΣΥΜΠ|ΑΚΑΤΑΠ|ΑΜΕΤΑΜΦ)$/;
      var step5f2RegExp = /^(.+?)(ΕΣΤΕ)$/;
      var step5f2ExceptionRegExp = /^(ΑΛ|ΑΡ|ΕΚΤΕΛ|Ζ|Μ|Ξ|ΠΑΡΑΚΑΛ|ΠΡΟ|ΝΙΣ)$/;

      var step5g1RegExp = /^(.+?)(ΗΘΗΚΑ|ΗΘΗΚΕΣ|ΗΘΗΚΕ)$/;
      var step5g2RegExp = /^(.+?)(ΗΚΑ|ΗΚΕΣ|ΗΚΕ)$/;
      var step5g2ExceptionRegExp = /(ΣΚΩΛ|ΣΚΟΥΛ|ΝΑΡΘ|ΣΦ|ΟΘ|ΠΙΘ)$/;
      var step5g2Exception2RegExp = /^(ΔΙΑΘ|Θ|ΠΑΡΑΚΑΤΑΘ|ΠΡΟΣΘ|ΣΥΝΘ)$/;

      var step5hRegExp = /^(.+?)(ΟΥΣΑ|ΟΥΣΕΣ|ΟΥΣΕ)$/;
      var step5hExceptionRegExp = /^(ΦΑΡΜΑΚ|ΧΑΔ|ΑΓΚ|ΑΝΑΡΡ|ΒΡΟΜ|ΕΚΛΙΠ|ΛΑΜΠΙΔ|ΛΕΧ|Μ|ΠΑΤ|Ρ|Λ|ΜΕΔ|ΜΕΣΑΖ|ΥΠΟΤΕΙΝ|ΑΜ|ΑΙΘ|ΑΝΗΚ|ΔΕΣΠΟΖ|ΕΝΔΙΑΦΕΡ)$/;
      var step5hException2RegExp = /(ΠΟΔΑΡ|ΒΛΕΠ|ΠΑΝΤΑΧ|ΦΡΥΔ|ΜΑΝΤΙΛ|ΜΑΛΛ|ΚΥΜΑΤ|ΛΑΧ|ΛΗΓ|ΦΑΓ|ΟΜ|ΠΡΩΤ)$/;

      var step5iRegExp = /^(.+?)(ΑΓΑ|ΑΓΕΣ|ΑΓΕ)$/;
      var step5iExceptionRegExp = /^(ΑΒΑΣΤ|ΠΟΛΥΦ|ΑΔΗΦ|ΠΑΜΦ|Ρ|ΑΣΠ|ΑΦ|ΑΜΑΛ|ΑΜΑΛΛΙ|ΑΝΥΣΤ|ΑΠΕΡ|ΑΣΠΑΡ|ΑΧΑΡ|ΔΕΡΒΕΝ|ΔΡΟΣΟΠ|ΞΕΦ|ΝΕΟΠ|ΝΟΜΟΤ|ΟΛΟΠ|ΟΜΟΤ|ΠΡΟΣΤ|ΠΡΟΣΩΠΟΠ|ΣΥΜΠ|ΣΥΝΤ|Τ|ΥΠΟΤ|ΧΑΡ|ΑΕΙΠ|ΑΙΜΟΣΤ|ΑΝΥΠ|ΑΠΟΤ|ΑΡΤΙΠ|ΔΙΑΤ|ΕΝ|ΕΠΙΤ|ΚΡΟΚΑΛΟΠ|ΣΙΔΗΡΟΠ|Λ|ΝΑΥ|ΟΥΛΑΜ|ΟΥΡ|Π|ΤΡ|Μ)$/;
      var step5iException2RegExp = /(ΟΦ|ΠΕΛ|ΧΟΡΤ|ΛΛ|ΣΦ|ΡΠ|ΦΡ|ΠΡ|ΛΟΧ|ΣΜΗΝ)$/;
      var step5iException3RegExp = /^(ΨΟΦ|ΝΑΥΛΟΧ)$/;
      var step5iException4RegExp = /(ΚΟΛΛ)$/;

      var step5jRegExp = /^(.+?)(ΗΣΕ|ΗΣΟΥ|ΗΣΑ)$/;
      var step5jExceptionRegExp = /^(Ν|ΧΕΡΣΟΝ|ΔΩΔΕΚΑΝ|ΕΡΗΜΟΝ|ΜΕΓΑΛΟΝ|ΕΠΤΑΝ|Ι)$/;

      var step5kRegExp = /^(.+?)(ΗΣΤΕ)$/;
      var step5kExceptionRegExp = /^(ΑΣΒ|ΣΒ|ΑΧΡ|ΧΡ|ΑΠΛ|ΑΕΙΜΝ|ΔΥΣΧΡ|ΕΥΧΡ|ΚΟΙΝΟΧΡ|ΠΑΛΙΜΨ)$/;

      var step5lRegExp = /^(.+?)(ΟΥΝΕ|ΗΣΟΥΝΕ|ΗΘΟΥΝΕ)$/;
      var step5lExceptionRegExp = /^(Ν|Ρ|ΣΠΙ|ΣΤΡΑΒΟΜΟΥΤΣ|ΚΑΚΟΜΟΥΤΣ|ΕΞΩΝ)$/;

      var step5mRegExp = /^(.+?)(ΟΥΜΕ|ΗΣΟΥΜΕ|ΗΘΟΥΜΕ)$/;
      var step5mExceptionRegExp = /^(ΠΑΡΑΣΟΥΣ|Φ|Χ|ΩΡΙΟΠΛ|ΑΖ|ΑΛΛΟΣΟΥΣ|ΑΣΟΥΣ)$/;

      var step6aRegExp = /^(.+?)(ΜΑΤΟΙ|ΜΑΤΟΥΣ|ΜΑΤΟ|ΜΑΤΑ|ΜΑΤΩΣ|ΜΑΤΩΝ|ΜΑΤΟΣ|ΜΑΤΕΣ|ΜΑΤΗ|ΜΑΤΗΣ|ΜΑΤΟΥ)$/;
      var step6aExceptionRegExp = /^(ΓΡΑΜ)$/;
      var step6aException2RegExp = /^(ΓΕ|ΣΤΑ)$/;

      var step6bRegExp = /^(.+?)(ΟΥΑ)$/;

      var longWordsRegExp = /^(.+?)(Α|ΑΓΑΤΕ|ΑΓΑΝ|ΑΕΙ|ΑΜΑΙ|ΑΝ|ΑΣ|ΑΣΑΙ|ΑΤΑΙ|ΑΩ|Ε|ΕΙ|ΕΙΣ|ΕΙΤΕ|ΕΣΑΙ|ΕΣ|ΕΤΑΙ|Ι|ΙΕΜΑΙ|ΙΕΜΑΣΤΕ|ΙΕΤΑΙ|ΙΕΣΑΙ|ΙΕΣΑΣΤΕ|ΙΟΜΑΣΤΑΝ|ΙΟΜΟΥΝ|ΙΟΜΟΥΝΑ|ΙΟΝΤΑΝ|ΙΟΝΤΟΥΣΑΝ|ΙΟΣΑΣΤΑΝ|ΙΟΣΑΣΤΕ|ΙΟΣΟΥΝ|ΙΟΣΟΥΝΑ|ΙΟΤΑΝ|ΙΟΥΜΑ|ΙΟΥΜΑΣΤΕ|ΙΟΥΝΤΑΙ|ΙΟΥΝΤΑΝ|Η|ΗΔΕΣ|ΗΔΩΝ|ΗΘΕΙ|ΗΘΕΙΣ|ΗΘΕΙΤΕ|ΗΘΗΚΑΤΕ|ΗΘΗΚΑΝ|ΗΘΟΥΝ|ΗΘΩ|ΗΚΑΤΕ|ΗΚΑΝ|ΗΣ|ΗΣΑΝ|ΗΣΑΤΕ|ΗΣΕΙ|ΗΣΕΣ|ΗΣΟΥΝ|ΗΣΩ|Ο|ΟΙ|ΟΜΑΙ|ΟΜΑΣΤΑΝ|ΟΜΟΥΝ|ΟΜΟΥΝΑ|ΟΝΤΑΙ|ΟΝΤΑΝ|ΟΝΤΟΥΣΑΝ|ΟΣ|ΟΣΑΣΤΑΝ|ΟΣΑΣΤΕ|ΟΣΟΥΝ|ΟΣΟΥΝΑ|ΟΤΑΝ|ΟΥ|ΟΥΜΑΙ|ΟΥΜΑΣΤΕ|ΟΥΝ|ΟΥΝΤΑΙ|ΟΥΝΤΑΝ|ΟΥΣ|ΟΥΣΑΝ|ΟΥΣΑΤΕ|Υ||ΥΑ|ΥΣ|Ω|ΩΝ|ΟΙΣ)$/;

      var step7RegExp = /^(.+?)(ΕΣΤΕΡ|ΕΣΤΑΤ|ΟΤΕΡ|ΟΤΑΤ|ΥΤΕΡ|ΥΤΑΤ|ΩΤΕΡ|ΩΤΑΤ)$/;
      var step7ExceptionRegExp = /^(ΕΞ|ΕΣ|ΑΝ|ΚΑΤ|Κ|ΠΡ)$/;
      var step7Exception2RegExp = /^(ΚΑ|Μ|ΕΛΕ|ΛΕ|ΔΕ)$/;

      function isGreek(word) {
        return alphabet.test(word);
      }

      function endsInVowel(word) {
        return vowelRegExp.test(word);
      }

      function endsInVowel2(word) {
        return vowel2RegExp.test(word);
      }

      function stem(word) {

        var stemmedWord = word;

        if (word.length < 3) {
          return stemmedWord;
        }

        if (!isGreek(word)) {
          return stemmedWord;
        }

        if (protectedWords[word]) {
          return stemmedWord;
        }

        //step 1
        var match = stepOneRegExp.exec(stemmedWord);

        if (match !== null) {
          stemmedWord = match[1] + stepOneExceptions[match[2]];
        }
        //step 2
        //2a
        if ((match = step2aRegExp.exec(stemmedWord)) !== null) {
          stemmedWord = match[1];
          if (!step2aExceptionRegExp.test(match[1])) {
            stemmedWord += 'ΑΔ';
          }
        }

        //2b
        if ((match = step2bRegExp.exec(stemmedWord)) !== null) {
          stemmedWord = match[1];
          if (step2bExceptionRegExp.test(match[1])) {
            stemmedWord += 'ΕΔ';
          }
        }

        //2c
        if ((match = step2cRegExp.exec(stemmedWord)) !== null) {
          stemmedWord = match[1];
          if (step2cExceptionRegExp.test(match[1])) {
            stemmedWord += 'ΟΥΔ';
          }
        }

        //2d
        if ((match = step2dRegExp.exec(stemmedWord)) !== null) {
          stemmedWord = match[1];
          if (step2dExceptionRegExp.test(match[1])) {
            stemmedWord += 'Ε';
          }
        }

        //step 3
        //3a
        if ((match = step3aRegExp.exec(stemmedWord)) !== null && match[1].length > 4) {
          stemmedWord = match[1];
        }

        //3b
        if ((match = step3bRegExp.exec(stemmedWord)) !== null) {
          stemmedWord = match[1];
          if (endsInVowel(stemmedWord) || stemmedWord.length < 2 || step3bExceptionRegExp.test(match[1])) {
            stemmedWord += 'Ι';
          }
          if (step3bException2RegExp.test(match[1])) {
            stemmedWord += 'ΑΙ';
          }
        }

        //step 4
        if ((match = step4RegExp.exec(stemmedWord)) !== null) {
          stemmedWord = match[1];
          if (endsInVowel(stemmedWord) || step4ExceptionRegExp.test(match[1]) || step4Exception2RegExp.test(match[1])) {
            stemmedWord += 'ΙΚ';
          }
        }

        //step 5
        //5a
        if (stemmedWord === 'ΑΓΑΜΕ') {
          stemmedWord = 'ΑΓΑΜ';
        }
        if ((match = step5a1RegExp.exec(stemmedWord)) !== null) {
          stemmedWord = match[1];
        }
        if ((match = step5a2RegExp.exec(stemmedWord)) !== null) {
          stemmedWord = match[1];
          if (step5a2ExceptionRegExp.test(match[1])) {
            stemmedWord += 'ΑΜ';
          }
        }

        //5b
        if ((match = step5b1RegExp.exec(stemmedWord)) !== null) {
          stemmedWord = match[1];
          if (step5b1ExceptionRegExp.test(match[1])) {
            stemmedWord += 'ΑΓΑΝ';
          }
        }
        if ((match = step5b2RegExp.exec(stemmedWord)) !== null) {
          stemmedWord = match[1];
          if (endsInVowel2(stemmedWord) || step5b2ExceptionRegExp.test(match[1])) {
            stemmedWord += 'ΑΝ';
          }
        }

        //5c
        if ((match = step5c1RegExp.exec(stemmedWord)) !== null) {
          stemmedWord = match[1];
        }

        if ((match = step5c2RegExp.exec(stemmedWord)) !== null) {
          stemmedWord = match[1];
          if (endsInVowel2(stemmedWord) || step5c2ExceptionRegExp.test(match[1]) || step5c2Exception2RegExp.test(match[1])) {
            stemmedWord += 'ΕΤ';
          }
        }

        //5d
        if ((match = step5dRegExp.exec(stemmedWord)) !== null) {
          stemmedWord = match[1];
          if (step5dExceptionRegExp.test(match[1])) {
            stemmedWord += 'ΟΝΤ';
          }
          if (step5dException2RegExp.test(match[1])) {
            stemmedWord += 'ΩΝΤ';
          }
        }

        //5e
        if ((match = step5eRegExp.exec(stemmedWord)) !== null) {
          stemmedWord = match[1];
          if (step5eExceptionRegExp.test(match[1])) {
            stemmedWord += 'ΟΜΑΣΤ';
          }
        }

        //5f
        if ((match = step5f1RegExp.exec(stemmedWord)) !== null) {
          stemmedWord = match[1];
          if (step5f1ExceptionRegExp.test(match[1])) {
            stemmedWord += 'ΙΕΣΤ';
          }
        }

        if ((match = step5f2RegExp.exec(stemmedWord)) !== null) {
          stemmedWord = match[1];
          if (step5f2ExceptionRegExp.test(match[1])) {
            stemmedWord += 'ΕΣΤ';
          }
        }

        //5g
        if ((match = step5g1RegExp.exec(stemmedWord)) !== null) {
          stemmedWord = match[1];
        }

        if ((match = step5g2RegExp.exec(stemmedWord)) !== null) {
          stemmedWord = match[1];
          if (step5g2ExceptionRegExp.test(match[1]) || step5g2Exception2RegExp.test(match[1])) {
            stemmedWord += 'ΗΚ';
          }
        }

        //5h
        if ((match = step5hRegExp.exec(stemmedWord)) !== null) {
          stemmedWord = match[1];
          if (endsInVowel(stemmedWord) || step5hExceptionRegExp.test(match[1]) || step5hException2RegExp.test(match[1])) {
            stemmedWord += 'ΟΥΣ';
          }
        }

        //5i
        if ((match = step5iRegExp.exec(stemmedWord)) !== null) {
          stemmedWord = match[1];
          if (step5iExceptionRegExp.test(match[1]) || (step5iException2RegExp.test(match[1]) && !step5iException3RegExp.test(match[1])) || step5iException4RegExp.test(match[1])) {
            stemmedWord += 'ΑΓ';
          }
        }

        //5j
        if ((match = step5jRegExp.exec(stemmedWord)) !== null) {
          stemmedWord = match[1];
          if (step5jExceptionRegExp.test(match[1])) {
            stemmedWord += 'ΗΣ';
          }
        }

        //5k
        if ((match = step5kRegExp.exec(stemmedWord)) !== null) {
          stemmedWord = match[1];
          if (step5kExceptionRegExp.test(match[1])) {
            stemmedWord += 'ΗΣΤ';
          }
        }

        //5l
        if ((match = step5lRegExp.exec(stemmedWord)) !== null) {
          stemmedWord = match[1];
          if (step5lExceptionRegExp.test(match[1])) {
            stemmedWord += 'ΟΥΝ';
          }
        }

        //5m
        if ((match = step5mRegExp.exec(stemmedWord)) !== null) {
          stemmedWord = match[1];
          if (step5mExceptionRegExp.test(match[1])) {
            stemmedWord += 'ΟΥΜ';
          }
        }

        //step 6
        //6a
        if ((match = step6aRegExp.exec(stemmedWord)) != null) {
          stemmedWord = match[1] + 'Μ';
          if (step6aExceptionRegExp.test(match[1])) {
            stemmedWord += 'Α';
          } else if (step6aException2RegExp.test(match[1])) {
            stemmedWord += 'ΑΤ';
          }
        }

        //6b
        if ((match = step6bRegExp.exec(stemmedWord)) !== null) {
          stemmedWord = match[1] + 'ΟΥ';
        }

        //Handle long words
        if (word.length === stemmedWord.length) {
          if ((match = longWordsRegExp.exec(stemmedWord)) !== null) {
            stemmedWord = match[1];
          }
        }

        //step 7
        if ((match = step7RegExp.exec(stemmedWord)) != null) {
          if (!step7ExceptionRegExp.test(match[1])) {
            stemmedWord = match[1];
          }
          if (step7Exception2RegExp.test(match[1])) {
            stemmedWord += 'ΥΤ';
          }
        }

        return stemmedWord;
      }

      return function(token) {
        if (typeof token.update === "function") {
          return token.update(function(word) {
            return stem(word.toUpperCase()).toLowerCase();
          });
        } else {
          return stem(token.toUpperCase()).toLowerCase();
        }
      }
    })();

    lunr.Pipeline.registerFunction(lunr.el.stemmer, 'stemmer-el');

    /* lunr stopWordFilter function */
    lunr.el.stopWordFilter = lunr.generateStopWordFilter('αλλα αν αντι απο αυτα αυτεσ αυτη αυτο αυτοι αυτοσ αυτουσ αυτων για δε δεν εαν ειμαι ειμαστε ειναι εισαι ειστε εκεινα εκεινεσ εκεινη εκεινο εκεινοι εκεινοσ εκεινουσ εκεινων ενω επι η θα ισωσ κ και κατα κι μα με μετα μη μην να ο οι ομωσ οπωσ οσο οτι παρα ποια ποιεσ ποιο ποιοι ποιοσ ποιουσ ποιων που προσ πωσ σε στη στην στο στον τα την τησ το τον τοτε του των ωσ'.split(' '));

    lunr.Pipeline.registerFunction(lunr.el.stopWordFilter, 'stopWordFilter-el');

    /* lunr normilizer function */
    lunr.el.normilizer = (function() {
      var accentMap = {
        "Ά": "Α",
        "ά": "α",
        "Έ": "Ε",
        "έ": "ε",
        "Ή": "Η",
        "ή": "η",
        "Ί": "Ι",
        "ί": "ι",
        "Ό": "Ο",
        "ο": "ο",
        "Ύ": "Υ",
        "ύ": "υ",
        "Ώ": "Ω",
        "ώ": "ω",
        "Ϊ": "Ι",
        "ϊ": "ι",
        "Ϋ": "Υ",
        "ϋ": "υ",
        "ΐ": "ι",
        "ΰ": "υ"
      };

      return function(token) {
        if (typeof token.update === "function") {
          return token.update(function(term) {
            var ret = "";
            for (var i = 0; i < term.length; i++) {
              ret += accentMap[term.charAt(i)] || term.charAt(i);
            }
            return ret;
          });
        } else {
          var ret = "";
          for (var i = 0; i < token.length; i++) {
            ret += accentMap[token.charAt(i)] || token.charAt(i);
          }
          return ret;
        }
      }
    })();

    lunr.Pipeline.registerFunction(lunr.el.normilizer, 'normilizer-el');
  };
}))