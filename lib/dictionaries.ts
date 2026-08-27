import type { Locale } from './i18n';

/**
 * What is actually translated today: the chrome (nav, header, footer, promo
 * bar), the language switcher, and every page's title/description/h1 — the
 * text search engines read. The rest of the interface, and all catalogue
 * content coming from the API, is still Ukrainian in both locales; that is why
 * `RU_INDEXABLE` in `./i18n` is false.
 *
 * These are not translations of one another. Each side is written the way its
 * own audience searches — «купити квіти Одеса» and «купить цветы Одесса» are
 * separate queries, not one phrase in two spellings.
 */
export interface Meta {
  title: string;
  description: string;
}

export interface Dictionary {
  nav: {
    home: string;
    shop: string;
    about: string;
    delivery: string;
    blog: string;
    contact: string;
  };
  chrome: {
    menu: string;
    wishlist: string;
    cart: string;
    promoBefore: string;
    promoAfter: string;
    switchLabel: string;
    switchTo: string;
  };
  footer: {
    blurb: string;
    shop: string;
    help: string;
    where: string;
    allFlowers: string;
    corporate: string;
    delivery: string;
    faq: string;
    reviews: string;
    contact: string;
    privacy: string;
    terms: string;
    rights: string;
  };
  home: { kicker: string; h1a: string; h1b: string };
  shop: { h1: string; intro: string };
  seo: {
    /** The layout's default. Metadata merges downward, so this is what any page
        without its own title inherits — the 404 among them. It has to stay
        brand-level: inheriting the home page's title would have every dead URL
        announce itself as "Квіти Одеса — купити квіти з доставкою". */
    brand: Meta;
    home: Meta;
    shop: Meta;
    about: Meta;
    delivery: Meta;
    contact: Meta;
    faq: Meta;
    reviews: Meta;
    corporate: Meta;
    blog: Meta;
  };
}

const uk: Dictionary = {
  nav: {
    home: 'Головна',
    shop: 'Магазин',
    about: 'Про нас',
    delivery: 'Доставка',
    blog: 'Журнал',
    contact: 'Контакти',
  },
  chrome: {
    menu: 'Меню',
    wishlist: 'Збережене',
    cart: 'Кошик',
    promoBefore: 'Замовлення до',
    promoAfter: '— доставка сьогодні · Безкоштовна доставка від',
    switchLabel: 'Мова',
    switchTo: 'Русский',
  },
  footer: {
    blurb:
      'Родинна майстерня в Таїрово. Зрізано зранку, звʼязано руками, доставлено до ваших дверей того ж дня.',
    shop: 'Магазин',
    help: 'Допомога',
    where: 'Де ми',
    allFlowers: 'Усі квіти',
    corporate: 'Корпоративні замовлення',
    delivery: 'Доставка та оплата',
    faq: 'Питання',
    reviews: 'Відгуки',
    contact: 'Контакти',
    privacy: 'Політика приватності',
    terms: 'Умови користування',
    rights: '© 2026 MIG Flowers. Родинна справа, понад 10 років.',
  },
  home: {
    kicker: 'Родинна майстерня, понад 10 років',
    h1a: 'Свіжі квіти в Одесі,',
    h1b: 'доставлені з любовʼю',
  },
  shop: {
    h1: 'Купити квіти в Одесі',
    intro:
      'Усе, що майстерня робить цього тижня — квіти в роздріб і готові букети. Звузьте пошук або скажіть нагоду, і ми виберемо самі.',
  },
  seo: {
    brand: {
      title: 'MIG Flowers — квіткова майстерня в Одесі',
      description: 'Родинна квіткова майстерня в Таїрово, Одеса. Букети з доставкою по місту.',
    },
    home: {
      title: 'Квіти Одеса — купити квіти з доставкою | MIG Flowers',
      description:
        'Свіжі квіти та букети в Одесі з доставкою того ж дня. Родинна майстерня на Люстдорфській: зрізаємо зранку, привозимо по обіді. Замовлення до 14:00.',
    },
    shop: {
      title: 'Купити квіти в роздріб в Одесі — каталог букетів | MIG Flowers',
      description:
        'Каталог квітів у роздріб в Одесі: букети на замовлення, композиції та квіти у вазі. Доставка по місту того ж дня, безкоштовно від 2 500 ₴.',
    },
    about: {
      title: 'Про майстерню — флористи в Одесі | MIG Flowers',
      description:
        'Родинна квіткова майстерня в Таїрово, понад 10 років в Одесі. Власні теплиці, ручна робота, кожен букет складає один флорист від початку до кінця.',
    },
    delivery: {
      title: 'Доставка квітів Одеса — умови та оплата | MIG Flowers',
      description:
        'Доставка квітів по Одесі того ж дня при замовленні до 14:00. Безкоштовно від 2 500 ₴, оплата картою або готівкою курʼєру.',
    },
    contact: {
      title: 'Квітковий магазин в Одесі — контакти | MIG Flowers',
      description:
        'Люстдорфська дорога 125/4, Таїрово, Одеса. Щодня 08:00 – 21:00. Телефонуйте або заходьте просто з вулиці — крамниця й майстерня в одному місці.',
    },
    faq: {
      title: 'Питання про замовлення квітів в Одесі | MIG Flowers',
      description:
        'Як замовити букет, скільки триває доставка по Одесі, що робити, якщо квіти не сподобались — відповіді на питання, які нам ставлять найчастіше.',
    },
    reviews: {
      title: 'Відгуки про доставку квітів в Одесі | MIG Flowers',
      description: 'Що пишуть про наші букети та доставку по Одесі покупці, які вже замовляли.',
    },
    corporate: {
      title: 'Квіти для бізнесу в Одесі — корпоративні замовлення | MIG Flowers',
      description:
        'Оформлення офісів, подарунки клієнтам і партнерам, квіти на події. Регулярні постачання по Одесі за домовленим графіком.',
    },
    blog: {
      title: 'Журнал про квіти — догляд і поради | MIG Flowers',
      description:
        'Як доглядати за букетом, які квіти дарувати на свято і що цвіте цього сезону в Одесі.',
    },
  },
};

const ru: Dictionary = {
  nav: {
    home: 'Главная',
    shop: 'Магазин',
    about: 'О нас',
    delivery: 'Доставка',
    blog: 'Журнал',
    contact: 'Контакты',
  },
  chrome: {
    menu: 'Меню',
    wishlist: 'Избранное',
    cart: 'Корзина',
    promoBefore: 'Заказы до',
    promoAfter: '— доставка сегодня · Бесплатная доставка от',
    switchLabel: 'Язык',
    switchTo: 'Українська',
  },
  footer: {
    blurb:
      'Семейная мастерская в Таирово. Срезано утром, собрано руками, доставлено к вашей двери в тот же день.',
    shop: 'Магазин',
    help: 'Помощь',
    where: 'Где мы',
    allFlowers: 'Все цветы',
    corporate: 'Корпоративные заказы',
    delivery: 'Доставка и оплата',
    faq: 'Вопросы',
    reviews: 'Отзывы',
    contact: 'Контакты',
    privacy: 'Политика конфиденциальности',
    terms: 'Условия пользования',
    rights: '© 2026 MIG Flowers. Семейное дело, больше 10 лет.',
  },
  home: {
    kicker: 'Семейная мастерская, больше 10 лет',
    h1a: 'Свежие цветы в Одессе,',
    h1b: 'доставленные с любовью',
  },
  shop: {
    h1: 'Купить цветы в Одессе',
    intro:
      'Всё, что мастерская делает на этой неделе — цветы в розницу и готовые букеты. Сузьте поиск или назовите повод, и мы соберём сами.',
  },
  seo: {
    brand: {
      title: 'MIG Flowers — цветочная мастерская в Одессе',
      description: 'Семейная цветочная мастерская в Таирово, Одесса. Букеты с доставкой по городу.',
    },
    home: {
      title: 'Цветы Одесса — купить цветы с доставкой | MIG Flowers',
      description:
        'Свежие цветы и букеты в Одессе с доставкой в день заказа. Семейная мастерская на Люстдорфской: срезаем утром, привозим после обеда. Заказы до 14:00.',
    },
    shop: {
      title: 'Купить цветы в розницу в Одессе — каталог букетов | MIG Flowers',
      description:
        'Каталог цветов в розницу в Одессе: букеты на заказ, композиции и цветы в вазе. Доставка по городу в день заказа, бесплатно от 2 500 ₴.',
    },
    about: {
      title: 'О мастерской — флористы в Одессе | MIG Flowers',
      description:
        'Семейная цветочная мастерская в Таирово, больше 10 лет в Одессе. Собственные теплицы, ручная работа, каждый букет собирает один флорист.',
    },
    delivery: {
      title: 'Доставка цветов Одесса — условия и оплата | MIG Flowers',
      description:
        'Доставка цветов по Одессе в день заказа, если заказать до 14:00. Бесплатно от 2 500 ₴, оплата картой или наличными курьеру.',
    },
    contact: {
      title: 'Цветочный магазин в Одессе — контакты | MIG Flowers',
      description:
        'Люстдорфская дорога 125/4, Таирово, Одесса. Ежедневно 08:00 – 21:00. Звоните или заходите прямо с улицы — магазин и мастерская в одном месте.',
    },
    faq: {
      title: 'Вопросы о заказе цветов в Одессе | MIG Flowers',
      description:
        'Как заказать букет, сколько идёт доставка по Одессе, что делать, если цветы не понравились — ответы на частые вопросы.',
    },
    reviews: {
      title: 'Отзывы о доставке цветов в Одессе | MIG Flowers',
      description: 'Что пишут о наших букетах и доставке по Одессе те, кто уже заказывал.',
    },
    corporate: {
      title: 'Цветы для бизнеса в Одессе — корпоративные заказы | MIG Flowers',
      description:
        'Оформление офисов, подарки клиентам и партнёрам, цветы на события. Регулярные поставки по Одессе по согласованному графику.',
    },
    blog: {
      title: 'Журнал о цветах — уход и советы | MIG Flowers',
      description:
        'Как ухаживать за букетом, какие цветы дарить на праздник и что цветёт в этом сезоне в Одессе.',
    },
  },
};

const DICTIONARIES: Record<Locale, Dictionary> = { uk, ru };

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}
