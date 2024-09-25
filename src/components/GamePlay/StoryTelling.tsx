'use client'
import { useForm } from 'react-hook-form';
import { useState, useRef, useEffect } from 'react';
import { usePoints } from '@/hooks/usePoints';
import { useRouter } from 'next/navigation';
import { useQuestions } from '@/hooks/stores/useQuestions';
import { CheckCheck } from 'lucide-react';
import { FaXing } from 'react-icons/fa';
import JSConfetti from 'js-confetti';

export const StoryTelling = ({ style = "bg-blue-500", url }: { style: string, url: string }) => {
    useForm();
    const { submitQuizScore } = usePoints()
    const { current } = useQuestions()
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter()
    const jsConfetti = useRef<JSConfetti | null>(null);
    const correctSound = useRef<HTMLAudioElement | null>(null);
    const incorrectSound = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        jsConfetti.current = new JSConfetti()
        correctSound.current = new Audio('/sounds/correct.wav');
        incorrectSound.current = new Audio('/sounds/fail.wav');
    }, [])

    const handleStorytellingOrChallenge = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const challenge = e.currentTarget.id
            console.log({ challenge, r: e.currentTarget.value });

            if (challenge === 'yes') {
                // Play yes sound
                if (correctSound.current) {
                    correctSound.current.play().catch(e => console.error("Error playing sound:", e));
                }
                // Show confetti
                jsConfetti.current?.addConfetti({
                    emojis: ['🎉', '🥳', '✨', '🚀', '🎊'],
                    emojiSize: 50,
                    confettiNumber: 150,
                });
                // Wait for confetti animation and sound to complete
                await new Promise(resolve => setTimeout(resolve, 1000));
            } else {
                // Play no sound
                if (incorrectSound.current) {
                    incorrectSound.current.play().catch(e => console.error("Error playing sound:", e));
                }
                // Wait for sound to complete
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            await submitQuizScore.mutateAsync({
                score: challenge === 'yes' ? 1 : 0,
                idtype: current?.type as any,
                question: current?.question as any
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
            <div>
                <div className="">
                    <h3 className="mb-5 text-lg font-medium text-gray-900 dark:text-white">Did you perform the task?</h3>
                    <ul className="grid w-full gap-6 md:grid-cols-2">
                        <li>
                            <button id="yes" onClick={handleStorytellingOrChallenge} type="button" name="challenge" className=""  >
                                <label htmlFor="hosting-big" className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                                    <div className="block">
                                        <div className="w-full text-lg font-semibold">Yes I did</div>
                                    </div>
                                    <CheckCheck className="w-5 h-5 ms-3 rtl:rotate-180" />

                                </label>
                            </button>
                        </li>
                        <li>
                            <button id="no" onClick={handleStorytellingOrChallenge} type="button" name="challenge" value="no" className=""  >
                                <label htmlFor="hosting-big" className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                                    <div className="block">
                                        <div className="w-full text-lg font-semibold">I did not</div>
                                    </div>
                                    <FaXing className="w-5 h-5 ms-3 rtl:rotate-180" />

                                </label>
                            </button>

                        </li>
                    </ul>

                </div>
            </div>
        </div >
    )
}
