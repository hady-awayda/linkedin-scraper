const puppeteer = require("puppeteer-core");
const fs = require("fs");

(async () => {
  const searchQuery = "MLOps";
  const browser = await puppeteer.launch({
    headless: false,
    executablePath:
      "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  });
  const page = await browser.newPage();
  await page.goto(
    `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(
      searchQuery
    )}`,
    { waitUntil: "networkidle2" }
  );
  await page.setViewport({ width: 1200, height: 1024 });

  const jobData = await page.evaluate(() => {
    const jobs = [];
    const jobElements = document.getElementsByClassName(
      "jobs-search__results-list"
    );

    // Job Title
    // Company Name
    // Job Location
    // Job Description
    // Job Post Date
    // Skills Needed
    // Application Link
    Array.from(jobElements[0].children).forEach((jobElement, index) => {
      const child = jobElement.children[0];
      // console.log(child);
      const jobCard = child.querySelector(".base-card__full-link");
      const jobLink = jobCard?.href;

      const jobLogo = child.querySelector(".artdeco-entity-image");
      const imageURL = index > 5 ? jobLogo.dataset.delayedUrl : jobLogo.src;
      const jobTitle = child.querySelector(
        ".base-search-card__title"
      ).innerText;
      const jobCompany = child.querySelector(
        ".base-search-card__subtitle"
      ).innerText;
      const jobLocation = child.querySelector(
        ".job-search-card__location"
      ).innerText;
      const jobDate =
        child.querySelector(".job-search-card__listdate") ??
        child.querySelector(".job-search-card__listdate--new");

      // jobs.push({
      //   jobTitle,
      //   companyName,
      //   jobLocation,
      //   jobDescription,
      //   jobPostDate,
      //   applicationLink,
      // });
    });

    return jobs;
  });

  // fs.writeFileSync("jobs.json", JSON.stringify(jobData, null, 2), "utf-8");

  // await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
