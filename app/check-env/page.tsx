import ApiKeyChecker from "@/components/api-key-checker"

export default function CheckEnvironmentPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Environment Variables Check</h1>
        <p className="mb-6 text-slate-600 dark:text-slate-400">
          This page verifies that your Groq API key is properly set in the environment variables. This is necessary for
          the blueprint generator to work correctly.
        </p>

        <ApiKeyChecker />

        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
          <h2 className="text-xl font-semibold mb-2">How to set the Groq API key</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              Go to{" "}
              <a
                href="https://console.groq.com/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Groq Console
              </a>{" "}
              to get your API key
            </li>
            <li>In your Vercel project, go to Settings &gt; Environment Variables</li>
            <li>
              Add a new environment variable with the name{" "}
              <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">GROQ_API_KEY</code>
            </li>
            <li>Paste your API key as the value</li>
            <li>Save the environment variable</li>
            <li>Redeploy your application or restart your development server</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
