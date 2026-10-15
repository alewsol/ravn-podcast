import { chromium } from "playwright"
import sharp from "sharp"

const browser = await chromium.launch({
  executablePath:
    process.env.USERPROFILE +
    "\\AppData\\Local\\ms-playwright\\chromium-1208\\chrome-win64\\chrome.exe",
})
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } })

await page.goto("http://localhost:3000/", { waitUntil: "networkidle" })
await page.locator("#podcast").scrollIntoViewIfNeeded()
await page.waitForTimeout(1000)

// Dispose every OTHER shader mount on the page except the one in #podcast,
// then force a resize on the remaining one to see if it starts painting.
await page.evaluate(() => {
  const shaderDivs = Array.from(document.querySelectorAll("[data-paper-shader]")).filter(
    (el) => el.tagName !== "STYLE"
  )
  for (const el of shaderDivs) {
    if (!el.closest("#podcast") && el.paperShaderMount) {
      el.paperShaderMount.dispose()
    }
  }
  window.dispatchEvent(new Event("resize"))
})
await page.waitForTimeout(1000)

const rect = await page.evaluate(() => {
  const section = document.querySelector("#podcast")
  const article = Array.from(section.querySelectorAll("article")).pop()
  return article.getBoundingClientRect().toJSON()
})

const buf = await page.screenshot({
  clip: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
})
const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true })
const colorCounts = new Map()
for (let i = 0; i < data.length; i += info.channels) {
  const key = `${data[i]},${data[i + 1]},${data[i + 2]}`
  colorCounts.set(key, (colorCounts.get(key) || 0) + 1)
}
console.log("unique colors after disposing other shaders:", colorCounts.size)
console.log([...colorCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5))

await page.screenshot({ path: "scripts/podcast-after-dispose.png", clip: rect })

await browser.close()
