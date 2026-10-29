import { Book } from "@/types";

const AUTHOR = { ar: "إبراهيم فواز عراجي", en: "Ibrahim Fawaz Araji" };

// Genre keys (canonical English) with bilingual labels.
const GENRE = {
  quranicStudies: { ar: "القرآن وعلوم العصر", en: "Qur'an & Modern Science" },
  islamicThought: { ar: "الفكر الإسلامي", en: "Islamic Thought" },
  spirituality: { ar: "روحانيات", en: "Spirituality" },
  memoir: { ar: "سيرة وذكريات", en: "Memoir & Reflections" },
  heritage: { ar: "تراث وتاريخ عائلي", en: "Heritage & Family History" },
};

// NOTE ON DATA:
// - sortOrder reflects the TRUE publication order (1 = oldest, 10 = newest),
//   per the author's own back-cover listing.
// - The site displays books NEWEST → OLDEST (see getBooksForDisplay).
// - publishedYear is 0 where the exact year is not yet confirmed; the UI hides
//   the year when it is 0. Confirmed: book 1 (1998) and "My Village" (2014).
//   Real years + full summaries will be supplied by the publisher later.
// - synopsis values are concise, factual placeholders based on each title and
//   publisher; they will be replaced with the author's official summaries.

export const books: Book[] = [
  {
    id: "1",
    slug: "quran-and-modern-sciences",
    title: { ar: "القرآن وعلوم العصر الحديثة", en: "The Qur'an and the Modern Sciences" },
    author: AUTHOR,
    synopsis: {
      ar: "أول مؤلفات الكاتب، وثمرة ثلاث سنوات من البحث، يستعرض فيه وجوه التوافق بين آيات القرآن الكريم ومعطيات العلم الحديث — من علوم الفلك والفضاء إلى الطب والأحياء. وصل هذا الكتاب إلى مكتبة جامعة ماكغيل في مونتريال بكندا ليكون مرجعاً في قسم الدراسات العربية والإسلامية. (صدر عن دار النهضة العربية – بيروت.)",
      en: "The author's first book and the fruit of three years of research, exploring the harmony between the verses of the Holy Qur'an and the findings of modern science — from astronomy and space to medicine and biology. The book reached the library of McGill University in Montreal, Canada, becoming a reference in its department of Arabic and Islamic studies. (Published by Dar Al-Nahda Al-Arabiya, Beirut.)",
    },
    coverImage: "/images/books/quran-modern-sciences.jpg",
    publishedYear: 1998,
    genre: "Quranic Studies",
    genreLabel: GENRE.quranicStudies,
    isbn: "",
    featured: true,
    sortOrder: 1,
  },
  {
    id: "2",
    slug: "the-road-to-god",
    title: { ar: "الطريق إلى الله", en: "The Road to God" },
    author: AUTHOR,
    synopsis: {
      ar: "كتابٌ يروي قصص مشاهير وعلماء اعتنقوا الإسلام — كيف ولماذا؟ يتتبّع رحلاتهم الفكرية والروحية نحو الإيمان، ويقدّم شهاداتٍ ملهمة عن طريق الهداية. (صدر عن دار النهضة العربية – بيروت.)",
      en: "A book recounting the stories of famous figures and scholars who embraced Islam — how and why? It traces their intellectual and spiritual journeys toward faith, offering inspiring testimonies of the path to guidance. (Published by Dar Al-Nahda Al-Arabiya, Beirut.)",
    },
    coverImage: "/images/books/road-to-god.jpg",
    publishedYear: 0,
    genre: "Islamic Thought",
    genreLabel: GENRE.islamicThought,
    isbn: "",
    featured: true,
    sortOrder: 2,
  },
  {
    id: "3",
    slug: "islamic-masterpieces",
    title: { ar: "روائع إسلامية", en: "Islamic Masterpieces" },
    author: AUTHOR,
    synopsis: {
      ar: "مجموعة مختارة من روائع التراث الإسلامي ومواقفه الملهمة، تجمع بين الحكمة والعبرة والجمال الأدبي، تُقدَّم للقارئ في حُلّة معاصرة. (صدر عن دار النهضة العربية – بيروت.)",
      en: "A curated collection of the masterpieces and inspiring moments of Islamic heritage, blending wisdom, moral insight, and literary beauty, presented to the reader in a contemporary form. (Published by Dar Al-Nahda Al-Arabiya, Beirut.)",
    },
    coverImage: "/images/books/islamic-masterpieces.jpg",
    publishedYear: 0,
    genre: "Islamic Thought",
    genreLabel: GENRE.islamicThought,
    isbn: "",
    featured: true,
    sortOrder: 3,
  },
  {
    id: "4",
    slug: "my-village-memory-and-longing",
    title: { ar: "ضيعتي ذكرى وحنين", en: "My Village: Memory and Longing" },
    author: AUTHOR,
    synopsis: {
      ar: "استعادةٌ حانية لتراث القرية اللبنانية ومجتمعها وتفاصيل حياتها اليومية، يحفظ فيها الكاتب ذكرياته وحنينه إلى المكان والزمان الأول. (إصدار خاص، ٢٢ تشرين الأول/أكتوبر ٢٠١٤.)",
      en: "A tender recollection of the heritage of the Lebanese village — its community and the details of its daily life — in which the author preserves his memories and his longing for the place and time of his origins. (Special edition, 22 October 2014.)",
    },
    coverImage: "/images/books/my-village.jpg",
    publishedYear: 2014,
    genre: "Memoir",
    genreLabel: GENRE.memoir,
    isbn: "",
    featured: false,
    sortOrder: 4,
  },
  {
    id: "5",
    slug: "history-of-the-araji-family",
    title: { ar: "تاريخ آل عراجي", en: "The History of the Araji Family" },
    author: AUTHOR,
    synopsis: {
      ar: "عملٌ توثيقي يجمع تراث عائلة عراجي وتاريخها وجذورها وأنسابها، حفظاً للذاكرة العائلية ونقلاً لها إلى الأجيال القادمة. (إصدار خاص.)",
      en: "A documentary work gathering the heritage, history, roots, and lineage of the Araji family — preserving the family's memory and passing it on to future generations. (Special edition.)",
    },
    coverImage: "/images/books/araji-family-history.jpg",
    publishedYear: 0,
    genre: "Heritage",
    genreLabel: GENRE.heritage,
    isbn: "",
    featured: false,
    sortOrder: 5,
  },
  {
    id: "6",
    slug: "the-true-promise",
    title: { ar: "الوعد الحق", en: "The True Promise" },
    author: AUTHOR,
    synopsis: {
      ar: "تأمّلٌ إيماني في وعد الله الحق وما ينتظر الإنسان في الآخرة، يستند إلى القرآن الكريم والسنة المطهرة بأسلوبٍ وجداني مؤثّر. (إصدار خاص – وقف لوجه الله تعالى، صادر عن دار الأزهر للطباعة والنشر.)",
      en: "A faith-centered reflection on God's true promise and what awaits humankind in the hereafter, drawing on the Holy Qur'an and the purified Sunnah in a moving, heartfelt style. (Special edition — a charitable endowment, published by Dar Al-Azhar for Printing and Publishing.)",
    },
    coverImage: "/images/books/the-true-promise.jpg",
    publishedYear: 0,
    genre: "Spirituality",
    genreLabel: GENRE.spirituality,
    isbn: "",
    featured: false,
    sortOrder: 6,
  },
  {
    id: "7",
    slug: "in-the-embrace-of-islam",
    title: { ar: "في رحاب الإسلام", en: "In the Embrace of Islam" },
    author: AUTHOR,
    synopsis: {
      ar: "جولةٌ في رحاب الإسلام وقيمه وآدابه ومقاصده، تجمع بين العقيدة والأخلاق والمعاملات، مكتوبةٌ بلغةٍ ميسّرة تخاطب القارئ المعاصر. (صادر عن دار الأزهر للطباعة والنشر – وقف لوجه الله تعالى.)",
      en: "A journey through the embrace of Islam — its values, manners, and higher purposes — bringing together creed, ethics, and human dealings, written in an accessible style that speaks to the contemporary reader. (Published by Dar Al-Azhar for Printing and Publishing — a charitable endowment.)",
    },
    coverImage: "/images/books/in-the-embrace-of-islam.jpg",
    publishedYear: 0,
    genre: "Islamic Thought",
    genreLabel: GENRE.islamicThought,
    isbn: "",
    featured: false,
    sortOrder: 7,
  },
  {
    id: "8",
    slug: "diary-of-time-my-memories",
    title: { ar: "مفكرة الزمن (ذكرياتي)", en: "The Diary of Time (My Memories)" },
    author: AUTHOR,
    synopsis: {
      ar: "سيرةٌ ذاتية ومذكّرات يسترجع فيها الكاتب محطات حياته ورحلته الفكرية والأدبية، بأسلوبٍ صادق يمزج الذكرى بالتأمّل. (إصدار خاص.)",
      en: "A memoir in which the author revisits the milestones of his life and his intellectual and literary journey, in a sincere style that blends remembrance with reflection. (Special edition.)",
    },
    coverImage: "/images/books/diary-of-time.jpg",
    publishedYear: 0,
    genre: "Memoir",
    genreLabel: GENRE.memoir,
    isbn: "",
    featured: false,
    sortOrder: 8,
  },
  {
    id: "9",
    slug: "diary-of-a-muslim",
    title: { ar: "يوميات مسلم", en: "Diary of a Muslim" },
    author: AUTHOR,
    synopsis: {
      ar: "دليلٌ وجداني ليوميات المسلم في عبادته ومعاملاته وأخلاقه، يقدَّم في حُلّته الجديدة ليكون رفيقاً يومياً للقارئ في حياته الإيمانية. (صادر عن دار الأزهر للطباعة والنشر – وقف لوجه الله تعالى.)",
      en: "A heartfelt guide to the daily life of a Muslim — in worship, dealings, and character — presented in a new edition to serve as a daily companion for the reader's life of faith. (Published by Dar Al-Azhar for Printing and Publishing — a charitable endowment.)",
    },
    coverImage: "/images/books/diary-of-a-muslim.jpg",
    publishedYear: 0,
    genre: "Spirituality",
    genreLabel: GENRE.spirituality,
    isbn: "",
    featured: false,
    sortOrder: 9,
  },
  {
    id: "10",
    slug: "scientific-miracles-quran-sunnah",
    title: {
      ar: "الإعجاز العلمي في القرآن الكريم والسُّنة المطهرة",
      en: "Scientific Miracles in the Holy Qur'an and the Purified Sunnah",
    },
    author: AUTHOR,
    synopsis: {
      ar: "أحدث مؤلفات الكاتب، يتناول وجوه الإعجاز العلمي في القرآن الكريم والسنة المطهرة، ويستعرض ما كشفه العلم الحديث مما يتوافق مع النصّ الشريف — من الكون والفلك إلى الإنسان والحياة. (صادر عن دار الأزهر للطباعة والنشر – وقف لوجه الله تعالى.)",
      en: "The author's most recent book, examining the dimensions of scientific miracles in the Holy Qur'an and the purified Sunnah, and surveying the findings of modern science that align with the sacred text — from the cosmos and astronomy to the human being and life. (Published by Dar Al-Azhar for Printing and Publishing — a charitable endowment.)",
    },
    coverImage: "/images/books/scientific-miracles.jpg",
    publishedYear: 0,
    genre: "Quranic Studies",
    genreLabel: GENRE.quranicStudies,
    isbn: "",
    featured: true,
    sortOrder: 10,
  },
];

/** Books ordered newest → oldest for display (catalog, featured, etc.). */
export function getBooksForDisplay(): Book[] {
  return [...books].sort((a, b) => b.sortOrder - a.sortOrder);
}

export function getBookBySlug(slug: string): Book | undefined {
  return books.find((b) => b.slug === slug);
}

export function getFeaturedBooks(): Book[] {
  return books
    .filter((b) => b.featured)
    .sort((a, b) => b.sortOrder - a.sortOrder);
}

export function getRelatedBooks(currentSlug: string, genre: string): Book[] {
  return getBooksForDisplay()
    .filter((b) => b.slug !== currentSlug && b.genre === genre)
    .slice(0, 3);
}

export function getAllSlugs(): string[] {
  return books.map((b) => b.slug);
}
