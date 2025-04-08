"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrap = void 0;
const puppeteer = require("puppeteer");
const scrap = (keyword) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const encodedKeyword = encodeURIComponent(keyword.length > 0 ? keyword : "반팔");
        const browser = yield puppeteer.launch({
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });
        const page = yield browser.newPage();
        yield page.goto(`https://www.musinsa.com/search/goods?keyword=${encodedKeyword}&gf=A`, {
            waitUntil: "domcontentloaded",
        });
        yield page.setRequestInterception(true);
        page.on("request", (req) => {
            if (["image", "stylesheet", "font"].includes(req.resourceType())) {
                req.abort();
            }
            else {
                req.continue();
            }
        });
        yield page.waitForSelector("[data-testid=\"virtuoso-item-list\"] img", { timeout: 3000 });
        const imageSrcs = yield page.evaluate(() => {
            return Array.from(document.querySelectorAll("[data-testid=\"virtuoso-item-list\"] img"))
                .slice(0, 3)
                .map((img) => img.getAttribute("src"));
        });
        yield browser.close();
        return imageSrcs;
    }
    catch (e) {
        console.error(e);
    }
});
exports.scrap = scrap;
