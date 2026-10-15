import { chromium } from "playwright"

const browser = await chromium.launch({
  executablePath:
    process.env.USERPROFILE +
    "\\AppData\\Local\\ms-playwright\\chromium-1208\\chrome-win64\\chrome.exe",
})
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } })

await page.goto("http://localhost:3000/", { waitUntil: "networkidle" })
await page.locator("#podcast").scrollIntoViewIfNeeded()
await page.waitForTimeout(1500)

const info = await page.evaluate(() => {
  const section = document.querySelector("#podcast")
  const article = Array.from(section.querySelectorAll("article")).pop()
  const rect = article.getBoundingClientRect()
  const cx = rect.x + rect.width / 2
  const cy = rect.y + rect.height / 2
  const stack = document.elementsFromPoint(cx, cy)
  return {
    rect: rect.toJSON(),
    topElement: stack[0]?.tagName + "." + stack[0]?.className,
    fullStack: stack.map((el) => {
      const cs = getComputedStyle(el)
      return {
        tag: el.tagName,
        cls: typeof el.className === "string" ? el.className : "",
        zIndex: cs.zIndex,
        position: cs.position,
        opacity: cs.opacity,
        bg: cs.backgroundColor,
        display: cs.display,
        visibility: cs.visibility,
      }
    }),
  }
})
console.log(JSON.stringify(info, null, 2))

await browser.close()
