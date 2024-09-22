'use client'
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import Sentiment from 'sentiment';
import { usePoints } from '@/hooks/usePoints';
import { useRouter } from 'next/navigation';
import { useQuestions } from '@/hooks/stores/useQuestions';

export const StoryTelling = ({ style = "bg-blue-500", url }: { style: string, url: string }) => {
    const { register, getValues } = useForm();
    const { submitQuizScore, points } = usePoints()
    const { current } = useQuestions()
    const [isLoading, setIsLoading] = useState(false);
    const [sentiment, setSentiment] = useState(0);
    const setiment = new Sentiment();
    const router = useRouter()
    const handleStorytellingOrChallenge = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const result = setiment.analyze(getValues('story'));
            setSentiment(Math.round(result.score <= 0 ? 0 : result.score));
            console.log(result);
            await submitQuizScore.mutateAsync({
                score: Math.round(result.score <= 0 ? 0 : result.score),
                idtype: current?.type as any,
                question: getValues('story')
            })
            router.push(`/${url}`)
        } catch (error) {
            console.log({ error });
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <div>
            <form onSubmit={handleStorytellingOrChallenge}>
                <textarea {...register('story')}
                    className="w-full p-2 border rounded"
                    rows={4}
                    placeholder="Enter your response here"
                ></textarea>
                <div className="flex justify-end">
                    <button type='submit'
                        className={`mt-2 ${style} text-white px-4 py-2 rounded`}
                    >
                        {isLoading ? "Processing..." : "Submit"}
                    </button>
                </div>
            </form>
        </div >
    )
}
