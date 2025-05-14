import { CheckCircle, Circle } from "lucide-react"

interface ThinkingProcessProps {
  steps: string[]
  isComplete: boolean
}

export default function ThinkingProcess({ steps, isComplete }: ThinkingProcessProps) {
  return (
    <div className="space-y-4 mb-6">
      {steps.map((step, index) => (
        <div
          key={index}
          className="flex items-center p-2 rounded-lg transition-all hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <div className="mr-3">
            {index < steps.length - 1 || isComplete ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <Circle className="h-5 w-5 text-blue-500 animate-pulse" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{step}</p>
          </div>
        </div>
      ))}

      {steps.length > 0 && !isComplete && (
        <div className="flex items-center mt-4">
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-1 animate-pulse"
              style={{ width: `${(steps.length / 7) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  )
}
