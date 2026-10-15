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

const forceResult = await page.evaluate(() => {
  const section = document.querySelector("#podcast")
  const article = Array.from(section.querySelectorAll("article")).pop()
  const shaderDiv = article.querySelector('[data-paper-shader]')
  const mount = shaderDiv.paperShaderMount
  const before = { w: mount.canvasElement.width, h: mount.canvasElement.height, err: mount.gl.getError() }
  // force resize + render regardless of cached size check
  mount.canvasElement.width = 0
  mount.canvasElement.height = 0
  mount.handleResize()
  const after = { w: mount.canvasElement.width, h: mount.canvasElement.height, err: mount.gl.getError() }
  return { before, after }
})
console.log(forceResult)
await page.waitForTimeout(300)

const rect = await page.evaluate(() => {
  const section = document.querySelector("#podcast")
  const article = Array.from(section.querySelectorAll("article")).pop()
  return article.getBoundingClientRect().toJSON()
})
const buf = await page.screenshot({ clip: rect })
const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true })
const colorCounts = new Map()
for (let i = 0; i < data.length; i += info.channels) {
  const key = `${data[i]},${data[i + 1]},${data[i + 2]}`
  colorCounts.set(key, (colorCounts.get(key) || 0) + 1)
}
console.log("unique colors after forced re-render:", colorCounts.size)
console.log([...colorCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5))
await page.screenshot({ path: "scripts/podcast-after-force.png", clip: rect })

await browser.close()
