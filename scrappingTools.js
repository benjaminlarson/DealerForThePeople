const cheerio = require('cheerio');
const axios = require('axios');

async function getParsedReviews(url) {
    let response;
    try {
        response = await axios.get(url);
    } catch (e) {
        throw new Error(`get request failed for url: ${url}`);
    }
    if (!response){
        throw new Error(`axios response undefined`);
    }
    const cheerioAPI = cheerio.load(response.data)
    const review = [];
    // iterate through each review select the elements with rating information
    cheerioAPI('.review-wrapper').each(function () {
        // rating/stars, text, and username should be returned for analysis
        const star_count = cheerioAPI(this).find('.rating-static-indv');
        const review_text = cheerioAPI(this).find('.review-content');
        // selector for username needs to be parsed to fist username in review element
        let user = cheerioAPI(this).find('.notranslate').text().split("  ")[0];

        const rating = {};
        // can't iterate on star_count rating, use hard coded values for now
        if (star_count && user && review_text) {
            // clean up username
            user = user.replace('-', "");
            user = user.replace('\n', "").trim();
            rating['username'] = user;
            // get the rating/stars from classnames, assuming they are the only int in the classname
            rating['customer_service'] = star_count[0].attribs.class.match(/\d+/g)[0];
            rating['quality_of_work'] = star_count[1].attribs.class.match(/\d+/g)[0];
            rating['friendliness'] = star_count[2].attribs.class.match(/\d+/g)[0];
            rating['pricing'] = star_count[3].attribs.class.match(/\d+/g)[0];
            rating['overall_experience'] = star_count[4].attribs.class.match(/\d+/g)[0];
            rating['review_text'] = review_text.text();
            review.push(rating);
        } else {
            throw new Error("Expected keywords rating-static-indv, review-content, and notranslate in html class");
        }
    })
    if (review.length === 0) {
        throw new Error("Expected keyword 'review-wrapper' within html class");
    }
    return review
}

//
async function getParsedReviewData(pages_to_scrape) {
    let rating_data = [];
    pages_to_scrape = pages_to_scrape > 0 ? pages_to_scrape : 1;
    for (let i = 1; i <= pages_to_scrape; i++) {
        const url = `https://www.dealerrater.com/dealer/McKaig-Chevrolet-Buick-A-Dealer-For` +
            `-The-People-dealer-reviews-23685/page${i}`;
        const parsedReview = await getParsedReviews(url);
        rating_data = rating_data.concat(parsedReview);
    }
    return rating_data;
}

// Given review data find the most suspiciously high reviews
async function analyzeBestReviews(reviews = []){
    const perfect_score = [];
    // get reviews that have a perfect score
    for (let i = 0; i < reviews.length; i++) {
        let review = reviews[i];
        let total_score = parseInt(review['customer_service']) +
            parseInt(review['quality_of_work']) +
            parseInt(review['friendliness']) +
            parseInt(review['pricing']) +
            parseInt(review['overall_experience']);
        if (total_score === 250) {
            perfect_score.push(review);
        }
    }
    // sort by shortest review (low effort)
    const byReviewText = perfect_score.slice(0);
    byReviewText.sort((a,b)=>{
       return a.review_text.length - b.review_text.length
    });
    if (byReviewText.length < 3){
        console.log("Not enough reviews fit analysis criteria, returning all reviews");
        return byReviewText
    }
    // return top 3 reviews
    return [byReviewText[0], byReviewText[1], byReviewText[2]];
}

//export functions to use in testing
module.exports = {
    getParsedReviews,
    getParsedReviewData,
    analyzeBestReviews
}
