const scrapper = require('./scrappingTools');
const axios = require('axios');
jest.mock('axios');

test('getParsedReviewsCatchesUrlError', async ()=>{
   axios.get.mockResolvedValueOnce();
   await expect(()=> scrapper.getParsedReviews('badurl')).rejects.toThrowError('axios response undefined');
});
test('unfamiliar page, class keywords missing', async ()=>{
   let url = `https://www.dealerrater.com/reviews/`;
   const axios_result = {data:'empty'};
   axios.get.mockResolvedValueOnce(axios_result);
   await expect(()=> scrapper.getParsedReviews(url)).rejects.toThrowError('Expected keyword \'review-wrapper\' within html class');
});

test('getParsedReviewData builds results as expected (concat arrays for pages_scraped times)', async()=>{
    scrapper.getParsedReviews = jest.fn().mockReturnValue([{"rating": "good"}]);
    const expected_result = [{"rating": "good"}, {"rating": "good"}, {"rating": "good"}]
    await expect(()=>scrapper.getParsedReviewData(3).toBe(expected_result))
});

test('analyzeBestReviews not passed in enough values', async () => {
   const only_review = [{
      username: 'OnlyMe',
      customer_service: '50',
      quality_of_work: '50',
      friendliness: '50',
      pricing: '50',
      overall_experience: '50',
      review_text:
          'I am not a robot.'
   }]
   const result = await scrapper.analyzeBestReviews(only_review);
   expect(result).toEqual(only_review);
})