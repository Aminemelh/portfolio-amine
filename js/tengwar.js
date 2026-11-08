/*
 * Port JavaScript du TP Java « Tengwars.quenyaVersTengwarLaTeX ».
 * Même algorithme : recherche gloutonne 3 → 2 → 1 caractères,
 * TELCO / ARA devant les mots qui commencent par une voyelle,
 * et une erreur PasDuQuenyaException sur une séquence inconnue.
 */
(function () {
  // [romanisation classique, nom, commande LaTeX, est une voyelle (tehta)]
  const SCRIPT = [
    ["T", "TINCO", "\\Ttinco"], ["P", "PARMA", "\\Tparma"], ["C", "CALMA", "\\Tcalma"],
    ["qu", "QUESSE", "\\Tquesse"], ["nd", "ANDO", "\\Tando"], ["mb", "UMBAR", "\\Tumbar"],
    ["ng", "ANGA", "\\Tanga"], ["ngw", "UNGWE", "\\Tungwe"], ["S", "THULE", "\\Tthuule"],
    ["F", "FORMEN", "\\Tformen"], ["ch", "HARMA", "\\Taha"], ["hw", "HWESTA", "\\Thwesta"],
    ["nt", "ANRO", "\\Tanto"], ["mp", "AMPA", "\\Tampa"], ["nc", "ANCA", "\\Tanca"],
    ["nqu", "UNQUE", "\\Tunque"], ["N", "NUMEN", "\\Tnuumen"], ["M", "MALTA", "\\Tmalta"],
    ["nw", "NGWALME", "\\Tnwalme"], ["R", "ORE", "\\Toore"], ["V", "VALA", "\\Tvala"],
    ["rd", "ARDA", "\\Tarda"], ["L", "LAMBE", "\\Tlambe"], ["ld", "ALDA", "\\Talda"],
    ["Z", "ESSE", "\\Tesse"], ["hy", "HYARMEN", "\\Thyarmen"],
    ["A", "AMATIXE 3", "\\TTthreedots", true], ["ii", "AMATIXE 2", "\\TTtwodots", true],
    ["I", "AMATIXE 1", "\\TTdot", true], ["E", "TECO", "\\TTacute", true],
    ["ee", "TECO DOUBLE", "\\TTdoubleacute", true], ["O", "REMPE", "\\TTrightcurl", true],
    ["oo", "REMPE DOUBLE", "\\TTdoublerightcurl", true], ["U", "REMPE NUQ.", "\\TTleftcurl", true],
    ["uu", "REMPE NUQ. DOUBLE", "\\TTdoubleleftcurl", true],
  ];
  const TABLE = new Map(SCRIPT.map(([c, name, cmd, vowel]) => [c, { classic: c, name, cmd, vowel: !!vowel }]));
  const TELCO = { classic: "", name: "TELCO", cmd: "\\Ttelco", lead: true };
  const ARA = { classic: "", name: "ARA", cmd: "\\Taara", lead: true };

  class PasDuQuenyaException extends Error {
    constructor(seq, mot) { super(`PasDuQuenyaException : « ${seq} » dans « ${mot} »`); this.name = "PasDuQuenyaException"; }
  }

  function trouverLaSequence(mot, i) {
    for (const len of [3, 2, 1]) {
      if (i + len <= mot.length) {
        const test = mot.substring(i, i + len);
        if (TABLE.has(test)) return test;
      }
    }
    return null;
  }

  function traduireMot(mot) {
    const out = [];
    if (/^(ee|ii|oo|uu)/.test(mot)) out.push(ARA);
    else if (/^[AEIOU]/.test(mot)) out.push(TELCO);
    let i = 0;
    while (i < mot.length) {
      const seq = trouverLaSequence(mot, i);
      if (seq === null) throw new PasDuQuenyaException(mot[i], mot);
      out.push(TABLE.get(seq));
      i += seq.length;
    }
    return out;
  }

  /** Retourne une liste de mots, chacun étant une liste de jetons. */
  function quenyaVersTengwar(entrees) {
    return entrees.split(" ").filter(Boolean).map(traduireMot);
  }

  window.Tengwar = { quenyaVersTengwar, PasDuQuenyaException };
})();
