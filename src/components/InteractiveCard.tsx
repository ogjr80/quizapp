'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import useSound from 'use-sound';
import { Quiz } from '../types';

export const InteractiveCards: React.FC<Quiz> = ({ id, title, description, frontImage, backImage }) => {
  const router = useRouter();
  const [playClick] = useSound('/sounds/click.mp3');
  const [playFlip] = useSound('/sounds/flip.mp3');

  const [isFront, setIsFront] = React.useState(true);
  const [scale, setScale] = React.useState(1);
  const [flipCount, setFlipCount] = React.useState(0);

  const handleClick = () => {
    playClick();
    setIsFront(!isFront);
    setScale(1.2);
    setFlipCount(flipCount + 1);
    setTimeout(() => {
      setScale(1);
    }, 500);
  };

  const handleDoubleClick = () => {
    playFlip();
    router.push(`/quiz/${id}`);
  };

  return (
    <div
      className="perspective-1000 h-80 w-64 cursor-pointer"
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <div
        className={`relative w-full h-full text-center transition-transform duration-600 transform-style-3d ${
          isFront ? '' : 'rotate-y-180'
        }`}
        style={{ transform: `scale(${scale})` }}
      >
        <div
          className={`absolute w-full h-full flex flex-col justify-center items-center rounded-lg shadow-lg bg-white backface-hidden ${
            isFront ? '' : 'hidden'
          }`}
        >
          <img
            src={frontImage}
            alt="Card Front"
            className="w-full h-full object-cover rounded-lg hover:shadow-2xl hover:scale-110 transition-all duration-300"
          />
        </div>
        <div
          className={`absolute w-full h-full flex justify-center items-center rounded-lg shadow-lg bg-gray-200 backface-hidden rotate-y-180 ${
            isFront ? 'hidden' : ''
          }`}
        >
          <p className="text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default InteractiveCards;
