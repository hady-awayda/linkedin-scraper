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
  await page.setViewport({ width: 1200, height: 736 });

  const jobData = await page.evaluate(() => {
    const jobs = [];
    const jobElements = document.getElementsByClassName(
      "jobs-search__results-list"
    );

    Array.from(jobElements[0].children).forEach((jobElement, index) => {
      const child = jobElement.children[0];
      const jobCard = child.querySelector(".base-card__full-link");

      // Application Link
      const jobLink = jobCard?.href;

      // Job ID

      // Company Logo
      const jobLogo = child.querySelector(".artdeco-entity-image");
      const imageURL = index > 5 ? jobLogo.dataset.delayedUrl : jobLogo.src;

      // Job Title
      const jobTitle = child.querySelector(
        ".base-search-card__title"
      ).innerText;

      // Company Name
      const jobCompany = child.querySelector(
        ".base-search-card__subtitle"
      ).innerText;

      // Job Location
      const jobLocation = child.querySelector(
        ".job-search-card__location"
      ).innerText;

      // Job Date
      const jobDate =
        child.querySelector(".job-search-card__listdate") ??
        child.querySelector(".job-search-card__listdate--new");

      console.log(jobDate);

      jobs.push({
        jobLink,
        imageURL,
        jobTitle,
        jobCompany,
        jobLocation,
        jobDate: jobDate.innerText,
      });
    });

    return jobs;
  });

  fs.writeFileSync("jobs.json", JSON.stringify(jobData, null, 2), "utf-8");

  // await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});

// Job ID
// Job Title (Done)
// Company Name (Done)
// Job Location (Done)
// Job Description
// Job Post Date (Done)
// Skills Needed
// Application Link (Done)
// Company Logo (Done)
