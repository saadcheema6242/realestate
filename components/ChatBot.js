import { useState } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'
import { chatbotAPI } from '../utils/api'

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hi! I'm your real estate assistant. How can I help you find your dream property today?",
            sender: 'bot',
            timestamp: new Date()
        }
    ])
    const [inputMessage, setInputMessage] = useState('')
    const [isTyping, setIsTyping] = useState(false)

    const sendMessage = async (e) => {
        e.preventDefault()
        if (!inputMessage.trim()) return

        const userMessage = {
            id: Date.now(),
            text: inputMessage,
            sender: 'user',
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        setInputMessage('')
        setIsTyping(true)

        try {
            const response = await chatbotAPI.sendMessage(inputMessage, { messages })

            const botMessage = {
                id: Date.now() + 1,
                text: response.data.response,
                sender: 'bot',
                timestamp: new Date()
            }

            setMessages(prev => [...prev, botMessage])
        } catch (error) {
            console.error('Chatbot error:', error)
            const errorMessage = {
                id: Date.now() + 1,
                text: "Sorry, I'm having trouble responding right now. Please try again later.",
                sender: 'bot',
                timestamp: new Date()
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setIsTyping(false)
        }
    }

    return (
        <>
            {/* Chat Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
                >
                    <MessageCircle className="h-6 w-6" />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col z-50">
                    {/* Header */}
                    <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <MessageCircle className="h-5 w-5" />
                            <span className="font-semibold">Real Estate Assistant</span>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:text-gray-200"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-xs px-3 py-2 rounded-lg text-sm ${message.sender === 'user'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-800'
                                        }`}
                                >
                                    {message.text}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 text-gray-800 px-3 py-2 rounded-lg text-sm">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                disabled={isTyping}
                            />
                            <button
                                type="submit"
                                disabled={isTyping || !inputMessage.trim()}
                                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send className="h-4 w-4" />
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    )
}