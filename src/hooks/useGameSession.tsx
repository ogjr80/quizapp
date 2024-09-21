import { heritageClient } from '@/server/trpc/client'

export const useGameSession = () => {
    const getSession = heritageClient.gameSession.getIndividualGameSession.useQuery()
    const teamession = heritageClient.gameSession.getTeamlGameSession.useQuery()
    const startGameSession = heritageClient.gameSession.saveGameSession.useMutation(
        {
            onSuccess: () => {
                getSession.refetch()
            }
        }
    )
    return {
        startGameSession,
        session: getSession?.data ?? teamession?.data,
        loading: getSession.isLoading ?? teamession.isLoading

    }
}
