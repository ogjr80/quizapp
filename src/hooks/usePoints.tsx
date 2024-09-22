import { heritageClient } from "@/server/trpc/client";

export function usePoints() {
    const myScores = heritageClient.points.getUserScores.useQuery()
    const submitQuizScore = heritageClient.points.submitQuizScore.useMutation({
        onSuccess: () => {
            myScores.refetch()
        }
    });

    return {
        submitQuizScore,
        loading: myScores.isLoading,
        points: myScores?.data
    };
}
