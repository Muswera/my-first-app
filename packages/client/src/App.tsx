import ReviewList from './components/reviews/ReviewList';

// connecting frontend to the backend
function App() {
   return (
      <div className="p-4 h-screen w-full">
         <ReviewList productId={1} />
      </div>
   );
}

export default App;
