import type { Review } from "../generated/prisma";
import { reviewsRepository } from "../repositories/review.repository";
import { hfClient, llmClient, ollaClient } from "../llm/client";
import template from "../prompts/summarizer-reviews.txt";




export const reviewService = {
    async reviewSummarize(productId: number): Promise<String> {
        const history: any[] = [];
        const reviews =  await reviewsRepository.getReviews(productId, 5);
        const joinedReviews = reviews.map(r => r.content).join("\n\n"); 
        const prompt = template.replace("{{joinedReviews}}", joinedReviews);

         history.push({
            role: "user",
            prompt: prompt
        });

        const existingSummary = await reviewsRepository.getReviewSummary(productId)

        if(existingSummary){
            console.log("From DB...")
            return existingSummary || ""
        } else {
            console.log("From Agent...")
            // const summary = await llmClient.generateCompletion({
            //     prompt: [
            //         ...history.map(h => (typeof h === "string" ? h : h.parts?.[0]?.text || "")),
            //         prompt
            //     ].join("\n")
            // });

            const summary = await ollaClient.ollaReference(prompt) ?? ""

            //const summary = await hfClient.summarization(joinedReviews)
            console.log(summary)
            await reviewsRepository.storeReviewSummary(productId, summary)
            return summary
        }

       

        // return llmClient.generateCompletion({
        //     prompt: [
        //         ...history.map(h => (typeof h === "string" ? h : h.parts?.[0]?.text || "")),
        //         prompt
        //     ].join("\n")
        // });
    }
}

