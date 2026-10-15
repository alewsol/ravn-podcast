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
await page.waitForTimeout(1500)

const rect = await page.evaluate(() => {
  const section = document.querySelector("#podcast")
  const article = Array.from(section.querySelectorAll("article")).pop()
  return article.getBoundingClientRect().toJSON()
})

const buf = await page.screenshot({
  clip: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
})

const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true })
console.log("dimensions", info)

const colorCounts = new Map()
for (let i = 0; i < data.length; i += info.channels) {
  const key = `${data[i]},${data[i + 1]},${data[i + 2]}`
  colorCounts.set(key, (colorCounts.get(key) || 0) + 1)
}
const sorted = [...colorCounts.entries()].sort((a, b) => b[1] - a[1])
console.log("unique colors:", colorCounts.size)
console.log("top colors:", sorted.slice(0, 10))

await browser.close()
