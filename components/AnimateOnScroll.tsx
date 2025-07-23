import React, { useState, useEffect, useRef, ReactNode, ElementType } from 'react';

interface AnimateOnScrollProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  threshold?: number;
  animationClass?: string;
  [x:string]: any;
}

const AnimateOnScroll: React.FC<AnimateOnScrollProps> = ({
  children,
  as: Tag = 'div',
  className = '',
  delay = 0,
  threshold = 0.1,
  animationClass = 'animate-fade-in-up',
  ...rest
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<Element>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      {
        rootMargin: '0px',
        threshold,
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold]);

  return (
    <Tag
      ref={ref}
      className={`${className} ${isVisible ? animationClass : 'opacity-0'}`}
      style={{ animationDelay: `${delay}ms`, ...rest.style }}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default AnimateOnScroll;
