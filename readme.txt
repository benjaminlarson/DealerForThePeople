Coding Challenge: “A Dealer For the People”
Author: Benjamin Larson
Email: benjmnlarson@gmail.com

Intro
This program returns 3 of the most suspiciously positive reviews from "dealerrater.com" specifically from Mckaig
Chevrolet Buick. Most of the code is hardcoded to search specific classes in sites html. Each class searched had data
relevant to the overly positive analysis.

Criteria for the 3 selected reviews:
- If the rating was 5/5 stars, highest reviews only should be considered overly positive.
- The reviews with shortest test, indicating a possible low effort for review.


Future work
-Make the review scrapper more generalized. Maybe there are other dealers we are interested in. They should be inputs to
the function along with the number of pages to scrape data from. Make the class name selector more robust?
- Depending on if the site generates usernames or you create your own, might be possible that numbers in username
indicate fake users.
- Analyze words in reviews. Review text that has lots of matching words, lots of copy paste, indicating fake reviews.
- Stronger testing on the actual web scrapping code. This is my first web scrapper I've built. I'm not sure hardcoding
the selectors is the best approach.


Sites used to help implement my scrapper:
https://stackoverflow.com/questions/10805125/how-to-remove-all-line-breaks-from-a-string
https://hackernoon.com/cheerio-node-nodejs-tutorial-web-html-scraping-note-a4ceb37d9cbb
https://data-lessons.github.io/library-webscraping-DEPRECATED/02-csssel/
Jest documentation
Axios documentation

Instructions to run:
1) npm install
2) run "npm run start"

Instructions to test:
1) npm install --save-dev jest
2) npm run test
