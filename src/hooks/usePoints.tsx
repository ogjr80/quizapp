import { heritageClient } from "@/server/trpc/client";

export function usePoints() {
    const submitQuizScore = heritageClient.points.submitQuizScore.useMutation();
    return {
        submitQuizScore
    };
}
