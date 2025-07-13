import { useEffect, useState } from 'react';

export default function Home() {
  const [backendMessage, setBackendMessage] = useState('Loading...');

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/`)
      .then((res) => res.text())
      .then((data) => setBackendMessage(data))
      .catch((err) => setBackendMessage('Error: ' + err.message));
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 space-y-4">
      <h1 className="text-4xl font-bold text-blue-600">
        Tailwind is working!Running!
      </h1>
      <p className="text-lg text-gray-700">
        Backend says: <span className="font-semibold">{backendMessage}</span>
      </p>
    </div>
  );
}
