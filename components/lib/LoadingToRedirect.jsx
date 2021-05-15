import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const LoadingToRedirect = () => {
  const [count, setCount] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((currentCount) => --currentCount);
    }, 1000);
    // redirect once count is equal to 0
    count === 0 && router.push('/login');
    // cleanup
    return () => clearInterval(interval);
  }, [count]);

  return (
    <div className="container p-5 text-center">
      <p>Redirecting you in {count} seconds</p>
    </div>
  );
};

export default LoadingToRedirect;
