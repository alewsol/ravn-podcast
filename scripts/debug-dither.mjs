import { chromium } from "playwright"

const browser = await chromium.launch({
  executablePath:
    process.env.USERPROFILE +
    "\\AppData\\Local\\ms-playwright\\chromium-1208\\chrome-win64\\chrome.exe",
})
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } })

const logs = []
page.on("console", (msg) => logs.push(`[${msg.type()}] ${msg.text()}`))
page.on("pageerror", (err) => logs.push(`[pageerror] ${err.message}`))

await page.goto("http://localhost:3000/", { waitUntil: "networkidle" })
await page.locator("#podcast").scrollIntoViewIfNeeded()
await page.waitForTimeout(2000)

const info = await page.evaluate(() => {
  const section = document.querySelector("#podcast")
  const article = Array.from(section.querySelectorAll("article")).pop()
  const canvas = article ? article.querySelector("canvas") : null
  const shaderDiv = article ? article.querySelector('[class*="-z-10"]') : null

  let pixelSample = null
  if (canvas) {
    const gl = canvas.getContext("webgl2")
    if (gl) {
      const w = canvas.width
      const h = canvas.height
      const points = [
        [Math.floor(w / 2), Math.floor(h / 2)],
        [5, 5],
        [w - 5, 5],
        [5, h - 5],
        [w - 5, h - 5],
      ]
      pixelSample = points.map(([x, y]) => {
        const buf = new Uint8Array(4)
        gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, buf)
        return Array.from(buf)
      })
    }
  }

  const mount = shaderDiv ? shaderDiv.paperShaderMount : null
  let mountInfo = null
  if (mount) {
    mountInfo = {
      hasBeenDisposed: mount.hasBeenDisposed,
      isContextLost: mount.gl ? mount.gl.isContextLost() : null,
      glError: mount.gl ? mount.gl.getError() : null,
      program: !!mount.program,
      providedUniformKeys: Object.keys(mount.providedUniforms || {}),
      u_image: mount.providedUniforms ? String(mount.providedUniforms.u_image).slice(0, 80) : null,
      renderScale: mount.renderScale,
      parentWidth: mount.parentWidth,
      parentHeight: mount.parentHeight,
      isInViewport: mount.isInViewport,
      currentSpeed: mount.currentSpeed,
    }
  }

  return {
    articleRect: article ? article.getBoundingClientRect().toJSON() : null,
    shaderDivRect: shaderDiv ? shaderDiv.getBoundingClientRect().toJSON() : null,
    shaderDivStyle: shaderDiv ? shaderDiv.getAttribute("style") : null,
    canvasExists: !!canvas,
    canvasWidth: canvas ? canvas.width : null,
    canvasHeight: canvas ? canvas.height : null,
    canvasRect: canvas ? canvas.getBoundingClientRect().toJSON() : null,
    canvasComputedDisplay: canvas ? getComputedStyle(canvas).display : null,
    pixelSample,
    mountInfo,
  }
})

console.log(JSON.stringify(info, null, 2))
console.log("---LOGS---")
console.log(logs.join("\n"))

await page.screenshot({ path: "scripts/podcast-section.png", clip: info.articleRect ? {
  x: Math.max(0, info.articleRect.x),
  y: Math.max(0, info.articleRect.y),
  width: info.articleRect.width,
  height: info.articleRect.height,
} : undefined })

await browser.close()
