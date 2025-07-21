import React from "react";
import "./App.css";

// This is a placeholder App component that will be expanded in future tasks
function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-gray-900">Habit Tracker</h1>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-900">
          Welcome to Habit Tracker
        </h2>
        <p className="mt-4 text-gray-600">
          This is a placeholder for the Habit Tracker application. The full
          implementation will include dashboard, habits management, and
          analytics features.
        </p>
      </main>
    </div>
  );
}

export default App;
