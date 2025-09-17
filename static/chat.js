class ChatInterface {
  constructor() {
    this.chatBox = document.getElementById("chat-box")
    this.chatForm = document.getElementById("chat-form")
    this.userInput = document.getElementById("user-input")
    this.typingIndicator = document.getElementById("typing-indicator")
    this.newChatBtn = document.getElementById("new-chat-btn")

    this.isTyping = false
    this.messageCount = 0

    this.init()
  }

  init() {
    this.bindEvents()
    this.userInput.focus()
    this.setupQuickActions()
  }

  bindEvents() {
    // Form submission
    this.chatForm.addEventListener("submit", (e) => this.handleSubmit(e))

    // New chat button
    this.newChatBtn.addEventListener("click", () => this.startNewChat())

    // Enter key handling
    this.userInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        this.chatForm.dispatchEvent(new Event("submit"))
      }
    })

    // Auto-resize input
    this.userInput.addEventListener("input", () => this.autoResizeInput())

    // Clear chat action
    const clearBtn = document.querySelector('.action-btn[title="Clear Chat"]')
    if (clearBtn) {
      clearBtn.addEventListener("click", () => this.clearChat())
    }
  }

  setupQuickActions() {
    const quickBtns = document.querySelectorAll(".quick-btn")
    quickBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const message = btn.getAttribute("data-message")
        this.sendMessage(message)
      })
    })
  }

  async handleSubmit(e) {
    e.preventDefault()
    const text = this.userInput.value.trim()
    if (!text || this.isTyping) return

    this.sendMessage(text)
  }


  async sendMessage(text) {
    // Add user message
    this.appendMessage("user", text)
    this.userInput.value = ""
    this.userInput.focus()

    // Hide welcome message if it exists
    const welcomeMsg = document.querySelector(".welcome-message")
    if (welcomeMsg) {
      welcomeMsg.style.display = "none"
    }

    // Show typing indicator
    this.showTypingIndicator()

    try {
      // Real API call to Django backend
      const res = await fetch("/api/message/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `message=${encodeURIComponent(text)}`
      })
      const data = await res.json()
      this.hideTypingIndicator()
      if (data.message) {
        this.appendMessage("assistant", data.message, true)
      } else {
        this.appendMessage("assistant", "Sorry, I encountered an error. Please try again.", false)
      }
    } catch (error) {
      this.hideTypingIndicator()
      this.appendMessage("assistant", "Sorry, I encountered an error. Please try again.", false)
    }
  }


  // simulateAPICall removed; now using real backend

  appendMessage(role, text, animated = false) {
    const messageDiv = document.createElement("div")
    messageDiv.className = `message ${role}`

    const avatar = document.createElement("div")
    avatar.className = "message-avatar"
    avatar.textContent = role === "user" ? "👤" : "🤖"

    const bubble = document.createElement("div")
    bubble.className = "message-bubble"

    messageDiv.appendChild(avatar)
    messageDiv.appendChild(bubble)

    this.chatBox.appendChild(messageDiv)

    if (animated && role === "assistant") {
      this.typeText(bubble, text, () => {
        this.scrollToBottom()
      })
    } else {
      bubble.textContent = text
      this.scrollToBottom()
    }

    this.messageCount++
    this.updateChatPreview(text)
  }

  typeText(element, text, callback) {
    let i = 0
    element.textContent = ""

    const typeChar = () => {
      if (i < text.length) {
        element.textContent += text.charAt(i)
        i++
        this.scrollToBottom()
        setTimeout(typeChar, 20 + Math.random() * 30)
      } else if (callback) {
        callback()
      }
    }

    typeChar()
  }

  showTypingIndicator() {
    this.isTyping = true
    this.typingIndicator.style.display = "flex"
    this.scrollToBottom()

    // Disable send button
    const sendBtn = document.querySelector(".send-btn")
    sendBtn.disabled = true
  }

  hideTypingIndicator() {
    this.isTyping = false
    this.typingIndicator.style.display = "none"

    // Enable send button
    const sendBtn = document.querySelector(".send-btn")
    sendBtn.disabled = false
  }

  scrollToBottom() {
    setTimeout(() => {
      this.chatBox.scrollTop = this.chatBox.scrollHeight
    }, 10)
  }

  autoResizeInput() {
    const input = this.userInput
    input.style.height = "auto"
    input.style.height = Math.min(input.scrollHeight, 120) + "px"
  }

  startNewChat() {
    this.clearChat()

    // Add new chat to sidebar
    const chatList = document.getElementById("chat-list")
    const newChatItem = document.createElement("li")
    newChatItem.className = "chat-item"
    newChatItem.innerHTML = `
            <div class="chat-preview">
                <span class="chat-title">New Chat</span>
                <span class="chat-snippet">Start a conversation...</span>
            </div>
            <span class="chat-time">Now</span>
        `

    // Remove active class from other chats
    chatList.querySelectorAll(".chat-item").forEach((item) => {
      item.classList.remove("active")
    })

    newChatItem.classList.add("active")
    chatList.insertBefore(newChatItem, chatList.firstChild)

    // Show welcome message
    const welcomeMsg = document.querySelector(".welcome-message")
    if (welcomeMsg) {
      welcomeMsg.style.display = "flex"
    }
  }

  clearChat() {
    // Remove all messages except welcome message
    const messages = this.chatBox.querySelectorAll(".message")
    messages.forEach((msg) => msg.remove())

    this.messageCount = 0
    this.hideTypingIndicator()
  }

  updateChatPreview(lastMessage) {
    const activeChat = document.querySelector(".chat-item.active")
    if (activeChat) {
      const snippet = activeChat.querySelector(".chat-snippet")
      if (snippet) {
        snippet.textContent = lastMessage.substring(0, 50) + (lastMessage.length > 50 ? "..." : "")
      }
    }
  }
}

// Initialize chat interface when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new ChatInterface()
})

// Add some interactive enhancements
document.addEventListener("DOMContentLoaded", () => {
  // Add hover effects to messages
  document.addEventListener("mouseover", (e) => {
    if (e.target.closest(".message-bubble")) {
      e.target.closest(".message-bubble").style.transform = "translateY(-1px)"
    }
  })

  document.addEventListener("mouseout", (e) => {
    if (e.target.closest(".message-bubble")) {
      e.target.closest(".message-bubble").style.transform = "translateY(0)"
    }
  })

  // Add mobile sidebar toggle (for future mobile implementation)
  const chatHeader = document.querySelector(".chat-header")
  if (window.innerWidth <= 768) {
    const menuBtn = document.createElement("button")
    menuBtn.className = "action-btn menu-btn"
    menuBtn.innerHTML = "☰"
    menuBtn.title = "Menu"

    const chatActions = document.querySelector(".chat-actions")
    chatActions.insertBefore(menuBtn, chatActions.firstChild)

    menuBtn.addEventListener("click", () => {
      document.querySelector(".sidebar").classList.toggle("open")
    })
  }
})
