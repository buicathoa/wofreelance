const puppeteer = require("puppeteer");
const db = require("./models");
const Countries = db.countries
const Universities = db.universities
const mysql = require("mysql2");

const dbConnection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

// (async () => {
//   const browser = await puppeteer.launch({
//     headless: false,
//     args: ["--window-size=1200,1080"],
//   });
//   const page = await browser.newPage();
//   await page.goto("https://www.freelancer.com/login", {
//     waitUntil: "networkidle0",
//   });

//   await page.waitForSelector("#emailOrUsernameInput", {
//     visible: true,
//   });
//   await page.waitForSelector("#passwordInput", {
//     visible: true,
//   });

//   await page.type("#emailOrUsernameInput", "woffreelance@gmail.com");
//   await page.type("#passwordInput", "BINho1203");

//   await page.waitForSelector('button[aria-live="assertive"]', {
//     visible: true,
//   });

//   // await delay(4000)

//   await page.evaluate(() => {
//     const button = document.querySelectorAll(
//       'button[aria-live="assertive"]'
//     )[2];
//     button.click();
//   });

//   await delay(4000);

//   await page.goto("https://www.freelancer.com/u/lekimhoang1018");

//   await delay(4000);

//   await page.evaluate(() => {
//     let universityOptions = [];
//     const button = document
//       .querySelectorAll(".CardHeaderRight")[3]
//       .querySelector(".ButtonElement");
//     button.click();

//     const listOptions = document
//       .querySelector(".InputContainer")
//       .querySelector("select");

//     console.log("innerText", listOptions);
//     for (let i = 1; i < listOptions.leghth; i++) {
//       if ((i = 1)) {
//         listOptions[i].addEventListener("click", function () {
//           universityOptions = document
//             .querySelectorAll(".InputContainer")[1]
//             .querySelector("select").options;
//         });
//       }
//     }
//     console.log("universityOptions", universityOptions);
//   });
// })();

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--window-size=1200,1080"],
  });
  const page = await browser.newPage();
  await page.goto("https://github.com/endSly/world-universities-csv/blob/master/world-universities.csv", {
    waitUntil: "networkidle0",
  });
  await delay(2000)
  await page.waitForSelector('.highlight')
  let indexCountry = 0;

  const listRecords = await page.evaluate(async() => {
    const listLiElements = document.querySelector('.highlight').querySelectorAll('tr')
    for(let i = 0 ; i < listLiElements.length; i ++){
      let listCountries = []
      if(i === 0) {
        console.log('clgt', listLiElements[i].querySelectorAll('td')[1].innerText.split(',')[1])
      }
      // const countryFound = await Countries.findOne({
      //   where: {
      //     country_name: listLiElements[i].querySelectorAll('td')[1].innerText.split(',')[1]
           
      //   }
      // })

      // listLiElements[i].addEventListener('click', function() {
      //   await delay(3000)
      // })

      // await delay(2000)

      // if(countryFound) {
      //   await Universities.create({
      //     university_name: 
      //   })
      // }
      // listLiElements[i].addEventListener('click', function () {

      // })
    }
  })
})();
