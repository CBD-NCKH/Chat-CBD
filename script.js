// Lấy các phần tử cần thiết
const sendButton = document.getElementById('send-button');
const userInput = document.getElementById('user-input');
const messagesDiv = document.getElementById('messages');

// Hàm thêm tin nhắn vào giao diện
function addMessage(content, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    messageDiv.textContent = content;
    messagesDiv.appendChild(messageDiv);

    // Tự động cuộn xuống cuối
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Hàm gửi yêu cầu tới API
async function sendMessage() {
    const apiKey = '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'; // API Key của bạn
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    // Hiển thị tin nhắn của người dùng
    addMessage(userMessage, 'user');
    userInput.value = '';

    // Gửi yêu cầu đến ChatGPT API
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'Bạn là một trợ lý AI thông minh và thân thiện.' },
                    { role: 'user', content: userMessage }
                ],
                max_tokens: 200,
                temperature: 0.7
            }),
        });

        // Kiểm tra trạng thái phản hồi
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Lỗi 401: API Key không hợp lệ. Vui lòng kiểm tra lại API Key.');
            } else if (response.status === 429) {
                throw new Error('Lỗi 429: Vượt quá giới hạn yêu cầu. Vui lòng thử lại sau.');
            } else {
                throw new Error(`Lỗi ${response.status}: ${response.statusText}`);
            }
        }

        const data = await response.json();
        const botReply = data.choices[0].message.content;

        // Hiển thị phản hồi của ChatGPT
        addMessage(botReply, 'bot');
    } catch (error) {
        console.error('Chi tiết lỗi khi kết nối API:', error);
        addMessage(error.message, 'bot'); // Hiển thị lỗi lên giao diện
    }
}

// Gửi tin nhắn khi nhấn nút hoặc Enter
sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});
