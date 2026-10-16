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
      lede: "Full Stack developer in Bishkek. I build web apps with React and TypeScript, backends with Node.js and AWS, and teach frontend at Mancho School.",
      links: {
        github: "GitHub",
        linkedin: "LinkedIn",
        email: "Email",
        resume: "Resume",
      },
      journeyTitle: "Journey",
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
      workTitle: "What I work on",
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
      openResume: "Open the resume",
      blogTitle: "From the blog",
      allPosts: "All posts",
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
      colophonTitle: "Colophon",
      colophonBefore:
        "This site is set in Computer Modern, like my LaTeX resume. I built it together with",
      colophonMiddle: ". The source code is on",
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
      lede: "Full Stack разработчик из Бишкека. Делаю веб-приложения на React и TypeScript, бэкенд на Node.js и AWS, и учу студентов frontend в Mancho School.",
      links: {
        github: "GitHub",
        linkedin: "LinkedIn",
        email: "Почта",
        resume: "Резюме",
      },
      journeyTitle: "Путь",
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
      workTitle: "Чем занимаюсь",
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
      openResume: "Открыть резюме",
      blogTitle: "Из блога",
      allPosts: "Все записи",
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
      colophonTitle: "Колофон",
      colophonBefore:
        "Сайт набран шрифтом Computer Modern, как и моё резюме в LaTeX. Код сайта я написал вместе с",
      colophonMiddle: ". Исходники открыты на",
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
