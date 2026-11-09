export interface MLBB_Hero {
  id: string;
  name: {
    en: string;
    ru: string;
    uz: string;
  };
  image: string;
  role: string;
  lane: "Roam" | "Exp" | "Jungle" | "Mid" | "Gold";
  isFeatured?: boolean;
}

export const MLBB_HEROES: MLBB_Hero[] = [
  // 1. Tigreal
  {
    id: "tigreal",
    name: {
      en: "Tigreal",
      ru: "Тигрил",
      uz: "Tigreal",
    },
    image: "/heroes/tigreal.png",
    role: "Tank / Roam",
    lane: "Roam",
    isFeatured: true,
  },
  // 2. Kalea
  {
    id: "kalea",
    name: {
      en: "Kalea",
      ru: "Калеа",
      uz: "Kalea",
    },
    image: "/heroes/kalea.png",
    role: "Support / Fighter",
    lane: "Roam",
    isFeatured: true,
  },
  // 3. Gatotkaca
  {
    id: "gatotkaca",
    name: {
      en: "Gatotkaca",
      ru: "Гатоткача",
      uz: "Gatotkaca",
    },
    image: "/heroes/gatotkaca.png",
    role: "Tank / Fighter",
    lane: "Exp",
    isFeatured: true,
  },
  // 4. Zilong
  {
    id: "zilong",
    name: {
      en: "Zilong",
      ru: "Зилонг",
      uz: "Zilong",
    },
    image: "/heroes/zilong.png",
    role: "Fighter / Assassin",
    lane: "Exp",
    isFeatured: true,
  },
  // 5. Chou
  {
    id: "chou",
    name: {
      en: "Chou",
      ru: "Чу",
      uz: "Chou",
    },
    image: "/heroes/chou.png",
    role: "Fighter / Roam",
    lane: "Roam",
    isFeatured: true,
  },
  // 6. Mathilda
  {
    id: "mathilda",
    name: {
      en: "Mathilda",
      ru: "Матильда",
      uz: "Mathilda",
    },
    image: "/heroes/mathilda.png",
    role: "Support / Assassin",
    lane: "Roam",
    isFeatured: true,
  },
  // 7. Valentina
  {
    id: "valentina",
    name: {
      en: "Valentina",
      ru: "Валентина",
      uz: "Valentina",
    },
    image: "/heroes/valentina.png",
    role: "Mage",
    lane: "Mid",
    isFeatured: true,
  },
  // 8. Balmond
  {
    id: "balmond",
    name: {
      en: "Balmond",
      ru: "Бальмонд",
      uz: "Balmond",
    },
    image: "/heroes/balmond.png",
    role: "Fighter",
    lane: "Jungle",
    isFeatured: true,
  },
  // 9. Baxia
  {
    id: "baxia",
    name: {
      en: "Baxia",
      ru: "Баксий",
      uz: "Baxia",
    },
    image: "/heroes/baxia.png",
    role: "Tank",
    lane: "Jungle",
    isFeatured: true,
  },
  // 10. Martis
  {
    id: "martis",
    name: {
      en: "Martis",
      ru: "Мартис",
      uz: "Martis",
    },
    image: "/heroes/martis.png",
    role: "Fighter",
    lane: "Jungle",
    isFeatured: true,
  },
  // 11. Harith
  {
    id: "harith",
    name: {
      en: "Harith",
      ru: "Харит",
      uz: "Harith",
    },
    image: "/heroes/harith.png",
    role: "Mage",
    lane: "Gold",
    isFeatured: true,
  },
  // 12. Nana
  {
    id: "nana",
    name: {
      en: "Nana",
      ru: "Нана",
      uz: "Nana",
    },
    image: "/heroes/nana.png",
    role: "Mage / Support",
    lane: "Mid",
    isFeatured: true,
  },
  // 13. Grock
  {
    id: "grock",
    name: {
      en: "Grock",
      ru: "Грок",
      uz: "Grock",
    },
    image: "/heroes/grock.png",
    role: "Tank",
    lane: "Roam",
    isFeatured: true,
  },
  // 14. Helcurd
  {
    id: "helcurd",
    name: {
      en: "Helcurd",
      ru: "Хелкарт",
      uz: "Helcurd",
    },
    image: "/heroes/helcurd.png",
    role: "Assassin",
    lane: "Jungle",
    isFeatured: true,
  },
  // 15. Jawhead
  {
    id: "jawhead",
    name: {
      en: "Jawhead",
      ru: "Кусака",
      uz: "Jawhead",
    },
    image: "/heroes/jawhead.png",
    role: "Fighter",
    lane: "Roam",
    isFeatured: true,
  },
  // 16. Pharsa
  {
    id: "pharsa",
    name: {
      en: "Pharsa",
      ru: "Фарса",
      uz: "Pharsa",
    },
    image: "/heroes/pharsa.png",
    role: "Mage",
    lane: "Mid",
    isFeatured: true,
  },
  // 17. Karina
  {
    id: "karina",
    name: {
      en: "Karina",
      ru: "Карина",
      uz: "Karina",
    },
    image: "/heroes/karina.png",
    role: "Assassin",
    lane: "Jungle",
    isFeatured: true,
  },
  // 18. Dyrroth
  {
    id: "dyrroth",
    name: {
      en: "Dyrroth",
      ru: "Дайрот",
      uz: "Dyrroth",
    },
    image: "/heroes/dyrroth.png",
    role: "Fighter",
    lane: "Exp",
    isFeatured: true,
  },
  // 19. Chip
  {
    id: "chip",
    name: {
      en: "Chip",
      ru: "Чип",
      uz: "Chip",
    },
    image: "/heroes/chip.png",
    role: "Tank / Support",
    lane: "Roam",
    isFeatured: true,
  },
  // 20. Esmeralda
  {
    id: "esmeralda",
    name: {
      en: "Esmeralda",
      ru: "Эсмеральда",
      uz: "Esmeralda",
    },
    image: "/heroes/esmeralda.png",
    role: "Mage / Tank",
    lane: "Exp",
    isFeatured: true,
  },
  // 21. Freya
  {
    id: "freya",
    name: {
      en: "Freya",
      ru: "Фрейя",
      uz: "Freya",
    },
    image: "/heroes/freya.png",
    role: "Fighter",
    lane: "Exp",
    isFeatured: true,
  },
  // 22. Harley
  {
    id: "harley",
    name: {
      en: "Harley",
      ru: "Харли",
      uz: "Harley",
    },
    image: "/heroes/harley.png",
    role: "Mage / Assassin",
    lane: "Jungle",
    isFeatured: true,
  },
  // 23. Luo Yi
  {
    id: "luoyi",
    name: {
      en: "Luo Yi",
      ru: "Ло И",
      uz: "Luo Yi",
    },
    image: "/heroes/luoyi.png",
    role: "Mage",
    lane: "Mid",
    isFeatured: true,
  },
  // 24. Alpha
  {
    id: "alpha",
    name: {
      en: "Alpha",
      ru: "Альфа",
      uz: "Alpha",
    },
    image: "/heroes/alpha.png",
    role: "Fighter",
    lane: "Jungle",
    isFeatured: true,
  },
  // 25. Phoveus
  {
    id: "phoveus",
    name: {
      en: "Phoveus",
      ru: "Фовиус",
      uz: "Phoveus",
    },
    image: "/heroes/phoveus.png",
    role: "Fighter",
    lane: "Exp",
    isFeatured: true,
  },
  // 26. Arlott
  {
    id: "arlott",
    name: {
      en: "Arlott",
      ru: "Арлотт",
      uz: "Arlott",
    },
    image: "/heroes/arlott.png",
    role: "Fighter / Assassin",
    lane: "Exp",
    isFeatured: true,
  },
  // 27. Chang'e
  {
    id: "change",
    name: {
      en: "Chang'e",
      ru: "Чан'э",
      uz: "Chang'e",
    },
    image: "/heroes/change.png",
    role: "Mage",
    lane: "Mid",
    isFeatured: true,
  },
  // 28. Johnson
  {
    id: "johnson",
    name: {
      en: "Johnson",
      ru: "Джонсон",
      uz: "Johnson",
    },
    image: "/heroes/johnson.png",
    role: "Tank / Support",
    lane: "Roam",
    isFeatured: true,
  },
  // 29. Hylos
  {
    id: "hylos",
    name: {
      en: "Hylos",
      ru: "Хилос",
      uz: "Hylos",
    },
    image: "/heroes/hylos.png",
    role: "Tank",
    lane: "Roam",
    isFeatured: true,
  },
  // 30. Aurora
  {
    id: "aurora",
    name: {
      en: "Aurora",
      ru: "Аврора",
      uz: "Aurora",
    },
    image: "/heroes/aurora.png",
    role: "Mage",
    lane: "Mid",
    isFeatured: true,
  },
  // 31. Melissa
  {
    id: "melissa",
    name: {
      en: "Melissa",
      ru: "Мелисса",
      uz: "Melissa",
    },
    image: "/heroes/melissa.png",
    role: "Marksman",
    lane: "Gold",
    isFeatured: true,
  },
  // 32. Lesley
  {
    id: "lesley",
    name: {
      en: "Lesley",
      ru: "Лесли",
      uz: "Lesley",
    },
    image: "/heroes/lesley.png",
    role: "Marksman / Assassin",
    lane: "Gold",
    isFeatured: true,
  },
  // 33. Alucard
  {
    id: "alucard",
    name: {
      en: "Alucard",
      ru: "Алукард",
      uz: "Alucard",
    },
    image: "/heroes/alucard.png",
    role: "Fighter / Assassin",
    lane: "Jungle",
    isFeatured: true,
  },
  // 34. Thamuz
  {
    id: "thamuz",
    name: {
      en: "Thamuz",
      ru: "Тамуз",
      uz: "Thamuz",
    },
    image: "/heroes/thamuz.png",
    role: "Fighter",
    lane: "Exp",
    isFeatured: true,
  },
  // 35. Gusion
  {
    id: "gusion",
    name: {
      en: "Gusion",
      ru: "Гусион",
      uz: "Gusion",
    },
    image: "/heroes/gusion.png",
    role: "Assassin / Mage",
    lane: "Jungle",
    isFeatured: true,
  },
  // 36. Yin
  {
    id: "yin",
    name: {
      en: "Yin",
      ru: "Инь",
      uz: "Yin",
    },
    image: "/heroes/yin.png",
    role: "Fighter / Assassin",
    lane: "Exp",
    isFeatured: true,
  },
  // 37. Karrie
  {
    id: "karrie",
    name: {
      en: "Karrie",
      ru: "Кэрри",
      uz: "Karrie",
    },
    image: "/heroes/karrie.png",
    role: "Marksman",
    lane: "Gold",
    isFeatured: true,
  },
  // 38. Hayabusa
  {
    id: "hayabusa",
    name: {
      en: "Hayabusa",
      ru: "Хаябуса",
      uz: "Hayabusa",
    },
    image: "/heroes/hayabusa.png",
    role: "Assassin",
    lane: "Jungle",
    isFeatured: true,
  },
  // 39. Layla
  {
    id: "layla",
    name: {
      en: "Layla",
      ru: "Лейла",
      uz: "Layla",
    },
    image: "/heroes/layla.png",
    role: "Marksman",
    lane: "Gold",
    isFeatured: true,
  },
  // 40. Paquito
  {
    id: "paquito",
    name: {
      en: "Paquito",
      ru: "Пакито",
      uz: "Paquito",
    },
    image: "/heroes/paquito.png",
    role: "Fighter / Assassin",
    lane: "Exp",
    isFeatured: true,
  },
  // 41. Moskov
  {
    id: "moskov",
    name: {
      en: "Moskov",
      ru: "Москов",
      uz: "Moskov",
    },
    image: "/heroes/moskov.png",
    role: "Marksman",
    lane: "Gold",
    isFeatured: true,
  },
  // 42. Atlas
  {
    id: "atlas",
    name: {
      en: "Atlas",
      ru: "Атлас",
      uz: "Atlas",
    },
    image: "/heroes/atlas.png",
    role: "Tank / Support",
    lane: "Roam",
    isFeatured: true,
  },
  // 43. Lancelot
  {
    id: "lancelot",
    name: {
      en: "Lancelot",
      ru: "Ланселот",
      uz: "Lancelot",
    },
    image: "/heroes/lancelot.png",
    role: "Assassin",
    lane: "Jungle",
    isFeatured: true,
  },
  // 44. Lapu-Lapu
  {
    id: "lapulapu",
    name: {
      en: "Lapu-Lapu",
      ru: "Лапу-Лапу",
      uz: "Lapu-Lapu",
    },
    image: "/heroes/lapulapu.png",
    role: "Fighter",
    lane: "Exp",
    isFeatured: true,
  },
  // 45. Kimmy
  {
    id: "kimmy",
    name: {
      en: "Kimmy",
      ru: "Кимми",
      uz: "Kimmy",
    },
    image: "/heroes/kimmy.png",
    role: "Marksman / Mage",
    lane: "Gold",
    isFeatured: true,
  },
  // 46. Joy
  {
    id: "joy",
    name: {
      en: "Joy",
      ru: "Джой",
      uz: "Joy",
    },
    image: "/heroes/joy.png",
    role: "Assassin / Mage",
    lane: "Exp",
    isFeatured: true,
  },
  // 47. Lunox
  {
    id: "lunox",
    name: {
      en: "Lunox",
      ru: "Люнокс",
      uz: "Lunox",
    },
    image: "/heroes/lunox.png",
    role: "Mage",
    lane: "Mid",
    isFeatured: true,
  },
  // 48. Nolan
  {
    id: "nolan",
    name: {
      en: "Nolan",
      ru: "Нолан",
      uz: "Nolan",
    },
    image: "/heroes/nolan.png",
    role: "Assassin",
    lane: "Jungle",
    isFeatured: true,
  },
  // 49. Wanwan
  {
    id: "wanwan",
    name: {
      en: "Wanwan",
      ru: "Ванван",
      uz: "Wanwan",
    },
    image: "/heroes/wanwan.png",
    role: "Marksman",
    lane: "Gold",
    isFeatured: true,
  },
  // 50. Cici
  {
    id: "cici",
    name: {
      en: "Cici",
      ru: "Чичи",
      uz: "Cici",
    },
    image: "/heroes/cici.png",
    role: "Fighter",
    lane: "Exp",
    isFeatured: true,
  },
  // 51. Yu Zhong
  {
    id: "yuzhong",
    name: {
      en: "Yu Zhong",
      ru: "Ю Чжун",
      uz: "Yu Zhong",
    },
    image: "/heroes/yuzhong.png",
    role: "Fighter",
    lane: "Exp",
    isFeatured: true,
  },
  // 52. Angela
  {
    id: "angela",
    name: {
      en: "Angela",
      ru: "Ангела",
      uz: "Angela",
    },
    image: "/heroes/angela.png",
    role: "Support",
    lane: "Roam",
    isFeatured: true,
  },
  // 53. Saber
  {
    id: "saber",
    name: {
      en: "Saber",
      ru: "Сабер",
      uz: "Saber",
    },
    image: "/heroes/saber.png",
    role: "Assassin",
    lane: "Jungle",
    isFeatured: true,
  },
  // 54. Selena
  {
    id: "selena",
    name: {
      en: "Selena",
      ru: "Селена",
      uz: "Selena",
    },
    image: "/heroes/selena.png",
    role: "Assassin / Mage",
    lane: "Roam",
    isFeatured: true,
  },
  // 55. Claude
  {
    id: "claude",
    name: {
      en: "Claude",
      ru: "Клод",
      uz: "Claude",
    },
    image: "/heroes/claude.png",
    role: "Marksman",
    lane: "Gold",
    isFeatured: true,
  },
  // 56. Roger
  {
    id: "roger",
    name: {
      en: "Roger",
      ru: "Роджер",
      uz: "Roger",
    },
    image: "/heroes/roger.png",
    role: "Fighter / Marksman",
    lane: "Jungle",
    isFeatured: true,
  },
  // 57. Miya
  {
    id: "miya",
    name: {
      en: "Miya",
      ru: "Мия",
      uz: "Miya",
    },
    image: "/heroes/miya.png",
    role: "Marksman",
    lane: "Gold",
    isFeatured: true,
  },
  // 58. Vexana
  {
    id: "vexana",
    name: {
      en: "Vexana",
      ru: "Вексана",
      uz: "Vexana",
    },
    image: "/heroes/vexana.png",
    role: "Mage",
    lane: "Mid",
    isFeatured: true,
  },
  // 59. Aamon
  {
    id: "aamon",
    name: {
      en: "Aamon",
      ru: "Аамон",
      uz: "Aamon",
    },
    image: "/heroes/aamon.png",
    role: "Assassin",
    lane: "Jungle",
    isFeatured: true,
  },
  // 60. Odette
  {
    id: "odette",
    name: {
      en: "Odette",
      ru: "Одетта",
      uz: "Odette",
    },
    image: "/heroes/odette.png",
    role: "Mage",
    lane: "Mid",
    isFeatured: true,
  },
  // 61. Ruby
  {
    id: "ruby",
    name: {
      en: "Ruby",
      ru: "Руби",
      uz: "Ruby",
    },
    image: "/heroes/ruby.png",
    role: "Fighter / Tank",
    lane: "Exp",
    isFeatured: true,
  },
  // 62. Hanzo
  {
    id: "hanzo",
    name: {
      en: "Hanzo",
      ru: "Ханзо",
      uz: "Hanzo",
    },
    image: "/heroes/hanzo.png",
    role: "Assassin",
    lane: "Jungle",
    isFeatured: true,
  },
  // 63. Lylia
  {
    id: "lylia",
    name: {
      en: "Lylia",
      ru: "Лилия",
      uz: "Lylia",
    },
    image: "/heroes/lylia.png",
    role: "Mage",
    lane: "Mid",
    isFeatured: true,
  },
  // 64. Kaja
  {
    id: "kaja",
    name: {
      en: "Kaja",
      ru: "Кайя",
      uz: "Kaja",
    },
    image: "/heroes/kaja.png",
    role: "Fighter / Support",
    lane: "Roam",
    isFeatured: true,
  },
  // 65. Suyou
  {
    id: "suyou",
    name: {
      en: "Suyou",
      ru: "Сую",
      uz: "Suyou",
    },
    image: "/heroes/suyou.png",
    role: "Assassin / Fighter",
    lane: "Jungle",
    isFeatured: true,
  },
  // 66. Ixia
  {
    id: "ixia",
    name: {
      en: "Ixia",
      ru: "Иксия",
      uz: "Ixia",
    },
    image: "/heroes/ixia.png",
    role: "Marksman",
    lane: "Gold",
    isFeatured: true,
  },
  // 67. Sora
  {
    id: "sora",
    name: {
      en: "Sora",
      ru: "Сора",
      uz: "Sora",
    },
    image: "/heroes/sora.png",
    role: "Fighter / Assassin",
    lane: "Exp",
    isFeatured: true,
  },
  // 68. Julian
  {
    id: "julian",
    name: {
      en: "Julian",
      ru: "Джулиан",
      uz: "Julian",
    },
    image: "/heroes/julian.png",
    role: "Fighter / Mage",
    lane: "Jungle",
    isFeatured: true,
  },
  // 69. Uranus
  {
    id: "uranus",
    name: {
      en: "Uranus",
      ru: "Уранус",
      uz: "Uranus",
    },
    image: "/heroes/uranus.png",
    role: "Tank",
    lane: "Exp",
    isFeatured: true,
  },
  // 70. Xavier
  {
    id: "xavier",
    name: {
      en: "Xavier",
      ru: "Ксавьер",
      uz: "Xavier",
    },
    image: "/heroes/xavier.png",
    role: "Mage",
    lane: "Mid",
    isFeatured: true,
  },
  // 71. Novaria
  {
    id: "novaria",
    name: {
      en: "Novaria",
      ru: "Новария",
      uz: "Novaria",
    },
    image: "/heroes/novaria.png",
    role: "Mage",
    lane: "Mid",
    isFeatured: true,
  },
  // 72. X.Borg
  {
    id: "xborg",
    name: {
      en: "X.Borg",
      ru: "Икс.Борг",
      uz: "X.Borg",
    },
    image: "/heroes/xborg.png",
    role: "Fighter",
    lane: "Exp",
    isFeatured: true,
  },
  // 73. Yi Sun-shin
  {
    id: "yisunshin",
    name: {
      en: "Yi Sun-shin",
      ru: "Ли Сун-Син",
      uz: "Yi Sun-shin",
    },
    image: "/heroes/yisunshin.png",
    role: "Assassin / Marksman",
    lane: "Jungle",
    isFeatured: true,
  },
  // 74. Vale
  {
    id: "vale",
    name: {
      en: "Vale",
      ru: "Вейл",
      uz: "Vale",
    },
    image: "/heroes/vale.png",
    role: "Mage",
    lane: "Mid",
    isFeatured: true,
  },
  // 75. Akai
  {
    id: "akai",
    name: {
      en: "Akai",
      ru: "Акай",
      uz: "Akai",
    },
    image: "/heroes/akai.png",
    role: "Tank",
    lane: "Roam",
    isFeatured: true,
  },
  // 76. Badang
  {
    id: "badang",
    name: {
      en: "Badang",
      ru: "Баданг",
      uz: "Badang",
    },
    image: "/heroes/badang.png",
    role: "Fighter",
    lane: "Exp",
    isFeatured: true,
  },
  // 77. Leomord
  {
    id: "leomord",
    name: {
      en: "Leomord",
      ru: "Леоморд",
      uz: "Leomord",
    },
    image: "/heroes/leomord.png",
    role: "Fighter",
    lane: "Jungle",
    isFeatured: true,
  },
  // 78. Hilda
  {
    id: "hilda",
    name: {
      en: "Hilda",
      ru: "Хильда",
      uz: "Hilda",
    },
    image: "/heroes/hilda.png",
    role: "Fighter / Tank",
    lane: "Exp",
    isFeatured: true,
  },
  // 79. Zhuxin
  {
    id: "zhuxin",
    name: {
      en: "Zhuxin",
      ru: "Чжусинь",
      uz: "Zhuxin",
    },
    image: "/heroes/zhuxin.png",
    role: "Mage",
    lane: "Mid",
    isFeatured: true,
  },
  // 80. Brody
  {
    id: "brody",
    name: {
      en: "Brody",
      ru: "Броди",
      uz: "Brody",
    },
    image: "/heroes/brody.png",
    role: "Marksman",
    lane: "Gold",
    isFeatured: true,
  },
  // 81. Silvanna
  {
    id: "silvanna",
    name: {
      en: "Silvanna",
      ru: "Сильванна",
      uz: "Silvanna",
    },
    image: "/heroes/silvanna.png",
    role: "Fighter / Mage",
    lane: "Exp",
    isFeatured: true,
  },
  // 82. Aldous
  {
    id: "aldous",
    name: {
      en: "Aldous",
      ru: "Алдос",
      uz: "Aldous",
    },
    image: "/heroes/aldous.png",
    role: "Fighter",
    lane: "Exp",
    isFeatured: true,
  },
  // 83. Zetian
  {
    id: "zetian",
    name: {
      en: "Zetian",
      ru: "У Цзэтянь",
      uz: "Zetian",
    },
    image: "/heroes/zetian.png",
    role: "Mage",
    lane: "Mid",
    isFeatured: true,
  },
  // 84. Terizla
  {
    id: "terizla",
    name: {
      en: "Terizla",
      ru: "Теризла",
      uz: "Terizla",
    },
    image: "/heroes/terizla.png",
    role: "Fighter",
    lane: "Exp",
    isFeatured: true,
  },
  // 85. Natalia
  {
    id: "natalia",
    name: {
      en: "Natalia",
      ru: "Наталья",
      uz: "Natalia",
    },
    image: "/heroes/natalia.png",
    role: "Assassin",
    lane: "Roam",
    isFeatured: true,
  },
  // 86. Alice
  {
    id: "alice",
    name: {
      en: "Alice",
      ru: "Алиса",
      uz: "Alice",
    },
    image: "/heroes/alice.png",
    role: "Mage / Tank",
    lane: "Exp",
    isFeatured: true,
  },
  // 87. Khaleed
  {
    id: "khaleed",
    name: {
      en: "Khaleed",
      ru: "Халид",
      uz: "Khaleed",
    },
    image: "/heroes/khaleed.png",
    role: "Fighter",
    lane: "Exp",
    isFeatured: true,
  },
  // 88. Fredrinn
  {
    id: "fredrinn",
    name: {
      en: "Fredrinn",
      ru: "Фредрин",
      uz: "Fredrinn",
    },
    image: "/heroes/fredrinn.png",
    role: "Tank / Fighter",
    lane: "Jungle",
    isFeatured: true,
  },
  // 89. Cecilion
  {
    id: "cecilion",
    name: {
      en: "Cecilion",
      ru: "Сесилион",
      uz: "Cecilion",
    },
    image: "/heroes/cecilion.png",
    role: "Mage",
    lane: "Mid",
    isFeatured: true,
  },
  // 90. Cyclops
  {
    id: "cyclops",
    name: {
      en: "Cyclops",
      ru: "Циклоп",
      uz: "Cyclops",
    },
    image: "/heroes/cyclops.png",
    role: "Mage",
    lane: "Mid",
    isFeatured: true,
  },
  // 91. Clint
  {
    id: "clint",
    name: {
      en: "Clint",
      ru: "Клинт",
      uz: "Clint",
    },
    image: "/heroes/clint.png",
    role: "Marksman",
    lane: "Gold",
    isFeatured: true,
  },
];
