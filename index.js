const scrapper = require('./scrappingTools');

// Start the scrapping tool
// top-level async function used to allow await func syntax
(async () => {
    try {
        const pages_to_scrape = 5;
        const reviewData = await scrapper.getParsedReviewData(pages_to_scrape)
        const bestReviews = await scrapper.analyzeBestReviews(reviewData);
        console.log(bestReviews);
    } catch (e) {
        console.log(e);
    }
})();

