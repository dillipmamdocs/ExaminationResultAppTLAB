import { useEffect, useState } from "react";

export default function EnvironmentCheck() {
  const [envStatus, setEnvStatus] = useState({
    supabaseUrl: false,
    supabaseKey: false,
  });

  useEffect(() => {
    // Check if environment variables are set
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    setEnvStatus({
      supabaseUrl: !!supabaseUrl,
      supabaseKey: !!supabaseKey,
    });
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 max-w-md mx-auto">
      <h2 className="text-lg font-medium mb-4">Environment Variables Check</h2>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">VITE_SUPABASE_URL</span>
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${envStatus.supabaseUrl ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
          >
            {envStatus.supabaseUrl ? "Configured" : "Missing"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-600">VITE_SUPABASE_ANON_KEY</span>
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${envStatus.supabaseKey ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
          >
            {envStatus.supabaseKey ? "Configured" : "Missing"}
          </span>
        </div>
      </div>

      {(!envStatus.supabaseUrl || !envStatus.supabaseKey) && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-100 rounded text-sm text-yellow-800">
          <p>
            Some environment variables are missing. Please check your
            configuration.
          </p>
        </div>
      )}

      {envStatus.supabaseUrl && envStatus.supabaseKey && (
        <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded text-sm text-green-800">
          <p>All required environment variables are configured correctly.</p>
        </div>
      )}
    </div>
  );
}
