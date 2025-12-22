import { useEffect, useState } from 'react';
// import { Button } from './components/ui/button';
// import ChatBot from './components/chat/ChatBot';
import ReviewList from './components/reviews/reviewList';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/hello')
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message);
      });
  }, []);

  return (
    // <div className="p-4 h-screen w-2xl flex flex-col bg-blue-200">
    //   <ChatBot />

    // </div>
    <div>
      <ReviewList productId={3} />
    </div>
  );
}

export default App;
