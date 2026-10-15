import { chromium } from "playwright"

const browser = await chromium.launch({
  executablePath:
    process.env.USERPROFILE +
    "\\AppData\\Local\\ms-playwright\\chromium-1208\\chrome-win64\\chrome.exe",
})
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } })

await page.goto("http://localhost:3000/", { waitUntil: "networkidle" })
await page.locator("#podcast").scrollIntoViewIfNeeded()
await page.waitForTimeout(1000)

// Force the article to a taller, less extreme aspect ratio and see if it renders.
await page.evaluate(() => {
  const section = document.querySelector("#podcast")
  const article = Array.from(section.querySelectorAll("article")).pop()
  article.style.minHeight = "40rem"
})
await page.waitForTimeout(1000)

const info = await page.evaluate(() => {
  const section = document.querySelector("#podcast")
  const article = Array.from(section.querySelectorAll("article")).pop()
  const canvas = article.querySelector("canvas")
  const gl = canvas.getContext("webgl2")
  const w = canvas.width
  const h = canvas.height
  const buf = new Uint8Array(4)
  gl.readPixels(Math.floor(w / 2), Math.floor(h / 2), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, buf)
  return {
    articleRect: article.getBoundingClientRect().toJSON(),
    canvasWidth: canvas.width,
    canvasHeight: canvas.height,
    centerPixel: Array.from(buf),
  }
})
console.log(JSON.stringify(info, null, 2))

await page.screenshot({ path: "scripts/podcast-section-tall.png", fullPage: false })

await browser.close()
