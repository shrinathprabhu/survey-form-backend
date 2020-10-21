import puppeteer from 'puppeteer';
import constants from '../config/constants';

export async function capture(id) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(constants.website, {
    waitUntil: 'networkidle2',
    timeout: 60000,
  });
  await page.setViewport({ width: 1024, height: 800 });
  const path = `./tmp/${id}.jpg`;
  await page.screenshot({
    path,
    type: 'jpeg',
    fullPage: true,
  });
  await page.close();
  await browser.close();
  return path;
}

export default {
  capture,
};
