// Commands of the site terminal. Pure functions: a command line goes in,
// lines to print (and maybe an action for the UI) come out.
//
// A line is { kind, parts: [{ text, href }] }; kind is "text", "muted",
// "error" or "art". Actions: navigate, download, open, clear, close.

import { site, links } from "../data/site"
import { pageRoutes } from "../data/routes"

const say = (text, kind = "text") => ({ kind, parts: [{ text }] })
const link = (label, href, before = "") => ({
  kind: "text",
  parts: [{ text: before }, { text: label, href }],
})

const pages = {
  "": "about",
  "~": "about",
  "/": "about",
  "..": "about",
  home: "about",
  about: "about",
  resume: "resume",
  cv: "resume",
  blog: "blog",
}

const files = ["about.txt", "contacts.txt", "resume.pdf", "hire-me.sh"]
const folders = ["resume/", "blog/", "projects/"]

export const promptFor = current =>
  `guest@abdillamit:${current && current !== "about" ? `~/${current}` : "~"}$`

export const banner = lang => [
  say("Abdillamit Mamytov · terminal", "muted"),
  say(
    lang === "ru"
      ? "Наберите help, чтобы увидеть команды."
      : "Type help to see the commands.",
    "muted"
  ),
]

const sheep = String.raw`
      _~~~~~~~_
  ___( ~ ~ ~ ~ )
 (o o ~ ~ ~ ~ ~ )
  \_/( ~ ~ ~ ~ )
      ~~~~~~~~~
      ||    ||`

export const commandNames = [
  "help",
  "whoami",
  "ls",
  "cat",
  "cd",
  "pwd",
  "projects",
  "contact",
  "cv",
  "lang",
  "date",
  "echo",
  "clear",
  "exit",
  "sudo",
  "git",
  "sheep",
]

export const runCommand = (input, { lang = "en", current, translations }) => {
  const t = (en, ru) => (lang === "ru" ? ru : en)
  const [name = "", ...args] = input.trim().split(/\s+/)
  const command = name.toLowerCase()
  const arg = args.join(" ")
  const text = site[lang]
  const go = page => ({
    output: [say(`→ ${pageRoutes[page][lang]}`, "muted")],
    action: { type: "navigate", to: pageRoutes[page][lang] },
  })
  const hire = () => ({
    output: [
      say(
        t(
          "[sudo] password for guest: ********",
          "[sudo] пароль для guest: ********"
        ),
        "muted"
      ),
      say(
        t(
          "Access granted. Opening an email to Abdillamit…",
          "Доступ разрешён. Открываю письмо Абдилламиту…"
        )
      ),
    ],
    action: {
      type: "open",
      href: `${links.email}?subject=${encodeURIComponent(
        t("Let's work together", "Давай поработаем вместе")
      )}`,
    },
  })

  switch (command) {
    case "":
      return { output: [] }

    case "help":
    case "?":
      return {
        output: [
          say(t("Commands:", "Команды:")),
          say(`  whoami         ${t("who I am", "кто я")}`),
          say(`  ls             ${t("what is here", "что здесь есть")}`),
          say(
            `  cat <file>     ${t(
              "read a file",
              "прочитать файл"
            )}: about.txt, contacts.txt`
          ),
          say(
            `  cd <page>      ${t(
              "open a page",
              "открыть страницу"
            )}: about, resume, blog`
          ),
          say(`  projects       ${t("what I work on", "чем я занимаюсь")}`),
          say(
            `  contact        ${t("how to reach me", "как со мной связаться")}`
          ),
          say(
            `  cv             ${t(
              "download the resume (PDF)",
              "скачать резюме (PDF)"
            )}`
          ),
          say(`  lang en|ru     ${t("switch the language", "сменить язык")}`),
          say(`  clear          ${t("clear the screen", "очистить экран")}`),
          say(
            `  exit           ${t(
              "close the terminal (or Esc)",
              "закрыть терминал (или Esc)"
            )}`
          ),
          say(
            t(
              "Tab completes a command, ↑ and ↓ go through history.",
              "Tab дополняет команду, ↑ и ↓ листают историю."
            ),
            "muted"
          ),
        ],
      }

    case "whoami":
      return {
        output: [
          say("Abdillamit Mamytov — Full Stack Software Engineer, Bishkek."),
          say(text.about.lede),
        ],
      }

    case "about":
      return runCommand("cat about.txt", { lang, current, translations })

    case "ls":
    case "dir":
      return { output: [say([...folders, ...files].join("  "))] }

    case "pwd":
      return {
        output: [
          say(
            `/home/guest${current && current !== "about" ? `/${current}` : ""}`
          ),
        ],
      }

    case "cat":
      if (!arg)
        return {
          output: [
            say(t("usage: cat <file>", "использование: cat <файл>"), "error"),
          ],
        }
      if (arg === "about.txt") {
        return {
          output: [
            say(text.about.lede),
            ...text.about.journey.map(step =>
              say(`${step.mark.padEnd(7)} ${step.title}`)
            ),
          ],
        }
      }
      if (arg === "contacts.txt")
        return runCommand("contact", { lang, current, translations })
      if (arg === "resume.pdf") {
        return {
          output: [
            say(
              t(
                "resume.pdf is a binary file. Try cv to download it.",
                "resume.pdf — бинарный файл. Наберите cv, чтобы скачать его."
              ),
              "error"
            ),
          ],
        }
      }
      if (arg === "hire-me.sh") {
        return {
          output: [
            say("#!/bin/sh"),
            say(
              t(
                "# needs root: sudo ./hire-me.sh",
                "# нужны права root: sudo ./hire-me.sh"
              ),
              "muted"
            ),
            say("open mailto:abdillamit08@gmail.com"),
          ],
        }
      }
      return {
        output: [
          say(
            t(`cat: ${arg}: No such file`, `cat: ${arg}: нет такого файла`),
            "error"
          ),
        ],
      }

    case "cd":
    case "open": {
      const target = arg.replace(/\/$/, "").toLowerCase()
      if (target === "projects") {
        return {
          output: [say(`→ ${pageRoutes.resume[lang]}#projects`, "muted")],
          action: {
            type: "navigate",
            to: `${pageRoutes.resume[lang]}#projects`,
          },
        }
      }
      if (target in pages) return go(pages[target])
      if (files.includes(target)) {
        return {
          output: [
            say(
              t(`cd: ${arg}: Not a directory`, `cd: ${arg}: это не папка`),
              "error"
            ),
          ],
        }
      }
      return {
        output: [
          say(
            t(`cd: ${arg}: No such directory`, `cd: ${arg}: нет такой папки`),
            "error"
          ),
        ],
      }
    }

    case "resume":
    case "blog":
      return go(command)

    case "projects":
      return {
        output: text.about.work.map(item =>
          say(`${item.name.padEnd(14)} ${item.text}`)
        ),
      }

    case "contact":
    case "contacts":
      return {
        output: [
          link(links.emailLabel, links.email, "email     "),
          link(
            "linkedin.com/in/abdillamit-mamytov",
            links.linkedin,
            "linkedin  "
          ),
          link("github.com/Abdillamit", links.github, "github    "),
        ],
      }

    case "cv":
      return {
        output: [
          link(
            text.resume.pdf.split("/").pop(),
            text.resume.pdf,
            t("Downloading ", "Скачиваю ")
          ),
        ],
        action: { type: "download", href: text.resume.pdf },
      }

    case "lang": {
      const target = arg.toLowerCase()
      if (!["en", "ru"].includes(target)) {
        return {
          output: [
            say(
              t(
                `Language: English. Usage: lang en|ru`,
                `Язык: русский. Использование: lang en|ru`
              )
            ),
          ],
        }
      }
      if (target === lang) {
        return {
          output: [say(t("Already in English.", "Уже на русском."), "muted")],
        }
      }
      const to = translations?.[target] || pageRoutes.about[target]
      return {
        output: [say(`→ ${to}`, "muted")],
        action: { type: "navigate", to },
      }
    }

    case "date":
      return {
        output: [
          say(
            `${new Date().toLocaleString(t("en-US", "ru-RU"), {
              timeZone: "Asia/Bishkek",
              dateStyle: "full",
              timeStyle: "short",
            })} (${t("Bishkek", "Бишкек")})`
          ),
        ],
      }

    case "echo":
      return { output: [say(arg)] }

    case "clear":
    case "cls":
      return { output: [], action: { type: "clear" } }

    case "exit":
    case "quit":
    case "q":
      return { output: [], action: { type: "close" } }

    case "sudo":
      if (/^(\.\/)?hire-me(\.sh)?$/.test(arg) || arg === "hire") return hire()
      return {
        output: [
          say(
            t(
              "guest is not in the sudoers file. This incident will be reported.",
              "guest нет в файле sudoers. Об этом случае будет доложено."
            ),
            "error"
          ),
        ],
      }

    case "./hire-me.sh":
    case "hire-me":
    case "hire":
      return {
        output: [
          say(
            t(
              `${name}: permission denied. Try sudo.`,
              `${name}: доступ запрещён. Попробуйте sudo.`
            ),
            "error"
          ),
        ],
      }

    case "rm":
      return {
        output: [
          say(
            t(
              "rm: nice try. The site is static, there is nothing to delete.",
              "rm: хорошая попытка. Сайт статический, удалять нечего."
            ),
            "error"
          ),
        ],
      }

    case "git":
      return {
        output: [
          link(
            "github.com/Abdillamit/abdillamit",
            links.source,
            t("The source code is on ", "Исходники лежат на ")
          ),
        ],
      }

    case "sheep":
    case "baa":
    case "бээ":
      return {
        output: [
          say(sheep, "art"),
          say(
            t(
              "Baa! Greetings from the pastures of Baul.",
              "Бээ! Привет с пастбищ Баула."
            )
          ),
        ],
      }

    default:
      return {
        output: [
          say(
            t(
              `${name}: command not found. Type help.`,
              `${name}: команда не найдена. Наберите help.`
            ),
            "error"
          ),
        ],
      }
  }
}

// Completes the word being typed. Returns the new input and, when there
// is more than one option, the options to show.
export const complete = input => {
  const words = input.split(" ")
  const word = words[words.length - 1].toLowerCase()
  let options
  if (words.length === 1) options = commandNames
  else if (["cat"].includes(words[0])) options = files
  else if (["cd", "open"].includes(words[0]))
    options = ["about", "resume", "blog", "projects"]
  else if (words[0] === "lang") options = ["en", "ru"]
  else if (words[0] === "sudo") options = ["./hire-me.sh"]
  else options = []

  const matches = options.filter(option => option.startsWith(word))
  if (matches.length !== 1)
    return { input, options: matches.length > 1 ? matches : [] }
  words[words.length - 1] = matches[0]
  return { input: `${words.join(" ")} `, options: [] }
}
