import assert from "node:assert/strict"
import { test } from "node:test"

import sitemap from "../app/sitemap"
import { articleSections } from "../lib/article-sections"
import { getAllArticles, getArticleBySlug, getArticlesByCategory, getArticleCards, isSubscriberArticle, type ArticleCategory } from "../lib/articles"
import { getSiteUrl } from "../lib/site"

test("each editorial section contains ten complete, uniquely addressable stories", () => {
  const articles = getAllArticles()
  assert.equal(articles.length, 30)
  assert.equal(new Set(articles.map((article) => article.id)).size, 30)
  assert.equal(new Set(articles.map((article) => article.slug)).size, 30)

  for (const category of Object.keys(articleSections) as ArticleCategory[]) {
    const stories = getArticlesByCategory(category)
    assert.equal(stories.length, 10, category)
    assert.ok(stories.every((article) => article.series === articleSections[category].title))
    assert.deepEqual(stories.map((article) => article.publishedAt),
      stories.map((article) => article.publishedAt).sort().reverse())

    for (const article of stories) {
      assert.equal(getArticleBySlug(article.slug), article)
      assert.match(article.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      assert.ok(article.markdown.startsWith(`# ${article.title}\n`))
      assert.ok(article.markdown.split(/\s+/).length >= 200, article.slug)
    }
  }
  assert.equal(getArticleBySlug("missing-story"), undefined)
})

test("new founder and company stories provide public research sources", () => {
  const profiles = getAllArticles().filter((article) =>
    article.publishedAt === "2026-10-16" && article.category !== "hot-takes")
  assert.equal(profiles.length, 14)
  for (const article of profiles) {
    assert.ok(article.sources?.length, article.slug)
    for (const source of article.sources) {
      assert.ok(source.title.trim())
      assert.equal(new URL(source.url).protocol, "https:")
    }
  }
})

test("stories 1–4 are open and 5–10 require subscription in every section", () => {
  for (const category of Object.keys(articleSections) as ArticleCategory[]) {
    const stories = getArticlesByCategory(category)
    const cards = getArticleCards(category)
    assert.equal(cards.filter((card) => !card.subscriberOnly).length, 4)
    assert.equal(cards.filter((card) => card.subscriberOnly).length, 6)
    for (const [index, story] of stories.entries()) {
      assert.equal(isSubscriberArticle(story), index >= 4)
      assert.equal(cards[index].subscriberOnly, index >= 4)
      assert.equal(cards[index].slug, story.slug)
      assert.equal("markdown" in cards[index], false)
      assert.equal("sources" in cards[index], false)
    }
  }
})

test("sitemap exposes every section and every story without duplicate URLs", () => {
  const urls = sitemap().map((entry) => entry.url)
  assert.equal(new Set(urls).size, urls.length)
  for (const category of Object.keys(articleSections)) {
    assert.ok(urls.includes(`${getSiteUrl()}/${category}`))
  }
  for (const article of getAllArticles()) {
    assert.ok(urls.includes(`${getSiteUrl()}/articles/${article.slug}`))
  }
})
