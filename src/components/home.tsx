import { useState } from "react";
import ResultsApp from "./ResultsApp";
import EnvironmentCheck from "./EnvironmentCheck";

function Home() {
  const [showEnvCheck, setShowEnvCheck] = useState(true);

  return (
    <div className="w-screen min-h-screen bg-gray-50 py-6">
      {showEnvCheck && (
        <div className="max-w-md mx-auto mb-6">
          <EnvironmentCheck />
          <div className="flex justify-end mt-2">
            <button
              onClick={() => setShowEnvCheck(false)}
              className="text-sm text-blue-500 hover:text-blue-700"
            >
              Hide Environment Check
            </button>
          </div>
        </div>
      )}
      <ResultsApp />
    </div>
  );
}

export default Home;
