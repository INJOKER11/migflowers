import type { Locale } from './i18n';

/**
 * Every interface string the site renders, in both languages.
 *
 * These are not translations of one another. Each side is written the way its
 * own audience searches and speaks — «купити квіти Одеса» and «купить цветы
 * Одесса» are separate queries, not one phrase in two spellings.
 *
 * Catalogue content — product, category, review and blog copy — still comes
 * from the API with a single `name`/`description`/`content` and no `*_uk`/
 * `*_ru` variants, so it stays Ukrainian on Russian pages. That, not this
 * file, is what still holds `RU_INDEXABLE` in `./i18n` at false.
 *
 * Strings that need a number, a name or a price carry a `{placeholder}` and
 * are filled at the call site with `fill()` from `./format`.
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
    promoDaily: string;
    promoFreeFrom: string;
    switchLabel: string;
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
  home: {
    kicker: string;
    h1a: string;
    h1b: string;
    lead: string;
    cta: string;
    statValue: string;
    statLabel: string;
    heroAlt: string;
    quickBuyTitle: string;
    quickBuyAll: string;
    quickBuyNote: string;
    occasionTitle: string;
    occasionNote: string;
    galleryTitle: string;
    galleryAlt: string;
    reviewPrev: string;
    reviewPrevLabel: string;
    reviewNext: string;
    reviewNextLabel: string;
    reviewsAll: string;
    newsTitle: string;
    newsBody: string;
    newsEmailLabel: string;
    newsCta: string;
    newsSending: string;
    /** `{code}` — the promo code. */
    newsSent: string;
    newsNote: string;
    newsFailed: string;
  };
  shop: {
    h1: string;
    intro: string;
    sortLabel: string;
    sortPopular: string;
    sortNewest: string;
    sortPriceAsc: string;
    sortPriceDesc: string;
    categoryLabel: string;
    /** `{price}` — the slider's current cap. */
    upTo: string;
    reset: string;
  };
  product: {
    zoomHint: string;
    addToCart: string;
    save: string;
    saved: string;
    /** `{name}` — the product. */
    saveAria: string;
    /** `{name}` — the product. */
    unsaveAria: string;
    tabDescription: string;
    tabCare: string;
    sizeLabel: string;
    colorLabel: string;
    resetColor: string;
    relatedTitle: string;
    moveToCart: string;
    removeSaved: string;
    /** The product page's own skeleton, in `loading.tsx`. */
    loading: string;
    /** Metadata: `<name> — <titleSuffix> | MIG Flowers`. */
    titleSuffix: string;
  };
  category: {
    /** Metadata: `<name> — <titleSuffix> | MIG Flowers`. */
    titleSuffix: string;
  };
  cart: {
    drawerTitle: string;
    close: string;
    closeCart: string;
    emptyA: string;
    emptyB: string;
    sum: string;
    checkout: string;
    perUnit: string;
    unit: string;
    less: string;
    more: string;
    remove: string;
    /** `{action}` — remove/less/more; `{name}` — the product. */
    stepperAria: string;
    /** `{name}` — the product. */
    removeAria: string;
    summaryTitle: string;
    delivery: string;
    free: string;
    promoRow: string;
    toPay: string;
    promoPlaceholder: string;
    apply: string;
    /** `{code}` — the promo code. */
    promoNone: string;
    /** `{code}` — the promo code. */
    promoApplied: string;
    promoRejected: string;
    goCheckout: string;
    /** Opens the order line the confirmation and the checkout rail show. */
    pickup: string;
  };
  checkout: {
    metaTitle: string;
    crumb: string;
    h1: string;
    noteGuest: string;
    noteContact: string;
    /** `{phone}` — the shop's number. */
    noteLarge: string;
    methodLabel: string;
    whenLabel: string;
    whereLabel: string;
    paymentLabel: string;
    /** `{address}` — the workshop address. */
    pickupAt: string;
    dateLabel: string;
    dateMissing: string;
    quote: string;
    name: string;
    phone: string;
    email: string;
    address: string;
    forMe: string;
    recipient: string;
    recipientAria: string;
    /** `{fee}` — the card-message fee. */
    addCard: string;
    cardText: string;
    commentLabel: string;
    promoLabel: string;
    summaryTitle: string;
    delivery: string;
    free: string;
    cardRow: string;
    toPay: string;
    empty: string;
    submitting: string;
    pay: string;
    confirm: string;
    failed: string;
    /** Collection-method chips. */
    methodDelivery: string;
    methodTakeaway: string;
    /** Delivery slots. */
    slotToday: string;
    slotTomorrow: string;
    slotPick: string;
    /** Payment methods. */
    payCard: string;
    payOnline: string;
    payOnSite: string;
  };
  confirmed: {
    metaTitle: string;
    h1: string;
    tail: string;
    cta: string;
  };
  orderStatus: {
    metaTitle: string;
    crumb: string;
    numberLabel: string;
    /** Heading over the purchased-lines list. Only shown when the API sent
        at least one item. */
    itemsTitle: string;
    loading: string;
    /** The lookup itself failed — a wrong order number, or the API is down.
        `{phone}` — the shop's number. */
    errorTitle: string;
    errorBody: string;
    retry: string;
    /** `paid`. */
    paidTitle: string;
    paidBody: string;
    /** `pending`, with no `payment_method` to tell the two cases apart. */
    pendingTitle: string;
    /** `{phone}`. */
    pendingBody: string;
    /** `pending` on an online payment: the gateway has not confirmed yet. */
    pendingOnlineTitle: string;
    /** `{phone}`. */
    pendingOnlineBody: string;
    checking: string;
    refresh: string;
    /** `pending` on a method that was never going to settle online. */
    pendingOfflineTitle: string;
    pendingOfflineBody: string;
    /** `payment_failed`. `{phone}`. */
    failedTitle: string;
    failedBody: string;
    backToCheckout: string;
    toShop: string;
  };
  wishlist: {
    metaTitle: string;
    crumb: string;
    h1: string;
    empty: string;
    toShop: string;
    loading: string;
    failed: string;
  };
  about: {
    crumb: string;
    h1: string;
    p1: string;
    p2: string;
    imageAlt: string;
  };
  delivery: {
    crumb: string;
    h1: string;
    intro: string;
    colDistrict: string;
    colPrice: string;
    colTime: string;
    quote: string;
    /** `{amount}` — the free-delivery threshold. */
    freeNote: string;
    helpBefore: string;
    helpFaq: string;
    helpOr: string;
    helpContact: string;
  };
  contact: {
    crumb: string;
    h1: string;
    intro: string;
    address: string;
    phone: string;
    hours: string;
    /** The embedded map's iframe title, and the link out to the listing. */
    mapTitle: string;
    mapOpen: string;
    formTitle: string;
    fName: string;
    /** Telegram or phone — the form asks for no email address. */
    fContact: string;
    fOrder: string;
    fOrderAria: string;
    fMessage: string;
    fMessageAria: string;
    send: string;
    sending: string;
    /** Replaces the form once the question is in. */
    sentTitle: string;
    sent: string;
    sendAnother: string;
    idle: string;
    /** The POST failed. `{phone}` — the shop's number, so nobody is stranded. */
    failed: string;
  };
  faq: {
    crumb: string;
    h1: string;
    moreBefore: string;
    moreLink: string;
    moreAfter: string;
  };
  reviews: {
    crumb: string;
    h1: string;
    empty: string;
    /** `{n}` — the rating. */
    ratingAria: string;
  };
  blog: {
    crumb: string;
    h1: string;
    intro: string;
    back: string;
  };
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
    promoDaily: 'Доставка по Одесі щодня',
    promoFreeFrom: 'безкоштовна від',
    switchLabel: 'Мова',
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
    lead:
      'Родинна справа: вирощуємо квіти в Одесі вже понад десять років — частину в наших теплицях, ' +
      'частину докуповуємо для композицій, яких потребує сезон. Кожен букет зрізаємо, напуваємо і ' +
      'звʼязуємо руками того самого дня, коли він їде до вас.',
    cta: 'Купити зараз',
    statValue: 'Щодня',
    statLabel: 'Доставка по Одесі, без вихідних',
    heroAlt: 'Букет рожевих і білих троянд',
    quickBuyTitle: 'Готові до відправлення сьогодні',
    quickBuyAll: 'Усі квіти',
    quickBuyNote: 'Один дотик — і букет у кошику. Оформлення на одному екрані.',
    occasionTitle: 'Квіти на кожен випадок',
    occasionNote: 'Скажіть, з якої нагоди, а ми підкажемо, що зараз найкраще.',
    galleryTitle: 'З майстерні',
    galleryAlt: 'Фото з майстерні',
    reviewPrev: 'Назад',
    reviewPrevLabel: 'Попередній відгук',
    reviewNext: 'Далі',
    reviewNextLabel: 'Наступний відгук',
    reviewsAll: 'Усі відгуки',
    newsTitle: 'Десять відсотків знижки на перший букет',
    newsBody:
      'Один лист на місяць: що зараз у сезоні, що надіслали садівники, і час від часу — як ' +
      'продовжити життя зрізаним квітам.',
    newsEmailLabel: 'Ел. пошта',
    newsCta: 'Отримати код',
    newsSending: 'Надсилаємо…',
    newsSent: 'Дякуємо — код {code} уже в дорозі.',
    newsNote: 'Один лист на місяць. Відписка в один клік.',
    newsFailed: 'Не вдалося надіслати код. Спробуйте ще раз за хвилину.',
  },
  shop: {
    h1: 'Купити квіти в Одесі',
    intro:
      'Усе, що майстерня робить цього тижня — квіти в роздріб і готові букети. Звузьте пошук або скажіть нагоду, і ми виберемо самі.',
    sortLabel: 'Сортування',
    sortPopular: 'За популярністю',
    sortNewest: 'Найновіші',
    sortPriceAsc: 'Ціна: від найнижчої',
    sortPriceDesc: 'Ціна: від найвищої',
    categoryLabel: 'Категорія',
    upTo: 'До {price}',
    reset: 'Скинути фільтри',
  },
  product: {
    zoomHint: 'Наведіть на фото, щоб збільшити',
    addToCart: 'Додати в кошик',
    save: 'Зберегти',
    saved: 'Збережено ♥',
    saveAria: 'Зберегти: {name}',
    unsaveAria: 'Прибрати зі збережених: {name}',
    tabDescription: 'Опис',
    tabCare: 'Догляд',
    sizeLabel: 'Розмір',
    colorLabel: 'Колір',
    resetColor: 'Скинути',
    relatedTitle: 'Вам також може сподобатися',
    moveToCart: 'Перенести в кошик',
    removeSaved: 'Видалити',
    loading: 'Завантажуємо букет',
    titleSuffix: 'купити в Одесі',
  },
  category: {
    titleSuffix: 'купити в Одесі з доставкою',
  },
  cart: {
    drawerTitle: 'Ваш кошик',
    close: 'Закрити',
    closeCart: 'Закрити кошик',
    emptyA: 'Тут поки що порожньо.',
    emptyB: 'Цього тижня дуже гарні півонії.',
    sum: 'Сума',
    checkout: 'Оформити',
    perUnit: '/ шт.',
    unit: 'шт.',
    less: 'Менше',
    more: 'Більше',
    remove: 'Видалити',
    stepperAria: '{action}: {name}',
    removeAria: 'Видалити: {name}',
    summaryTitle: 'Разом до сплати',
    delivery: 'Доставка',
    free: 'Безкоштовно',
    promoRow: 'Промокод',
    toPay: 'До сплати',
    promoPlaceholder: 'Промокод',
    apply: 'Застосувати',
    promoNone: 'Спробуйте {code} — десять відсотків знижки.',
    promoApplied: '{code} застосовано.',
    promoRejected: 'Такий код не розпізнано.',
    goCheckout: 'Перейти до оформлення',
    pickup: 'Самовивіз',
  },
  checkout: {
    metaTitle: 'Оформлення — MIG Flowers',
    crumb: 'Оформлення',
    h1: 'Оформлення',
    noteGuest: 'Оформлення без реєстрації. Без акаунта, без пароля, на одному екрані.',
    noteContact: 'Наш менеджер звʼяжеться з вами в Telegram/WhatsApp/Viber, а якщо ні — на email.',
    noteLarge:
      'Для замовлення великих композицій уточніть наявність у менеджера за телефоном {phone}.',
    methodLabel: 'Спосіб отримання',
    whenLabel: 'Коли доставити',
    whereLabel: 'Куди доставити',
    paymentLabel: 'Оплата',
    pickupAt: 'Заберете самі з майстерні: {address}',
    dateLabel: 'Дата доставки',
    dateMissing: 'Оберіть дату доставки.',
    quote: 'Уточніть у менеджера',
    name: 'Імʼя',
    phone: 'Телефон',
    email: 'Ел. пошта',
    address: 'Вулиця і будинок',
    forMe: 'Це для мене',
    recipient: 'Кому доставити (за бажанням)',
    recipientAria: 'Кому доставити',
    addCard: 'Додати листівку (+{fee})',
    cardText: 'Текст листівки',
    commentLabel: 'Коментар до замовлення (за бажанням)',
    promoLabel: 'Промокод (за бажанням)',
    summaryTitle: 'Разом до сплати',
    delivery: 'Доставка',
    free: 'Безкоштовно',
    cardRow: 'Листівка',
    toPay: 'До сплати',
    empty: 'Тут поки що порожньо.',
    submitting: 'Надсилаємо…',
    pay: 'Сплатити замовлення',
    confirm: 'Підтвердити замовлення',
    failed: 'Не вдалося надіслати замовлення. Спробуйте ще раз.',
    methodDelivery: 'Доставка',
    methodTakeaway: 'Самовивіз',
    slotToday: 'Сьогодні',
    slotTomorrow: 'Завтра зранку',
    slotPick: 'Вибрати дату',
    payCard: 'Переказ на карту',
    payOnline: 'Онлайн оплата',
    payOnSite: 'Оплата на місці',
  },
  confirmed: {
    metaTitle: 'Замовлення прийнято — MIG Flowers',
    h1: 'Замовлення прийнято',
    tail: 'Флорист надішле фото готового букета, перш ніж він поїде з майстерні.',
    cta: 'Дивитися далі',
  },
  orderStatus: {
    metaTitle: 'Статус замовлення — MIG Flowers',
    crumb: 'Статус замовлення',
    numberLabel: 'Номер замовлення',
    itemsTitle: 'Ваше замовлення',
    loading: 'Перевіряємо статус замовлення…',
    errorTitle: 'Не вдалося перевірити замовлення',
    errorBody:
      'Можливо, посилання неповне або наш сервіс саме не відповідає. Спробуйте ще раз, а якщо не допоможе — зателефонуйте на {phone}, і ми подивимось вручну.',
    retry: 'Спробувати ще раз',
    paidTitle: 'Оплату отримано',
    paidBody:
      'Замовлення вже в роботі. Флорист надішле фото готового букета, перш ніж він поїде з майстерні.',
    pendingTitle: 'Замовлення прийнято',
    pendingBody:
      'Оплата ще не підтверджена. Якщо ви обрали переказ на карту або оплату на місці, так і має бути — менеджер звʼяжеться з вами й підкаже, що далі. Якщо ви платили карткою онлайн, оновіть сторінку за хвилину або зателефонуйте на {phone}.',
    pendingOnlineTitle: 'Очікуємо підтвердження оплати',
    pendingOnlineBody:
      'Банк ще не підтвердив платіж — зазвичай на це йде до хвилини, і сторінка оновиться сама. Якщо гроші вже списані, а статус не змінився, зателефонуйте на {phone}.',
    checking: 'Перевіряємо оплату…',
    refresh: 'Оновити статус',
    pendingOfflineTitle: 'Замовлення прийнято',
    pendingOfflineBody:
      'Ви обрали оплату без онлайн-платежу, тому замовлення чекає на підтвердження від менеджера. Він звʼяжеться з вами, підтвердить наявність квітів і підкаже, як сплатити.',
    failedTitle: 'Оплата не пройшла',
    failedBody:
      'Гроші не списані, замовлення не оформлене. Спробуйте сплатити ще раз або оберіть інший спосіб оплати — а якщо це повториться, зателефонуйте на {phone}, і ми оформимо замовлення вручну.',
    backToCheckout: 'Повернутися до оформлення',
    toShop: 'Дивитися далі',
  },
  wishlist: {
    metaTitle: 'Збережені квіти — MIG Flowers',
    crumb: 'Збережене',
    h1: 'Збережені квіти',
    empty: 'Ви ще нічого не зберегли. Натисніть сердечко на будь-якому букеті.',
    toShop: 'До магазину',
    loading: 'Завантажуємо збережене…',
    failed: 'Не вдалося завантажити збережені букети. Спробуйте оновити сторінку.',
  },
  about: {
    crumb: 'Про нас',
    h1: 'Родинна майстерня і теплиця, з якої все починається',
    p1:
      'Ми — родинна справа: вирощуємо і продаємо квіти в Одесі вже понад десять років. Частину ' +
      'букета складають квіти з наших теплиць, а частину докуповуємо — коли сезон ще не дав ' +
      'того, що потрібно для композиції. У букет іде тільки те, за якість чого ми відповідаємо.',
    p2:
      'Майстерня стоїть на вулиці Академіка Корольова, у Таїрово. Стрічку й досі завʼязуємо вручну, і ' +
      'з неї не виходить нічого, що ми не хотіли б отримати самі. Якщо ви телефонуєте вдень, ' +
      'відповідає хтось із родини.',
    imageAlt: 'Робочий стіл у майстерні',
  },
  delivery: {
    crumb: 'Доставка та оплата',
    h1: 'Доставка та оплата',
    intro:
      'Ми доставляємо по Одесі щодня, включно з неділями та святами. Коли саме привеземо — ' +
      'залежить від того, які квіти є в наявності, і від погоди; найшвидше про це скаже ' +
      'менеджер по телефону.',
    colDistrict: 'Район',
    colPrice: 'Вартість',
    colTime: 'Час',
    quote: 'Уточніть у менеджера',
    freeNote: 'Доставка безкоштовна для замовлень понад {amount}.',
    helpBefore: 'Щось залишилося незрозумілим?',
    helpFaq: 'Прочитайте поширені питання',
    helpOr: 'або',
    helpContact: 'напишіть нам',
  },
  contact: {
    crumb: 'Контакти',
    h1: 'Приходьте до нас',
    intro:
      'Крамниця й майстерня — в одному місці, на Академіка Корольова. Заходьте просто з вулиці.',
    address: 'Адреса',
    phone: 'Телефон',
    hours: 'Години роботи',
    mapTitle: 'Карта: майстерня на вулиці Академіка Корольова, 22',
    mapOpen: 'Відкрити в Google Картах',
    formTitle: 'Написати нам',
    fName: 'Ваше імʼя',
    fContact: 'Telegram або номер телефону',
    fOrder: 'Номер замовлення (якщо є)',
    fOrderAria: 'Номер замовлення',
    fMessage: 'Чим ми можемо допомогти?',
    fMessageAria: 'Повідомлення',
    send: 'Надіслати',
    sending: 'Надсилаємо…',
    sentTitle: 'Питання надіслано',
    sent: 'Воно вже у нас у Telegram. Хтось із нас відповість вам у Telegram або зателефонує — зазвичай протягом години.',
    sendAnother: 'Написати ще',
    idle: 'Відповідає хтось із нас, зазвичай протягом години.',
    failed: 'Не вдалося надіслати. Спробуйте ще раз або зателефонуйте на {phone}.',
  },
  faq: {
    crumb: 'Питання',
    h1: 'Питання, які нам ставлять',
    moreBefore: 'Не знайшли відповіді?',
    moreLink: 'Напишіть нам',
    moreAfter: '— хтось із нас відповість, зазвичай протягом години.',
  },
  reviews: {
    crumb: 'Відгуки',
    h1: 'Відгуки',
    empty: 'Ще жодного відгуку. Ваш може стати першим.',
    ratingAria: 'Оцінка {n} з 5',
  },
  blog: {
    crumb: 'Журнал',
    h1: 'Журнал',
    intro: 'Що зараз у сезоні, як зберегти квіти живими і час від часу — суперечки про стрічку.',
    back: '← Усі записи журналу',
  },
  seo: {
    brand: {
      title: 'MIG Flowers — квіткова майстерня в Одесі',
      description: 'Родинна квіткова майстерня в Таїрово, Одеса. Букети з доставкою по місту.',
    },
    home: {
      title: 'Квіти Одеса — купити квіти з доставкою | MIG Flowers',
      description:
        'Свіжі квіти та букети в Одесі з доставкою того ж дня. Родинна майстерня на Корольова: зрізаємо зранку, привозимо по обіді. Телефонуйте — скажемо, що є сьогодні.',
    },
    shop: {
      title: 'Купити квіти в роздріб в Одесі — каталог букетів | MIG Flowers',
      description:
        'Каталог квітів у роздріб в Одесі: букети на замовлення, композиції та квіти у вазі. Доставка по місту того ж дня, безкоштовно від 3 000 ₴.',
    },
    about: {
      title: 'Про майстерню — флористи в Одесі | MIG Flowers',
      description:
        'Родинна квіткова майстерня в Таїрово, понад 10 років в Одесі. Власні теплиці, ручна робота, кожен букет складає один флорист від початку до кінця.',
    },
    delivery: {
      title: 'Доставка квітів Одеса — умови та оплата | MIG Flowers',
      description:
        'Доставка квітів по Одесі того ж дня — залежно від наявності квітів. Безкоштовно від 3 000 ₴, оплата картою',
    },
    contact: {
      title: 'Квітковий магазин в Одесі — контакти | MIG Flowers',
      description:
        'Вулиця Академіка Корольова, 22, Таїрово, Одеса. Щодня 08:00 – 21:00. Телефонуйте або заходьте просто з вулиці — крамниця й майстерня в одному місці.',
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
    promoDaily: 'Доставка по Одессе каждый день',
    promoFreeFrom: 'бесплатная от',
    switchLabel: 'Язык',
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
    lead:
      'Семейное дело: выращиваем цветы в Одессе больше десяти лет — часть в своих теплицах, ' +
      'часть докупаем для композиций, которых требует сезон. Каждый букет срезаем, поим и ' +
      'собираем руками в тот же день, когда он едет к вам.',
    cta: 'Купить сейчас',
    statValue: 'Каждый день',
    statLabel: 'Доставка по Одессе, без выходных',
    heroAlt: 'Букет розовых и белых роз',
    quickBuyTitle: 'Готовы к отправке сегодня',
    quickBuyAll: 'Все цветы',
    quickBuyNote: 'Одно касание — и букет в корзине. Оформление на одном экране.',
    occasionTitle: 'Цветы на любой случай',
    occasionNote: 'Скажите, по какому поводу, а мы подскажем, что сейчас лучше всего.',
    galleryTitle: 'Из мастерской',
    galleryAlt: 'Фото из мастерской',
    reviewPrev: 'Назад',
    reviewPrevLabel: 'Предыдущий отзыв',
    reviewNext: 'Дальше',
    reviewNextLabel: 'Следующий отзыв',
    reviewsAll: 'Все отзывы',
    newsTitle: 'Десять процентов скидки на первый букет',
    newsBody:
      'Одно письмо в месяц: что сейчас в сезоне, что прислали садовники, и время от времени — ' +
      'как продлить жизнь срезанным цветам.',
    newsEmailLabel: 'Эл. почта',
    newsCta: 'Получить код',
    newsSending: 'Отправляем…',
    newsSent: 'Спасибо — код {code} уже в пути.',
    newsNote: 'Одно письмо в месяц. Отписка в один клик.',
    newsFailed: 'Не удалось отправить код. Попробуйте ещё раз через минуту.',
  },
  shop: {
    h1: 'Купить цветы в Одессе',
    intro:
      'Всё, что мастерская делает на этой неделе — цветы в розницу и готовые букеты. Сузьте поиск или назовите повод, и мы соберём сами.',
    sortLabel: 'Сортировка',
    sortPopular: 'По популярности',
    sortNewest: 'Самые новые',
    sortPriceAsc: 'Цена: от низкой',
    sortPriceDesc: 'Цена: от высокой',
    categoryLabel: 'Категория',
    upTo: 'До {price}',
    reset: 'Сбросить фильтры',
  },
  product: {
    zoomHint: 'Наведите на фото, чтобы увеличить',
    addToCart: 'В корзину',
    save: 'Сохранить',
    saved: 'Сохранено ♥',
    saveAria: 'Сохранить: {name}',
    unsaveAria: 'Убрать из сохранённых: {name}',
    tabDescription: 'Описание',
    tabCare: 'Уход',
    sizeLabel: 'Размер',
    colorLabel: 'Цвет',
    resetColor: 'Сбросить',
    relatedTitle: 'Вам также может понравиться',
    moveToCart: 'Перенести в корзину',
    removeSaved: 'Удалить',
    loading: 'Загружаем букет',
    titleSuffix: 'купить в Одессе',
  },
  category: {
    titleSuffix: 'купить в Одессе с доставкой',
  },
  cart: {
    drawerTitle: 'Ваша корзина',
    close: 'Закрыть',
    closeCart: 'Закрыть корзину',
    emptyA: 'Здесь пока пусто.',
    emptyB: 'На этой неделе очень хороши пионы.',
    sum: 'Сумма',
    checkout: 'Оформить',
    perUnit: '/ шт.',
    unit: 'шт.',
    less: 'Меньше',
    more: 'Больше',
    remove: 'Удалить',
    stepperAria: '{action}: {name}',
    removeAria: 'Удалить: {name}',
    summaryTitle: 'Итого к оплате',
    delivery: 'Доставка',
    free: 'Бесплатно',
    promoRow: 'Промокод',
    toPay: 'К оплате',
    promoPlaceholder: 'Промокод',
    apply: 'Применить',
    promoNone: 'Попробуйте {code} — десять процентов скидки.',
    promoApplied: '{code} применён.',
    promoRejected: 'Такой код не распознан.',
    goCheckout: 'Перейти к оформлению',
    pickup: 'Самовывоз',
  },
  checkout: {
    metaTitle: 'Оформление — MIG Flowers',
    crumb: 'Оформление',
    h1: 'Оформление',
    noteGuest: 'Оформление без регистрации. Без аккаунта, без пароля, на одном экране.',
    noteContact: 'Наш менеджер свяжется с вами в Telegram/WhatsApp/Viber, а если нет — на email.',
    noteLarge: 'Для заказа больших композиций уточните наличие у менеджера по телефону {phone}.',
    methodLabel: 'Способ получения',
    whenLabel: 'Когда доставить',
    whereLabel: 'Куда доставить',
    paymentLabel: 'Оплата',
    pickupAt: 'Заберёте сами из мастерской: {address}',
    dateLabel: 'Дата доставки',
    dateMissing: 'Выберите дату доставки.',
    quote: 'Уточните у менеджера',
    name: 'Имя',
    phone: 'Телефон',
    email: 'Эл. почта',
    address: 'Улица и дом',
    forMe: 'Это для меня',
    recipient: 'Кому доставить (по желанию)',
    recipientAria: 'Кому доставить',
    addCard: 'Добавить открытку (+{fee})',
    cardText: 'Текст открытки',
    commentLabel: 'Комментарий к заказу (по желанию)',
    promoLabel: 'Промокод (по желанию)',
    summaryTitle: 'Итого к оплате',
    delivery: 'Доставка',
    free: 'Бесплатно',
    cardRow: 'Открытка',
    toPay: 'К оплате',
    empty: 'Здесь пока пусто.',
    submitting: 'Отправляем…',
    pay: 'Оплатить заказ',
    confirm: 'Подтвердить заказ',
    failed: 'Не удалось отправить заказ. Попробуйте ещё раз.',
    methodDelivery: 'Доставка',
    methodTakeaway: 'Самовывоз',
    slotToday: 'Сегодня',
    slotTomorrow: 'Завтра утром',
    slotPick: 'Выбрать дату',
    payCard: 'Перевод на карту',
    payOnline: 'Онлайн оплата',
    payOnSite: 'Оплата на месте',
  },
  confirmed: {
    metaTitle: 'Заказ принят — MIG Flowers',
    h1: 'Заказ принят',
    tail: 'Флорист пришлёт фото готового букета, прежде чем он уедет из мастерской.',
    cta: 'Смотреть дальше',
  },
  orderStatus: {
    metaTitle: 'Статус заказа — MIG Flowers',
    crumb: 'Статус заказа',
    numberLabel: 'Номер заказа',
    itemsTitle: 'Ваш заказ',
    loading: 'Проверяем статус заказа…',
    errorTitle: 'Не удалось проверить заказ',
    errorBody:
      'Возможно, ссылка неполная или наш сервис сейчас не отвечает. Попробуйте ещё раз, а если не поможет — позвоните на {phone}, и мы посмотрим вручную.',
    retry: 'Попробовать ещё раз',
    paidTitle: 'Оплата получена',
    paidBody:
      'Заказ уже в работе. Флорист пришлёт фото готового букета, прежде чем он уедет из мастерской.',
    pendingTitle: 'Заказ принят',
    pendingBody:
      'Оплата ещё не подтверждена. Если вы выбрали перевод на карту или оплату на месте, так и должно быть — менеджер свяжется с вами и подскажет, что дальше. Если вы платили картой онлайн, обновите страницу через минуту или позвоните на {phone}.',
    pendingOnlineTitle: 'Ждём подтверждения оплаты',
    pendingOnlineBody:
      'Банк ещё не подтвердил платёж — обычно на это уходит до минуты, и страница обновится сама. Если деньги уже списаны, а статус не изменился, позвоните на {phone}.',
    checking: 'Проверяем оплату…',
    refresh: 'Обновить статус',
    pendingOfflineTitle: 'Заказ принят',
    pendingOfflineBody:
      'Вы выбрали оплату без онлайн-платежа, поэтому заказ ждёт подтверждения от менеджера. Он свяжется с вами, подтвердит наличие цветов и подскажет, как оплатить.',
    failedTitle: 'Оплата не прошла',
    failedBody:
      'Деньги не списаны, заказ не оформлен. Попробуйте оплатить ещё раз или выберите другой способ оплаты — а если это повторится, позвоните на {phone}, и мы оформим заказ вручную.',
    backToCheckout: 'Вернуться к оформлению',
    toShop: 'Смотреть дальше',
  },
  wishlist: {
    metaTitle: 'Сохранённые цветы — MIG Flowers',
    crumb: 'Избранное',
    h1: 'Сохранённые цветы',
    empty: 'Вы ещё ничего не сохранили. Нажмите сердечко на любом букете.',
    toShop: 'В магазин',
    loading: 'Загружаем сохранённое…',
    failed: 'Не удалось загрузить сохранённые букеты. Попробуйте обновить страницу.',
  },
  about: {
    crumb: 'О нас',
    h1: 'Семейная мастерская и теплица, с которой всё начинается',
    p1:
      'Мы — семейное дело: выращиваем и продаём цветы в Одессе больше десяти лет. Часть букета ' +
      'составляют цветы из наших теплиц, а часть докупаем — когда сезон ещё не дал того, что ' +
      'нужно для композиции. В букет идёт только то, за качество чего мы отвечаем.',
    p2:
      'Мастерская стоит на улице Академика Королёва, в Таирово. Ленту до сих пор завязываем вручную, ' +
      'и из неё не выходит ничего, что мы не хотели бы получить сами. Если вы звоните днём, ' +
      'отвечает кто-то из семьи.',
    imageAlt: 'Рабочий стол в мастерской',
  },
  delivery: {
    crumb: 'Доставка и оплата',
    h1: 'Доставка и оплата',
    intro:
      'Мы доставляем по Одессе каждый день, включая воскресенья и праздники. Когда именно ' +
      'привезём — зависит от того, какие цветы есть в наличии, и от погоды; быстрее всего об ' +
      'этом скажет менеджер по телефону.',
    colDistrict: 'Район',
    colPrice: 'Стоимость',
    colTime: 'Время',
    quote: 'Уточните у менеджера',
    freeNote: 'Доставка бесплатная для заказов свыше {amount}.',
    helpBefore: 'Что-то осталось непонятным?',
    helpFaq: 'Прочитайте частые вопросы',
    helpOr: 'или',
    helpContact: 'напишите нам',
  },
  contact: {
    crumb: 'Контакты',
    h1: 'Приходите к нам',
    intro: 'Магазин и мастерская — в одном месте, на Академика Королёва. Заходите прямо с улицы.',
    address: 'Адрес',
    phone: 'Телефон',
    hours: 'Часы работы',
    mapTitle: 'Карта: мастерская на улице Академика Королёва, 22',
    mapOpen: 'Открыть в Google Картах',
    formTitle: 'Написать нам',
    fName: 'Ваше имя',
    fContact: 'Telegram или номер телефона',
    fOrder: 'Номер заказа (если есть)',
    fOrderAria: 'Номер заказа',
    fMessage: 'Чем мы можем помочь?',
    fMessageAria: 'Сообщение',
    send: 'Отправить',
    sending: 'Отправляем…',
    sentTitle: 'Вопрос отправлен',
    sent: 'Он уже у нас в Telegram. Кто-то из нас ответит вам в Telegram или позвонит — обычно в течение часа.',
    sendAnother: 'Написать ещё',
    idle: 'Отвечает кто-то из нас, обычно в течение часа.',
    failed: 'Не удалось отправить. Попробуйте ещё раз или позвоните на {phone}.',
  },
  faq: {
    crumb: 'Вопросы',
    h1: 'Вопросы, которые нам задают',
    moreBefore: 'Не нашли ответа?',
    moreLink: 'Напишите нам',
    moreAfter: '— кто-то из нас ответит, обычно в течение часа.',
  },
  reviews: {
    crumb: 'Отзывы',
    h1: 'Отзывы',
    empty: 'Пока ни одного отзыва. Ваш может стать первым.',
    ratingAria: 'Оценка {n} из 5',
  },
  blog: {
    crumb: 'Журнал',
    h1: 'Журнал',
    intro: 'Что сейчас в сезоне, как сохранить цветы живыми и время от времени — споры о ленте.',
    back: '← Все записи журнала',
  },
  seo: {
    brand: {
      title: 'MIG Flowers — цветочная мастерская в Одессе',
      description: 'Семейная цветочная мастерская в Таирово, Одесса. Букеты с доставкой по городу.',
    },
    home: {
      title: 'Цветы Одесса — купить цветы с доставкой | MIG Flowers',
      description:
        'Свежие цветы и букеты в Одессе с доставкой в день заказа. Семейная мастерская на Королёва: срезаем утром, привозим после обеда. Позвоните — скажем, что есть сегодня.',
    },
    shop: {
      title: 'Купить цветы в розницу в Одессе — каталог букетов | MIG Flowers',
      description:
        'Каталог цветов в розницу в Одессе: букеты на заказ, композиции и цветы в вазе. Доставка по городу в день заказа, бесплатно от 3 000 ₴.',
    },
    about: {
      title: 'О мастерской — флористы в Одессе | MIG Flowers',
      description:
        'Семейная цветочная мастерская в Таирово, больше 10 лет в Одессе. Собственные теплицы, ручная работа, каждый букет собирает один флорист.',
    },
    delivery: {
      title: 'Доставка цветов Одесса — условия и оплата | MIG Flowers',
      description:
        'Доставка цветов по Одессе в день заказа — в зависимости от наличия цветов. Бесплатно от 3 000 ₴, оплата картой или наличными курьеру.',
    },
    contact: {
      title: 'Цветочный магазин в Одессе — контакты | MIG Flowers',
      description:
        'Улица Академика Королёва, 22, Таирово, Одесса. Ежедневно 08:00 – 21:00. Звоните или заходите прямо с улицы — магазин и мастерская в одном месте.',
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

/** Everything a client component may need, minus the SEO strings — those are
    read on the server, and handing them to `DictionaryProvider` would put every
    title and description into the RSC payload of every page. */
export type UiDictionary = Omit<Dictionary, 'seo'>;

export function getUiDictionary(locale: Locale): UiDictionary {
  const { seo: _seo, ...ui } = DICTIONARIES[locale];
  return ui;
}
