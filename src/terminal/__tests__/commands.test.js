import { banner, complete, promptFor, runCommand } from "../commands"

const textOf = result =>
  result.output.map(line => line.parts.map(part => part.text).join(""))

const en = {
  lang: "en",
  current: "about",
  translations: { en: "/", ru: "/ru/" },
}
const ru = {
  lang: "ru",
  current: "resume",
  translations: { en: "/resume/", ru: "/ru/resume/" },
}

describe("terminal commands", () => {
  it("shows a banner and a prompt with the current page", () => {
    expect(banner("ru")[1].parts[0].text).toMatch(/help/)
    expect(promptFor("about")).toBe("guest@abdillamit:~$")
    expect(promptFor("resume")).toBe("guest@abdillamit:~/resume$")
    expect(promptFor(undefined)).toBe("guest@abdillamit:~$")
  })

  it("lists the commands in the page language", () => {
    expect(textOf(runCommand("help", en))[0]).toBe("Commands:")
    expect(textOf(runCommand("HELP", ru))[0]).toBe("Команды:")
  })

  it("ignores an empty line", () => {
    expect(runCommand("   ", en)).toEqual({ output: [] })
  })

  it("tells who I am and what is here", () => {
    expect(textOf(runCommand("whoami", en))[0]).toMatch(
      /Full Stack Software Engineer/
    )
    expect(textOf(runCommand("ls", en))[0]).toContain("hire-me.sh")
    expect(textOf(runCommand("pwd", ru))[0]).toBe("/home/guest/resume")
  })

  it("reads files", () => {
    expect(textOf(runCommand("cat about.txt", en)).length).toBeGreaterThan(3)
    expect(textOf(runCommand("about", en)).length).toBeGreaterThan(3)
    expect(runCommand("cat contacts.txt", en).output[0].parts[1].href).toBe(
      "mailto:abdillamit08@gmail.com"
    )
    expect(runCommand("cat resume.pdf", en).output[0].kind).toBe("error")
    expect(textOf(runCommand("cat hire-me.sh", en))[1]).toMatch(/sudo/)
    expect(textOf(runCommand("cat", en))[0]).toMatch(/usage/)
    expect(textOf(runCommand("cat nope", ru))[0]).toBe(
      "cat: nope: нет такого файла"
    )
  })

  it("navigates with cd in the page language", () => {
    expect(runCommand("cd resume", ru).action).toEqual({
      type: "navigate",
      to: "/ru/resume/",
    })
    expect(runCommand("cd blog/", en).action.to).toBe("/blog/")
    expect(runCommand("cd ..", ru).action.to).toBe("/ru/")
    expect(runCommand("cd", en).action.to).toBe("/")
    expect(runCommand("open projects", en).action.to).toBe("/resume/#projects")
    expect(runCommand("blog", en).action.to).toBe("/blog/")
    expect(textOf(runCommand("cd about.txt", en))[0]).toMatch(/Not a directory/)
    expect(textOf(runCommand("cd mars", en))[0]).toMatch(/No such directory/)
  })

  it("lists projects and contacts", () => {
    expect(textOf(runCommand("projects", en))[0]).toMatch(/^Finik/)
    const contact = runCommand("contact", en).output
    expect(contact.map(line => line.parts[1].href)).toEqual([
      "mailto:abdillamit08@gmail.com",
      "https://www.linkedin.com/in/abdillamit-mamytov",
      "https://github.com/Abdillamit",
    ])
  })

  it("downloads the resume in the page language", () => {
    expect(runCommand("cv", en).action).toEqual({
      type: "download",
      href: "/cv/Abdillamit_Mamytov_CV_EN.pdf",
    })
    expect(runCommand("cv", ru).action.href).toBe(
      "/cv/Abdillamit_Mamytov_CV_RU.pdf"
    )
  })

  it("switches the language of the current page", () => {
    expect(runCommand("lang en", ru).action).toEqual({
      type: "navigate",
      to: "/resume/",
    })
    expect(runCommand("lang ru", { lang: "en" }).action.to).toBe("/ru/")
    expect(runCommand("lang ru", ru).action).toBeUndefined()
    expect(textOf(runCommand("lang", en))[0]).toMatch(/Usage: lang en\|ru/)
  })

  it("clears, closes, echoes and tells the date", () => {
    expect(runCommand("clear", en).action).toEqual({ type: "clear" })
    expect(runCommand("exit", en).action).toEqual({ type: "close" })
    expect(runCommand("q", en).action).toEqual({ type: "close" })
    expect(textOf(runCommand("echo hi there", en))[0]).toBe("hi there")
    expect(textOf(runCommand("date", en))[0]).toMatch(/Bishkek/)
  })

  it("has a few jokes", () => {
    const hire = runCommand("sudo ./hire-me.sh", en)
    expect(hire.action.type).toBe("open")
    expect(hire.action.href).toMatch(/^mailto:abdillamit08@gmail.com\?subject=/)
    expect(runCommand("sudo hire", en).action.type).toBe("open")
    expect(textOf(runCommand("./hire-me.sh", en))[0]).toMatch(
      /permission denied/
    )
    expect(textOf(runCommand("sudo reboot", en))[0]).toMatch(/sudoers/)
    expect(textOf(runCommand("rm -rf /", ru))[0]).toMatch(/хорошая попытка/)
    expect(runCommand("git", en).output[0].parts[1].href).toBe(
      "https://github.com/Abdillamit/abdillamit"
    )
    expect(runCommand("бээ", ru).output[0].kind).toBe("art")
  })

  it("explains unknown commands", () => {
    expect(textOf(runCommand("vim", en))[0]).toBe(
      "vim: command not found. Type help."
    )
  })
})

describe("tab completion", () => {
  it("completes a single match and adds a space", () => {
    expect(complete("wh")).toEqual({ input: "whoami ", options: [] })
    expect(complete("cd re")).toEqual({ input: "cd resume ", options: [] })
    expect(complete("cat ab")).toEqual({ input: "cat about.txt ", options: [] })
    expect(complete("lang r")).toEqual({ input: "lang ru ", options: [] })
    expect(complete("sudo ./")).toEqual({
      input: "sudo ./hire-me.sh ",
      options: [],
    })
  })

  it("shows the options when there are several", () => {
    expect(complete("c")).toEqual({
      input: "c",
      options: ["cat", "cd", "contact", "cv", "clear"],
    })
  })

  it("leaves the input alone when nothing matches", () => {
    expect(complete("zz")).toEqual({ input: "zz", options: [] })
    expect(complete("echo h")).toEqual({ input: "echo h", options: [] })
  })
})
