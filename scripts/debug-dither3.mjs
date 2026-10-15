import { chromium } from "playwright"

const browser = await chromium.launch({
  executablePath:
    process.env.USERPROFILE +
    "\\AppData\\Local\\ms-playwright\\chromium-1208\\chrome-win64\\chrome.exe",
})
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } })

await page.goto("http://localhost:3000/", { waitUntil: "networkidle" })
await page.waitForTimeout(1500)

const info = await page.evaluate(() => {
  const canvases = Array.from(document.querySelectorAll("canvas"))
  return canvases.map((canvas, i) => {
    const gl = canvas.getContext("webgl2")
    const w = canvas.width
    const h = canvas.height
    const buf = new Uint8Array(4)
    let center = null
    if (gl && w && h) {
      gl.readPixels(Math.floor(w / 2), Math.floor(h / 2), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, buf)
      center = Array.from(buf)
    }
    const article = canvas.closest("article, a")
    return {
      i,
      w,
      h,
      center,
      parentTag: article ? article.tagName : null,
      parentId: article ? article.id : null,
      inHostsSection: !!canvas.closest("#podcast"),
    }
  })
})
console.log(JSON.stringify(info, null, 2))

await browser.close()
