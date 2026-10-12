// CV content for both languages. The page layout lives in
// src/components/cv-page.js; edit text here, not in components.
//
// Dates use "YYYY-MM"; `to: null` means the role is current.

const contacts = [
  {
    id: "email",
    label: "abdillamit08@gmail.com",
    href: "mailto:abdillamit08@gmail.com",
  },
  {
    id: "linkedin",
    label: "linkedin.com/in/abdillamit-mamytov",
    href: "https://www.linkedin.com/in/abdillamit-mamytov",
  },
  {
    id: "github",
    label: "github.com/Abdillamit",
    href: "https://github.com/Abdillamit",
  },
]

const awsServices =
  "AppSync, Cognito, IAM, Lambda, API Gateway, DynamoDB, S3, CloudFront, CloudWatch, OpenSearch, EC2, EventBridge, CloudFormation, CodeCommit, CodeBuild, CodePipeline, Route 53"

const stacks = {
  finik: "React, TypeScript, Node.js, GraphQL, Redux, RxJS, AWS",
  umrahhajj: "React, TypeScript, Apollo, RxJS, Styletron, AWS AppSync",
  slonexpress: "React, Gatsby, Node.js, AWS Lambda, Cognito, S3",
}

export const updated = "2026-10-12"

export const cv = {
  en: {
    lang: "en",
    path: "/",
    name: "Abdillamit Mamytov",
    role: "Full Stack Software Engineer",
    location: "Bishkek, Kyrgyzstan",
    contacts,
    meta: {
      title: "Abdillamit Mamytov, Full Stack Software Engineer",
      description:
        "Full Stack engineer in Bishkek with 2+ years of commercial experience in fintech and logistics: React, TypeScript, GraphQL, Node.js, AWS serverless.",
    },
    ui: {
      languageNav: "Language",
      present: "present",
      stack: "Stack",
      updated: "Updated",
      skipLink: "Skip to content",
    },
    headings: {
      profile: "Profile",
      experience: "Experience",
      projects: "Projects at Mancho Devs",
      education: "Education and courses",
      skills: "Skills",
      languages: "Languages",
    },
    profile:
      "Full Stack developer with 2+ years of commercial experience in fintech and logistics. Stack: React, TypeScript, GraphQL, Node.js, AWS serverless. I mentor frontend students at Mancho School.",
    experience: [
      {
        org: "Mancho Devs",
        place: "Bishkek, Kyrgyzstan (office)",
        title: "Full Stack Software Engineer",
        from: "2024-09",
        to: null,
        items: [
          {
            label: "Full-stack development",
            text: "I build web apps and admin panels for 5 company products: frontend with React and Gatsby, backend with Node.js, GraphQL and AWS. I design APIs and data models.",
          },
          {
            label: "Tests and releases",
            text: "I write unit, component and E2E tests (Jest, React Testing Library, Cypress), maintain CI/CD in GitHub Actions and investigate production incidents using AWS CloudWatch logs.",
          },
          {
            label: "Onboarding",
            text: "Onboarded a new frontend developer to the umrahhajj project and reviewed their pull requests.",
          },
        ],
      },
      {
        org: "Mancho School",
        place: "Bishkek, Kyrgyzstan",
        title: "Frontend Mentor",
        from: "2024-09",
        to: null,
        items: [
          {
            label: "Mentoring",
            text: "Taught frontend development to 20+ students: lectures, workshops, code review, help with projects.",
          },
        ],
      },
      {
        org: "MEGA (Alfa Telecom CJSC)",
        place: "Remote",
        title: "Frontend Developer Intern",
        from: "2023-03",
        to: "2023-05",
        items: [
          {
            label: "Frontend",
            text: "Built features for a product of a large telecom company with React and TypeScript.",
          },
        ],
      },
      {
        org: "Oigonuu NGO",
        place: "Kyrgyzstan, remote",
        title: "Frontend Mentor, volunteer",
        from: "2022-03",
        to: "2022-08",
        items: [
          {
            label: "Volunteering",
            text: "Taught HTML, CSS and JavaScript to young people from villages who needed support.",
          },
        ],
      },
    ],
    projects: [
      {
        name: "Finik",
        kind: "payment platform",
        stack: stacks.finik,
        items: [
          {
            label: "Admin panel",
            text: "Built modules for transactions, accounts, users, Finik Items, access rights and cash collection; implemented tables with filters, search, batch operations, statistics and RBAC.",
          },
          {
            label: "Backend",
            text: "Implemented commission filtering by fee type (flat, percentage, dynamic tiers) in DynamoDB queries and fixed the opening and closing balance calculation in OpenSearch statistics.",
          },
          {
            label: "Documentation",
            text: "Built a site for the Payments Gateway and Web SDK in three languages (RU/KY/EN) with Gatsby and MDX: sequence diagrams of payment flows and interactive code examples.",
          },
          {
            label: "Web SDK",
            text: "Helped merchants connect payments through the Finik Web SDK (QR codes and bank-app deep links) and advised their developers on the technical side.",
          },
        ],
      },
      {
        name: "umrahhajj",
        kind: "Hajj and Umrah platform",
        stack: stacks.umrahhajj,
        items: [
          {
            label: "MVP launch",
            text: "Shipped the MVP in about 3 weeks by rewriting Finik components in Styletron.",
          },
          {
            label: "Applications and payments",
            text: "Built the applications section (list with sorting and filters, detail screens) and a participant payment card with deposit progress, using Apollo Client (cache-and-network) and RxJS epics.",
          },
        ],
      },
      {
        name: "SlonExpress",
        kind: "international logistics",
        stack: stacks.slonexpress,
        items: [
          {
            label: "Product launch",
            text: "Took the logistics platform to MVP and kept developing it, building the frontend and backend with React, Node.js, AWS Lambda and API Gateway.",
          },
          {
            label: "Admin panel",
            text: "Implemented management of users, parcels, orders and warehouses: account verification, passport data, addresses in several countries.",
          },
          {
            label: "Infrastructure",
            text: "Fixed missing styles in the production build (FOUC in Styletron); set up Cache-Control for S3, CI/CD in CodePipeline and a branded Cognito verification email.",
          },
        ],
      },
      {
        name: "Other projects",
        kind: "",
        stack: "Bitok.kg, Mancho company website",
        items: [
          {
            label: "Bitok.kg",
            text: "Fixed crypto exchange bugs in balances, fees and exchange rate calculation.",
          },
          {
            label: "Mancho website",
            text: "Maintained the site in three languages (RU/KY/EN): UI, responsive layout and animations.",
          },
        ],
      },
    ],
    education: [
      {
        org: "Mancho School",
        program: "Software Engineering",
        from: "2023-09",
        to: "2024-06",
        stack:
          "React, Gatsby, Redux, RxJS; Flutter, Bloc; Node.js, AWS (Lambda, DynamoDB, Cognito)",
      },
      {
        org: "U.Skill.Z",
        program: "Frontend Web Developer, UI Frontend Engineer certificate",
        from: "2022-07",
        to: "2022-12",
        stack:
          "JavaScript, TypeScript, Vue.js 2/3, Vuex, React, Redux, REST API",
      },
      {
        org: "OKUU IT",
        program: "Frontend Web Developer",
        from: "2021-11",
        to: "2022-02",
        stack: "JavaScript, HTML, CSS",
      },
    ],
    skills: [
      {
        label: "Programming languages",
        text: "TypeScript, JavaScript, Dart.",
      },
      {
        label: "Frontend",
        text: "React, Gatsby, Apollo Client, Redux, RxJS, Styletron, HTML, CSS/SCSS, responsive layout.",
      },
      {
        label: "Backend",
        text: `Node.js, GraphQL, API and data model design, role-based access control (RBAC); AWS (Amazon Web Services): ${awsServices}.`,
      },
      {
        label: "Testing and tools",
        text: "Jest, React Testing Library, Cypress, Git, GitHub Actions.",
      },
    ],
    languages: "Kyrgyz and Russian: fluent. English: A2.",
  },

  ru: {
    lang: "ru",
    path: "/ru/",
    name: "Abdillamit Mamytov",
    role: "Full Stack Software Engineer",
    location: "Бишкек, Кыргызстан",
    contacts,
    meta: {
      title: "Abdillamit Mamytov, Full Stack Software Engineer",
      description:
        "Full Stack разработчик из Бишкека, 2+ года коммерческого опыта в fintech и логистике: React, TypeScript, GraphQL, Node.js, AWS serverless.",
    },
    ui: {
      languageNav: "Язык",
      present: "настоящее время",
      stack: "Стек",
      updated: "Обновлено",
      skipLink: "Перейти к содержанию",
    },
    headings: {
      profile: "Профиль",
      experience: "Опыт работы",
      projects: "Проекты в Mancho Devs",
      education: "Образование и курсы",
      skills: "Навыки",
      languages: "Языки",
    },
    profile:
      "Full Stack разработчик, 2+ года коммерческого опыта в fintech и логистике. Стек: React, TypeScript, GraphQL, Node.js, AWS serverless. Менторю студентов frontend-направления в Mancho School.",
    experience: [
      {
        org: "Mancho Devs",
        place: "Бишкек, Кыргызстан (офис)",
        title: "Full Stack Software Engineer",
        from: "2024-09",
        to: null,
        items: [
          {
            label: "Full-stack разработка",
            text: "Разрабатываю веб-приложения и admin-панели для 5 продуктов компании: frontend на React и Gatsby, backend на Node.js, GraphQL и AWS; проектирую API и модели данных.",
          },
          {
            label: "Тесты и релизы",
            text: "Пишу unit-, компонентные и E2E-тесты (Jest, React Testing Library, Cypress), поддерживаю CI/CD в GitHub Actions, разбираю production-инциденты по логам AWS CloudWatch.",
          },
          {
            label: "Онбординг",
            text: "Ввёл в проект umrahhajj нового frontend-разработчика и делал code review его PR.",
          },
        ],
      },
      {
        org: "Mancho School",
        place: "Бишкек, Кыргызстан",
        title: "Frontend Mentor",
        from: "2024-09",
        to: null,
        items: [
          {
            label: "Менторство",
            text: "Обучил 20+ студентов frontend-разработке: лекции, воркшопы, code review, помощь с проектами.",
          },
        ],
      },
      {
        org: "MEGA (ЗАО «Альфа Телеком»)",
        place: "Удалённо",
        title: "Frontend Developer Intern",
        from: "2023-03",
        to: "2023-05",
        items: [
          {
            label: "Frontend",
            text: "Разрабатывал функциональность продукта крупной телеком-компании на React и TypeScript.",
          },
        ],
      },
      {
        org: "Oigonuu NGO",
        place: "Кыргызстан, удалённо",
        title: "Frontend Mentor, волонтёр",
        from: "2022-03",
        to: "2022-08",
        items: [
          {
            label: "Волонтёрство",
            text: "Обучал HTML, CSS и JavaScript ребят из сёл, которым была нужна поддержка.",
          },
        ],
      },
    ],
    projects: [
      {
        name: "Finik",
        kind: "платёжная fintech-платформа",
        stack: stacks.finik,
        items: [
          {
            label: "Admin-панель",
            text: "Разрабатывал модули транзакций, аккаунтов, пользователей, Finik Items, прав доступа и инкассации; реализовал таблицы с фильтрами, поиском, batch-операциями, статистикой и RBAC.",
          },
          {
            label: "Backend",
            text: "Реализовал фильтрацию комиссий по типу (фиксированная, процентная, динамическая шкала) в запросах к DynamoDB и исправил расчёт начального и конечного баланса в статистике на OpenSearch.",
          },
          {
            label: "Документация",
            text: "Разработал сайт для Payments Gateway и Web SDK на трёх языках (RU/KY/EN) на Gatsby и MDX: sequence-диаграммы платёжных сценариев, интерактивные примеры кода.",
          },
          {
            label: "Web SDK",
            text: "Помогал мерчантам подключать оплату через Finik Web SDK (QR-код и deep links в банковские приложения) и консультировал их разработчиков по технической части.",
          },
        ],
      },
      {
        name: "umrahhajj",
        kind: "платформа Хадж/Умра",
        stack: stacks.umrahhajj,
        items: [
          {
            label: "Запуск MVP",
            text: "Выпустил MVP примерно за 3 недели, переписав компоненты Finik на Styletron.",
          },
          {
            label: "Заявки и оплаты",
            text: "Реализовал раздел заявок (список с сортировкой и фильтрами, детальные экраны) и карточку оплат участников с прогрессом депозита на Apollo Client (cache-and-network) и RxJS-эпиках.",
          },
        ],
      },
      {
        name: "SlonExpress",
        kind: "международная логистика",
        stack: stacks.slonexpress,
        items: [
          {
            label: "Запуск продукта",
            text: "Довёл логистическую платформу до MVP и продолжил её развитие, разрабатывая frontend и backend на React, Node.js, AWS Lambda и API Gateway.",
          },
          {
            label: "Admin-панель",
            text: "Реализовал управление пользователями, посылками, заказами и складами: верификацию аккаунтов, паспортные данные, адреса в нескольких странах.",
          },
          {
            label: "Инфраструктура",
            text: "Исправил пропадание стилей в production-сборке (FOUC в Styletron); настроил Cache-Control для S3, CI/CD в CodePipeline и брендированное письмо верификации в Cognito.",
          },
        ],
      },
      {
        name: "Другие проекты",
        kind: "",
        stack: "Bitok.kg, корпоративный сайт Mancho",
        items: [
          {
            label: "Bitok.kg",
            text: "Исправил ошибки криптообменника в балансах, комиссиях и расчёте курса.",
          },
          {
            label: "Сайт Mancho",
            text: "Поддерживал сайт на трёх языках (RU/KY/EN): UI, адаптивная вёрстка и анимации.",
          },
        ],
      },
    ],
    education: [
      {
        org: "Mancho School",
        program: "Software Engineering",
        from: "2023-09",
        to: "2024-06",
        stack:
          "React, Gatsby, Redux, RxJS; Flutter, Bloc; Node.js, AWS (Lambda, DynamoDB, Cognito)",
      },
      {
        org: "U.Skill.Z",
        program: "Frontend Web Developer, сертификат UI Frontend Engineer",
        from: "2022-07",
        to: "2022-12",
        stack:
          "JavaScript, TypeScript, Vue.js 2/3, Vuex, React, Redux, REST API",
      },
      {
        org: "OKUU IT",
        program: "Frontend Web Developer",
        from: "2021-11",
        to: "2022-02",
        stack: "JavaScript, HTML, CSS",
      },
    ],
    skills: [
      {
        label: "Языки программирования",
        text: "TypeScript, JavaScript, Dart.",
      },
      {
        label: "Frontend",
        text: "React, Gatsby, Apollo Client, Redux, RxJS, Styletron, HTML, CSS/SCSS, адаптивная вёрстка.",
      },
      {
        label: "Backend",
        text: `Node.js, GraphQL, проектирование API и моделей данных, role-based access control (RBAC); AWS (Amazon Web Services): ${awsServices}.`,
      },
      {
        label: "Тесты и инструменты",
        text: "Jest, React Testing Library, Cypress, Git, GitHub Actions.",
      },
    ],
    languages: "Кыргызский и русский: свободно. Английский: A2.",
  },
}

export const languages = [
  { lang: "en", path: "/", name: "English" },
  { lang: "ru", path: "/ru/", name: "Русский" },
]
