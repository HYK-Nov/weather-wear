import puppeteer = require("puppeteer");

export const scrap = async (keyword: string) => {
  try {
    const encodedKeyword = encodeURIComponent(keyword.length > 0 ? keyword : "반팔");
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto(`https://www.musinsa.com/search/goods?keyword=${encodedKeyword}&gf=A`, {
      waitUntil: "domcontentloaded",
    });
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      if (["image", "stylesheet", "font"].includes(req.resourceType())) {
        req.abort();
      } else {
        req.continue();
      }
    });
    await page.waitForSelector("[data-testid=\"virtuoso-item-list\"] img",{timeout:3000});

    const imageSrcs = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("[data-testid=\"virtuoso-item-list\"] img"))
        .slice(0, 3)
        .map((img) => img.getAttribute("src"));
    });

    await browser.close();
    return imageSrcs;
  } catch (e) {
    console.error(e);
  }
};