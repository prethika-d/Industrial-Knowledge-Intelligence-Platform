import { useState, useRef, useEffect } from 'react'
import { FiSend, FiCpu, FiUser, FiFileText } from 'react-icons/fi'
import api from '../services/api'

const SUGGESTIONS = [
  'What is the torque spec for the hydraulic pump housing?',
  'Summarize the last inspection report for Line 3',
  'What safety gear is required for boiler maintenance?',
]

const INITIAL_MESSAGES = [
  {
    id: 1,
    role: 'assistant',
    text: "I'm ready to answer questions using your uploaded manuals, SOPs, and reports. Ask me anything about your equipment or procedures.",
    sources: [],
  },
]

export default function AIAssistant() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isThinking])

 const send = async (text) => {
  const value = text ?? input

  if (!value.trim()) return

  setMessages((prev) => [
    ...prev,
    {
      id: Date.now(),
      role: 'user',
      text: value,
    },
  ])

  setInput('')
  setIsThinking(true)

  try {
  const res = await api.post('/assistant/query/', {
    query: value,
  })

  console.log('AI Response:', res.data)

  setMessages((prev) => [
    ...prev,
    {
      id: res.data.id || Date.now(),
      role: 'assistant',
      text: res.data.text,
      sources: res.data.sources || [],
    },
  ])
}
catch (err) {
  console.error(err)

  setMessages((prev) => [
    ...prev,
    {
      id: Date.now(),
      role: 'assistant',
      text: 'Failed to get a response from the AI service.',
      sources: [],
    },
  ])
}
finally {
  setIsThinking(false)
}
}

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] panel overflow-hidden">
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {messages.map((m) => (
          <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                m.role === 'user'
                  ? 'bg-steel-500/10 border-steel-500/25 text-steel-400'
                  : 'bg-signal-500/10 border-signal-500/25 text-signal-500'
              }`}
            >
              {m.role === 'user' ? <FiUser size={14} /> : <FiCpu size={14} />}
            </div>
            <div className={`max-w-[70%] ${m.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
              <div
                className={`rounded-xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-steel-500 text-onaccent font-medium'
                    : 'bg-ink-700 border border-ink-600 text-paper-100'
                }`}
              >
                {m.text}
              </div>
              {m.sources?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {m.sources.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1.5 text-[11px] font-mono text-paper-500 bg-ink-800 border border-ink-600 rounded-md px-2 py-1"
                    >
                      <FiFileText size={10} /> {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border bg-signal-500/10 border-signal-500/25 text-signal-500">
              <FiCpu size={14} />
            </div>
            <div className="bg-ink-700 border border-ink-600 rounded-xl px-4 py-3 flex gap-1.5 items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-paper-500 animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-paper-500 animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-paper-500 animate-bounce" />
            </div>
          </div>
        )}
      </div>

      {/* Suggestions (only show early) */}
      {messages.length <= 1 && (
        <div className="px-6 pb-3 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => send(s)}
              className="text-xs text-paper-300 bg-ink-700 hover:bg-ink-600 border border-ink-600 rounded-full px-3 py-1.5 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="border-t border-ink-600 p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            send()
          }}
          className="flex items-center gap-3 bg-ink-700 border border-ink-600 rounded-xl px-4 py-2 focus-within:border-steel-500/50 transition-colors"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about a manual, procedure, or machine..."
            className="flex-1 bg-transparent outline-none text-sm text-paper-100 placeholder:text-paper-500 py-2"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            aria-label="Send message"
            className="w-9 h-9 rounded-lg bg-signal-500 hover:bg-signal-600 disabled:opacity-40 disabled:hover:bg-signal-500 flex items-center justify-center text-onaccent transition-colors"
          >
            <FiSend size={15} />
          </button>
        </form>
      </div>
    </div>
  )
}
