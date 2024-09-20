'use client';
import React, { useState, useEffect, useRef } from 'react';
import {useRouter} from "next/navigation"
export declare interface ICardProps {
    isHolo?: boolean;
    navigateTo?: string;
    backImage?: string;
    description?: string;
    children?: React.ReactNode;
    id?:any
}
export const InteractiveCard: React.FC<ICardProps> = ({ children, id, description,isHolo = false, navigateTo = '/', backImage = '/one.webp' }) => {
  const [transformStyle, setTransformStyle] = useState({});
  const [glareStyle, setGlareStyle] = useState({});
  const [isFocused, setIsFocused] = useState(false);
  const [animateFlip, setAnimateFlip] = useState(false);
  const cardRef: any = useRef(null);
  const [isView,setIsView]=useState(false)
  const clickSoundRef = useRef(new Audio('/sounds/click.mp3'));
  const flipSoundRef = useRef(new Audio('/sounds/flip.mp3'));
const route = useRouter()
  const handleMouseMove = (e: React.MouseEvent) => {
    // if (isFocused) return;
    setIsView(true)
    const cardRect = cardRef.current.getBoundingClientRect();
    const cardWidth = cardRect.width;
    const cardHeight = cardRect.height;
    const mouseX = e.clientX - cardRect.left;
    const mouseY = e.clientY - cardRect.top;

    const rotateX = ((mouseY - cardHeight / 2) / cardHeight) * (isHolo ? 15 : 0);
    const rotateY = ((mouseX - cardWidth / 2) / cardWidth) * (isHolo ? -15 : 0);

    setTransformStyle({
      transform: `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
    });

    setGlareStyle({
      background: `radial-gradient(circle at ${mouseX}px ${mouseY}px, rgba(255,255,255,${
        isHolo ? 0.4 : 0.2
      }), transparent)`,
    });
  };

  const handleMouseLeave = () => {
    if (isFocused) return;
    setTransformStyle({});
    setIsView(false)

    setGlareStyle({});
  };

  const handleClick = () => {
    clickSoundRef.current.play();
    setAnimateFlip(true);
    setIsFocused((prevState) => !prevState);
    setIsView(true)
    // Play flip sound after a short delay
    setTimeout(() => {
      flipSoundRef.current.play();
    }, 150);
  };

  const handleDoubleClick = (e:any) => {
    if (isFocused) {
      clickSoundRef.current.play();
      route.push(`/quiz/${e.target.id}`)
    }
  };

  useEffect(() => {
    if (animateFlip) {
      const timer = setTimeout(() => {
        setAnimateFlip(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [animateFlip]);

  // Preload sounds
  useEffect(() => {
    clickSoundRef.current.load();
    flipSoundRef.current.load();
  }, []);

  return (
    <div
      ref={cardRef} 
      className={`interactive-card ${isHolo ? 'holo' : ''} ${isFocused ? 'focused' : ''} ${
        animateFlip ? 'animate-flip' : ''
      }`}
      style={transformStyle}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onDoubleClick={
        handleDoubleClick
      }
    >
      <div className="interactive-card-inner">
        <div className="interactive-card-front">
          <div className="glare" style={glareStyle}></div>
          <div className="content">{children}</div>
        </div>
        <div className="interactive-card-back">
          {backImage && <img src={backImage} className='w-full h-full object-fit' alt="Card Back" />}
        </div>
      </div>
      {isView && <button className='z-1 fixed bottom-10 bg-green-500 px-4 py-1.5 text-white rounded-full'
      onClick={handleClick}
      
      >Instructions</button>}
    </div>
  );
};

export default InteractiveCard;