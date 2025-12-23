require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');
const google = require('googlethis');
const { GoogleGenerativeAI } = require('@google/generative-ai');


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function main() {
    console.log("  AI Processor.");

    try {
        // 1. Fetch the latest unprocessed article
        console.log(" Fetching article from Laravel.");
        const response = await axios.get(`${process.env.API_URL}/articles`);
        
        // Find one that needs processing
        const articles = response.data.data;
        const article = articles.find(a => a.is_processed == 0);

        if (!article) {
            console.log(" All articles are already processed!");
            return;
        }

        console.log(`\n Processing Article ID ${article.id}: "${article.title}"`);

        // 2. Search Google (With Fallback)
        console.log(` Searching Google for: "${article.title}"...`);
        let validLinks = [];
        
        try {
            const options = { page: 0, safe: false, parse_ads: false, additional_params: { hl: 'en' } };
            const searchResults = await google.search(article.title, options);
            validLinks = searchResults.results
                .filter(r => r.url && !r.url.includes('beyondchats.com') && !r.url.includes('youtube.com'))
                .slice(0, 2);
        } catch (searchError) {
            console.log(" Google Search error: " + searchError.message);
        }

        // If Google fails, use Wikipedia/IBM
        if (validLinks.length === 0) {
            console.log(" Search returned 0 results. Activating BACKUP DATA mode.");
            validLinks = [
                { url: 'https://en.wikipedia.org/wiki/Natural_language_processing', title: 'Backup: NLP Wikipedia' },
                { url: 'https://www.ibm.com/topics/natural-language-processing', title: 'Backup: IBM NLP' }
            ];
        }

        console.log(` Sources to use:\n 1. ${validLinks[0]?.url}\n 2. ${validLinks[1]?.url}`);

        // 3. Scrape Content
        let scrapedContext = "";
        const citations = [];

        for (const link of validLinks) {
            try {
                console.log(`⬇ Scraping: ${link.url}`);
                const pageData = await axios.get(link.url, { 
                    timeout: 8000,
                    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } 
                });
                
                const $ = cheerio.load(pageData.data);
                $('script, style, nav, footer, header, aside').remove();
                
                const text = $('p').text().replace(/\s+/g, ' ').trim().substring(0, 2000);
                if (text.length > 100) {
                    scrapedContext += `SOURCE (${link.url}):\n${text}\n\n`;
                    citations.push(link.url);
                }
            } catch (err) {
                console.log(` Skip ${link.url}: ${err.message}`);
            }
        }

        if (!scrapedContext) scrapedContext = "Artificial Intelligence is transforming industries...";

        // 4. Call Gemini AI (Updated Model Name)
        console.log(" Sending to Gemini AI for rewriting...");
        
        // *** CRITICAL UPDATE: Using the specific flash model ***
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
        Rewrite this article to be professional and insightful.
        Original Title: ${article.title}
        Original Content: ${article.content}
        New Data: ${scrapedContext}
        
        Requirements:
        - Output pure HTML (start with <p>).
        - Add a "References" section at the bottom.
        - Approx 300 words.
        `;

        const result = await model.generateContent(prompt);
        const aiResponse = result.response;
        const newContent = aiResponse.text();
        
        console.log(" AI Generated Content. Length: " + newContent.length);

        // 5. Update Database
        console.log(" Updating Database...");
        await axios.put(`${process.env.API_URL}/articles/${article.id}`, {
            generated_content: newContent,
            citations: JSON.stringify(citations),
            is_processed: true
        });

        console.log(` Success! Article ${article.id} updated.`);

    } catch (error) {
        console.error(" Error:", error.message);
    }
}

main();