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
    const apiKey = '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'; // API Key
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    // Hiển thị tin nhắn của người dùng
    addMessage(userMessage, 'user');
    userInput.value = '';

    // Vô hiệu hóa nút gửi trong khi xử lý
    sendButton.disabled = true;

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
                max_tokens: 4000,
                temperature: 0.7
            }),
        });

        if (!response.ok) {
            // Xử lý các mã lỗi HTTP
            if (response.status === 401) {
                throw new Error('Lỗi 401: API Key không hợp lệ. Vui lòng kiểm tra lại API Key.');
            } else if (response.status === 429) {
                throw new Error('Lỗi 429: Vượt quá giới hạn yêu cầu. Vui lòng thử lại sau.');
            } else {
                throw new Error(`Lỗi ${response.status}: ${response.statusText}`);
            }
        }

        const data = await response.json();

        // Kiểm tra dữ liệu trả về có hợp lệ không
        if (data.choices && data.choices.length > 0) {
            const botReply = data.choices[0].message.content;
            addMessage(botReply, 'bot');
        } else {
            throw new Error('API không trả về dữ liệu hợp lệ.');
        }
    } catch (error) {
        console.error('Chi tiết lỗi:', error);
        addMessage(error.message, 'bot'); // Hiển thị lỗi lên giao diện
    } finally {
        // Kích hoạt lại nút gửi
        sendButton.disabled = false;
    }
}

// Gửi tin nhắn khi nhấn nút hoặc Enter
sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});
