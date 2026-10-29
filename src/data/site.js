// Text for the site frame (navigation, footer) and the About page.
// CV content lives in cv.js, blog posts in content/blog.

export const site = {
  en: {
    nav: {
      label: "Site sections",
      about: "About",
      resume: "Resume",
      blog: "Blog",
      language: "Language",
      role: "Full Stack Engineer · Bishkek",
      menu: "Menu",
      close: "Close",
      contacts: "Contacts",
      github: "GitHub",
    },
    meta: {
      about: {
        title: "Abdillamit Mamytov, Full Stack Software Engineer",
        description:
          "Full Stack engineer in Bishkek: React, TypeScript, Node.js and AWS. Resume, projects and blog.",
      },
      resume: {
        title: "Resume | Abdillamit Mamytov",
        description:
          "Resume of Abdillamit Mamytov, Full Stack Software Engineer with 2+ years in fintech and logistics.",
      },
      blog: {
        title: "Blog | Abdillamit Mamytov",
        description:
          "Stories and notes about how I got into software engineering and what I am learning.",
      },
    },
    about: {
      announce: "New on the blog",
      announceRead: "Read",
      eyebrow: "Bishkek · UTC+6",
      role: "Full Stack Engineer at Mancho Devs",
      title: {
        before: "From a mountain village to",
        accent: "shipping fintech.",
      },
      lede: "Full Stack developer in Bishkek. I build web apps with React and TypeScript, backends with Node.js and AWS, and teach frontend at Mancho School.",
      openResume: "Open the resume",
      github: "GitHub",
      terminalHint: {
        before: "or press",
        after: "for the full terminal",
      },
      terminal: {
        label: "Terminal",
        quick: "Quick commands",
        expand: "Open the full terminal",
        input: "Type a command",
        placeholder: "type a command",
        complete: "complete",
        history: "history",
        full: "full screen",
      },
      productsLabel: {
        before: "Products I work on at",
        accent: "Mancho Devs",
      },
      workEyebrow: "Work",
      workTitle: "From admin panels to an MVP in three weeks.",
      workText:
        "I build web apps and admin panels for 5 company products: frontend with React and Gatsby, backend with Node.js, GraphQL and AWS.",
      workTabs: "Products",
      diagramLabel: "How the parts of the product connect",
      products: [
        {
          id: "finik",
          name: "Finik",
          kind: "Payment platform",
          title: "Admin panel and docs for a payment platform",
          text: "Modules for transactions, accounts, users, access rights and cash collection, plus a documentation site for the Payments Gateway and Web SDK.",
          items: [
            {
              label: "Admin panel",
              text: "Tables with filters, search, batch operations, statistics and RBAC.",
            },
            {
              label: "Backend",
              text: "Commission filtering by fee type in DynamoDB; opening and closing balances fixed in OpenSearch statistics.",
            },
            {
              label: "Docs",
              text: "A Gatsby and MDX site in RU, KY and EN with sequence diagrams and interactive code examples.",
            },
          ],
          stack: [
            "React",
            "TypeScript",
            "Node.js",
            "GraphQL",
            "Redux",
            "RxJS",
            "AWS",
          ],
          layers: [
            {
              tag: "UI",
              title: "Admin panel",
              sub: "transactions · accounts · RBAC",
            },
            {
              tag: "DOCS",
              title: "Gateway and Web SDK docs",
              sub: "Gatsby + MDX · RU / KY / EN",
            },
            {
              tag: "API",
              title: "GraphQL on Node.js",
              sub: "fee filters · balance statistics",
            },
            {
              tag: "DATA",
              title: "DynamoDB and OpenSearch",
              sub: "AWS serverless",
            },
          ],
        },
        {
          id: "umrahhajj",
          name: "umrahhajj",
          kind: "Hajj and Umrah platform",
          title: "An MVP shipped in about three weeks",
          text: "I rewrote Finik components in Styletron to launch fast, then built the applications section and participant payments.",
          items: [
            {
              label: "Applications",
              text: "A list with sorting and filters, and detail screens.",
            },
            {
              label: "Payments",
              text: "A participant card with deposit progress on Apollo Client and RxJS epics.",
            },
            {
              label: "Team",
              text: "Onboarded a new frontend developer and reviewed their pull requests.",
            },
          ],
          stack: [
            "React",
            "TypeScript",
            "Apollo",
            "RxJS",
            "Styletron",
            "AWS AppSync",
          ],
          layers: [
            {
              tag: "UI",
              title: "Applications and detail screens",
              sub: "sorting · filters",
            },
            {
              tag: "STATE",
              title: "RxJS epics",
              sub: "Apollo cache-and-network",
            },
            { tag: "API", title: "AWS AppSync", sub: "GraphQL" },
            {
              tag: "SHIP",
              title: "MVP in about 3 weeks",
              sub: "Finik components in Styletron",
            },
          ],
        },
        {
          id: "slonexpress",
          name: "SlonExpress",
          kind: "International logistics",
          title: "A logistics platform, from MVP onward",
          text: "Frontend and backend for users, parcels, orders and warehouses in several countries.",
          items: [
            {
              label: "Admin panel",
              text: "Account verification, passport data and addresses in several countries.",
            },
            {
              label: "Infrastructure",
              text: "Fixed missing styles in production, set up Cache-Control on S3 and CI/CD in CodePipeline.",
            },
            {
              label: "Auth",
              text: "A branded Cognito verification email.",
            },
          ],
          stack: ["React", "Gatsby", "Node.js", "AWS Lambda", "Cognito", "S3"],
          layers: [
            {
              tag: "UI",
              title: "Gatsby and React admin",
              sub: "users · parcels · orders · warehouses",
            },
            {
              tag: "AUTH",
              title: "Cognito",
              sub: "verification · branded email",
            },
            { tag: "API", title: "Node.js on Lambda", sub: "API Gateway" },
            {
              tag: "OPS",
              title: "S3 and CodePipeline",
              sub: "Cache-Control · CI/CD",
            },
          ],
        },
        {
          id: "school",
          name: "Mancho School",
          kind: "Education",
          title: "Teaching frontend to 20+ students",
          text: "Lectures, workshops and code review at the school where I studied software engineering myself.",
          items: [
            {
              label: "Lectures and workshops",
              text: "Frontend development for the school’s students.",
            },
            {
              label: "Code review",
              text: "Feedback on student projects and help when they get stuck.",
            },
            {
              label: "Since 2024",
              text: "Mentor since September 2024, the same month I joined Mancho Devs.",
            },
          ],
          stack: ["JavaScript", "React", "TypeScript", "Git"],
          layers: [
            {
              tag: "LEARN",
              title: "Student, 2023",
              sub: "Software Engineering program",
            },
            {
              tag: "TEACH",
              title: "Lectures and workshops",
              sub: "frontend",
            },
            { tag: "REVIEW", title: "Code review", sub: "student projects" },
            { tag: "NOW", title: "20+ students", sub: "mentor since 2024" },
          ],
        },
      ],
      stackEyebrow: "Stack",
      stackTitle: "React on the front, AWS behind it.",
      stackFiles: "Files",
      stackNotes: [
        {
          label: "Tests",
          text: "Unit, component and E2E tests with Jest, React Testing Library and Cypress.",
        },
        {
          label: "Releases",
          text: "CI/CD in GitHub Actions and CodePipeline.",
        },
        {
          label: "Production",
          text: "Incidents traced through AWS CloudWatch logs.",
        },
      ],
      journeyEyebrow: "Journey",
      journeyTitle: "Self-taught, between pastures and LeetCode.",
      journey: [
        {
          mark: "Baul",
          isWord: true,
          title: "Where it started",
          text: "A village in Batken Region. I taught myself with YouTube and Udemy, between pastures and LeetCode.",
        },
        {
          mark: "2021",
          title: "OKUU IT",
          text: "First course: HTML, CSS and JavaScript.",
        },
        {
          mark: "2022",
          title: "U.Skill.Z and Oigonuu NGO",
          text: "Vue, React and Redux, UI Frontend Engineer certificate. Volunteered teaching web basics to young people from villages.",
        },
        {
          mark: "2023",
          title: "MEGA and Mancho School",
          text: "Frontend intern on React and TypeScript. Joined the Software Engineering program at Mancho School.",
        },
        {
          mark: "2024",
          title: "Mancho Devs",
          text: "Full Stack Software Engineer. The same year I became a mentor at Mancho School.",
        },
        {
          mark: "Now",
          isWord: true,
          title: "5 products and 20+ students",
          text: "Working on Finik, umrahhajj and SlonExpress. Lectures, workshops and code review at Mancho School.",
        },
      ],
      // Short lines for the terminal `projects` command
      work: [
        {
          name: "Finik",
          text: "admin panel of a payment platform, documentation and Web SDK for merchants.",
        },
        {
          name: "umrahhajj",
          text: "MVP in about 3 weeks with React, Apollo and RxJS.",
        },
        {
          name: "SlonExpress",
          text: "logistics platform on React, Node.js and AWS Lambda.",
        },
        {
          name: "Mancho School",
          text: "lectures, workshops and code review for students.",
        },
      ],
      blogEyebrow: "Blog",
      blogTitle: "From the blog",
      readPost: "Read the story",
      allPosts: "All posts",
      place: "Baul · Leylek",
      contactEyebrow: "Contact",
      contactTitle: "Let’s build something useful.",
      contactText: "Write to me about frontend, full-stack work or mentoring.",
    },
    resume: {
      title: "Resume",
      updated: "Updated",
      download: "Download PDF",
      pdf: "/cv/Abdillamit_Mamytov_CV_EN.pdf",
    },
    blog: {
      title: "Blog",
      intro:
        "Stories and notes about how I got into software engineering and what I am learning.",
      nextTitle: "Next",
      next: "New posts will appear here. To see them first, follow me on",
      allPosts: "All posts",
      aboutAuthor: "About the author",
      alsoIn: "Also in",
      minRead: "min read",
      otherLanguage: "Русский",
    },
    footer: {
      pages: "Pages",
      elsewhere: "Elsewhere",
      colophonTitle: "Colophon",
      colophonBefore:
        "Set in Onest and JetBrains Mono, with backgrounds from React Bits. I built it together with",
      colophonMiddle: ". The source code is on",
      terminalBefore: "For the curious there is a terminal: press ~ or",
      terminalButton: "open it",
      rights: "Bishkek",
    },
  },

  ru: {
    nav: {
      label: "Разделы сайта",
      about: "Обо мне",
      resume: "Резюме",
      blog: "Блог",
      language: "Язык",
      role: "Full Stack разработчик · Бишкек",
      menu: "Меню",
      close: "Закрыть",
      contacts: "Контакты",
      github: "GitHub",
    },
    meta: {
      about: {
        title: "Abdillamit Mamytov, Full Stack Software Engineer",
        description:
          "Full Stack разработчик из Бишкека: React, TypeScript, Node.js и AWS. Резюме, проекты и блог.",
      },
      resume: {
        title: "Резюме | Abdillamit Mamytov",
        description:
          "Резюме Abdillamit Mamytov, Full Stack Software Engineer, 2+ года в fintech и логистике.",
      },
      blog: {
        title: "Блог | Abdillamit Mamytov",
        description:
          "Истории и заметки о том, как я пришёл в разработку и чему учусь.",
      },
    },
    about: {
      announce: "Новое в блоге",
      announceRead: "Читать",
      eyebrow: "Бишкек · UTC+6",
      role: "Full Stack разработчик в Mancho Devs",
      title: {
        before: "Из горного села",
        accent: "в финтех.",
      },
      lede: "Full Stack разработчик из Бишкека. Делаю веб-приложения на React и TypeScript, бэкенд на Node.js и AWS, и учу студентов frontend в Mancho School.",
      openResume: "Открыть резюме",
      github: "GitHub",
      terminalHint: {
        before: "или нажмите",
        after: "для полного терминала",
      },
      terminal: {
        label: "Терминал",
        quick: "Быстрые команды",
        expand: "Открыть терминал во весь экран",
        input: "Введите команду",
        placeholder: "введите команду",
        complete: "дополнить",
        history: "история",
        full: "весь экран",
      },
      productsLabel: {
        before: "Продукты, над которыми работаю в",
        accent: "Mancho Devs",
      },
      workEyebrow: "Работа",
      workTitle: "От админок до MVP за три недели.",
      workText:
        "Делаю веб-приложения и админки для 5 продуктов компании: frontend на React и Gatsby, backend на Node.js, GraphQL и AWS.",
      workTabs: "Продукты",
      diagramLabel: "Как устроены части продукта",
      products: [
        {
          id: "finik",
          name: "Finik",
          kind: "Платёжная платформа",
          title: "Админка и документация платёжной платформы",
          text: "Модули транзакций, аккаунтов, пользователей, прав доступа и инкассации, а ещё сайт документации для Payments Gateway и Web SDK.",
          items: [
            {
              label: "Админка",
              text: "Таблицы с фильтрами, поиском, массовыми операциями, статистикой и RBAC.",
            },
            {
              label: "Бэкенд",
              text: "Фильтрация комиссий по типу в DynamoDB; исправил расчёт начального и конечного баланса в статистике на OpenSearch.",
            },
            {
              label: "Документация",
              text: "Сайт на Gatsby и MDX на трёх языках (RU, KY, EN) с диаграммами платёжных сценариев и интерактивными примерами кода.",
            },
          ],
          stack: [
            "React",
            "TypeScript",
            "Node.js",
            "GraphQL",
            "Redux",
            "RxJS",
            "AWS",
          ],
          layers: [
            {
              tag: "UI",
              title: "Админка",
              sub: "транзакции · аккаунты · RBAC",
            },
            {
              tag: "DOCS",
              title: "Документация Gateway и Web SDK",
              sub: "Gatsby + MDX · RU / KY / EN",
            },
            {
              tag: "API",
              title: "GraphQL на Node.js",
              sub: "фильтры комиссий · статистика балансов",
            },
            {
              tag: "DATA",
              title: "DynamoDB и OpenSearch",
              sub: "AWS serverless",
            },
          ],
        },
        {
          id: "umrahhajj",
          name: "umrahhajj",
          kind: "Платформа для хаджа и умры",
          title: "MVP примерно за три недели",
          text: "Чтобы запуститься быстро, переписал компоненты Finik на Styletron, а потом сделал раздел заявок и оплаты участников.",
          items: [
            {
              label: "Заявки",
              text: "Список с сортировкой и фильтрами и экраны с деталями.",
            },
            {
              label: "Оплаты",
              text: "Карточка участника с прогрессом депозита на Apollo Client и RxJS-эпиках.",
            },
            {
              label: "Команда",
              text: "Ввёл в проект нового frontend-разработчика и делал code review его PR.",
            },
          ],
          stack: [
            "React",
            "TypeScript",
            "Apollo",
            "RxJS",
            "Styletron",
            "AWS AppSync",
          ],
          layers: [
            {
              tag: "UI",
              title: "Заявки и экраны деталей",
              sub: "сортировка · фильтры",
            },
            {
              tag: "STATE",
              title: "RxJS-эпики",
              sub: "Apollo cache-and-network",
            },
            { tag: "API", title: "AWS AppSync", sub: "GraphQL" },
            {
              tag: "SHIP",
              title: "MVP примерно за 3 недели",
              sub: "компоненты Finik на Styletron",
            },
          ],
        },
        {
          id: "slonexpress",
          name: "SlonExpress",
          kind: "Международная логистика",
          title: "Логистическая платформа: от MVP и дальше",
          text: "Frontend и backend для пользователей, посылок, заказов и складов в нескольких странах.",
          items: [
            {
              label: "Админка",
              text: "Верификация аккаунтов, паспортные данные и адреса в нескольких странах.",
            },
            {
              label: "Инфраструктура",
              text: "Исправил пропадание стилей в production, настроил Cache-Control для S3 и CI/CD в CodePipeline.",
            },
            {
              label: "Авторизация",
              text: "Брендированное письмо верификации в Cognito.",
            },
          ],
          stack: ["React", "Gatsby", "Node.js", "AWS Lambda", "Cognito", "S3"],
          layers: [
            {
              tag: "UI",
              title: "Админка на Gatsby и React",
              sub: "пользователи · посылки · заказы · склады",
            },
            {
              tag: "AUTH",
              title: "Cognito",
              sub: "верификация · брендированное письмо",
            },
            { tag: "API", title: "Node.js на Lambda", sub: "API Gateway" },
            {
              tag: "OPS",
              title: "S3 и CodePipeline",
              sub: "Cache-Control · CI/CD",
            },
          ],
        },
        {
          id: "school",
          name: "Mancho School",
          kind: "Образование",
          title: "Учу frontend 20+ студентов",
          text: "Лекции, воркшопы и code review в школе, где я сам учился на Software Engineering.",
          items: [
            {
              label: "Лекции и воркшопы",
              text: "Frontend-разработка для студентов школы.",
            },
            {
              label: "Code review",
              text: "Разбираю проекты студентов и помогаю, когда они застревают.",
            },
            {
              label: "С 2024 года",
              text: "Ментор с сентября 2024-го, в тот же месяц я пришёл в Mancho Devs.",
            },
          ],
          stack: ["JavaScript", "React", "TypeScript", "Git"],
          layers: [
            {
              tag: "LEARN",
              title: "Студент, 2023",
              sub: "программа Software Engineering",
            },
            {
              tag: "TEACH",
              title: "Лекции и воркшопы",
              sub: "frontend",
            },
            { tag: "REVIEW", title: "Code review", sub: "проекты студентов" },
            { tag: "NOW", title: "20+ студентов", sub: "ментор с 2024 года" },
          ],
        },
      ],
      stackEyebrow: "Стек",
      stackTitle: "React на фронте, AWS за ним.",
      stackFiles: "Файлы",
      stackNotes: [
        {
          label: "Тесты",
          text: "Unit-, компонентные и E2E-тесты на Jest, React Testing Library и Cypress.",
        },
        {
          label: "Релизы",
          text: "CI/CD в GitHub Actions и CodePipeline.",
        },
        {
          label: "Production",
          text: "Инциденты разбираю по логам AWS CloudWatch.",
        },
      ],
      journeyEyebrow: "Путь",
      journeyTitle: "Учился сам, между пастбищами и LeetCode.",
      journey: [
        {
          mark: "Баул",
          isWord: true,
          title: "Начало",
          text: "Деревня в Баткенской области. Учился сам по YouTube и Udemy, между пастбищами и LeetCode.",
        },
        {
          mark: "2021",
          title: "OKUU IT",
          text: "Первый курс: HTML, CSS и JavaScript.",
        },
        {
          mark: "2022",
          title: "U.Skill.Z и Oigonuu NGO",
          text: "Vue, React и Redux, сертификат UI Frontend Engineer. Волонтёром учил ребят из сёл основам веб-разработки.",
        },
        {
          mark: "2023",
          title: "MEGA и Mancho School",
          text: "Стажировка frontend-разработчиком на React и TypeScript. Поступил в Mancho School на Software Engineering.",
        },
        {
          mark: "2024",
          title: "Mancho Devs",
          text: "Full Stack Software Engineer. В том же году стал ментором в Mancho School.",
        },
        {
          mark: "Сейчас",
          isWord: true,
          title: "5 продуктов и 20+ студентов",
          text: "Работаю над Finik, umrahhajj и SlonExpress. Веду лекции, воркшопы и code review в Mancho School.",
        },
      ],
      // Short lines for the terminal `projects` command
      work: [
        {
          name: "Finik",
          text: "admin-панель платёжной платформы, документация и Web SDK для мерчантов.",
        },
        {
          name: "umrahhajj",
          text: "MVP примерно за 3 недели на React, Apollo и RxJS.",
        },
        {
          name: "SlonExpress",
          text: "логистическая платформа на React, Node.js и AWS Lambda.",
        },
        {
          name: "Mancho School",
          text: "лекции, воркшопы и code review для студентов.",
        },
      ],
      blogEyebrow: "Блог",
      blogTitle: "Из блога",
      readPost: "Читать историю",
      allPosts: "Все записи",
      place: "Баул · Лейлек",
      contactEyebrow: "Контакты",
      contactTitle: "Давайте сделаем что-то полезное.",
      contactText:
        "Пишите мне про frontend, full-stack разработку или менторство.",
    },
    resume: {
      title: "Резюме",
      updated: "Обновлено",
      download: "Скачать PDF",
      pdf: "/cv/Abdillamit_Mamytov_CV_RU.pdf",
    },
    blog: {
      title: "Блог",
      intro: "Истории и заметки о том, как я пришёл в разработку и чему учусь.",
      nextTitle: "Дальше",
      next: "Новые статьи появятся здесь. Чтобы увидеть их первым, следите за мной в",
      allPosts: "Все записи",
      aboutAuthor: "Об авторе",
      alsoIn: "Также на",
      minRead: "мин чтения",
      otherLanguage: "English",
    },
    footer: {
      pages: "Страницы",
      elsewhere: "Где ещё",
      colophonTitle: "Колофон",
      colophonBefore:
        "Сайт набран шрифтами Onest и JetBrains Mono, фоны взяты из React Bits. Код сайта я написал вместе с",
      colophonMiddle: ". Исходники открыты на",
      terminalBefore: "Для любопытных есть терминал: нажмите ~ или",
      terminalButton: "откройте его",
      rights: "Бишкек",
    },
  },
}

export const links = {
  github: "https://github.com/Abdillamit",
  linkedin: "https://www.linkedin.com/in/abdillamit-mamytov",
  email: "mailto:abdillamit08@gmail.com",
  emailLabel: "abdillamit08@gmail.com",
  source: "https://github.com/Abdillamit/abdillamit",
  claudeCode: "https://claude.com/claude-code",
}
