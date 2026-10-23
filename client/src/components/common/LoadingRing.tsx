import React from 'react';

interface LoadingRingProps {
  size: 'xs' | 'sm' | 'md' | 'lg';
}

const LoadingRing: React.FC<LoadingRingProps> = ({ size }) => {
  return (
        <div className='min-h-[10rem] flex flex-col items-center w-full place-content-center justify-center gap-2 my-10'
        >
              <img src='/logo.png'
                    className='rounded-xl shadow-lg p-0.5 bg-white  w-[8rem] h-full opacity-60 object-contain'
              />
              <span className={`loading loading-spinner hidden loading-${size} p-10`}></span>
              <progress className="progress border p-2 progress-warning opacity-40 w-[8rem]"></progress>
              <span className='font-bold tracking-wide text-secondary'>Subiri Kidogo ...</span>
        </div>
  );
};

export default LoadingRing;