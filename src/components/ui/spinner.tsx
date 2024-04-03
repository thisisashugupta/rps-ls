import React from 'react';

type SpinnerProps = {
  className?: string;
};

const Spinner = ({className}: SpinnerProps) => {
  return (
    <div className="flex justify-center items-center">
      <div className={`${className} w-16 h-16 border-t-4 border-b-4 border-purple-600 rounded-full animate-spin`} />
    </div>
  );
};

export default Spinner;
