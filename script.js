// Xử lý giao diện và logic chat
const sendButton = document.getElementById('send-button');
const userInput = document.getElementById('user-input');
const messagesDiv = document.getElementById('messages');
const welcomeMessage = document.getElementById('welcome-message');

// Hàm thêm tin nhắn vào giao diện
function addMessage(content, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    messageDiv.textContent = content;
    messagesDiv.appendChild(messageDiv);

    // Tự động cuộn xuống cuối
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    // Làm mờ và đẩy chữ "Chat CBD" lên khi có tin nhắn
    if (welcomeMessage) {
        welcomeMessage.style.opacity = '0';
    }
}

// Hàm gửi yêu cầu tới API
async function sendMessage() {
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
                'Authorization': 'Bearer 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', // Thay bằng API Key hợp lệ của bạn
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

        // Kiểm tra xem phản hồi từ API có hợp lệ không
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Lỗi từ API:', errorData);

            // Hiển thị lỗi cụ thể
            if (response.status === 401) {
                throw new Error('Lỗi 401: API Key không hợp lệ. Vui lòng kiểm tra lại API Key.');
            } else if (response.status === 404) {
                throw new Error('Lỗi 404: Endpoint không tìm thấy. Kiểm tra URL của API.');
            } else {
                throw new Error(`Lỗi ${response.status}: ${errorData.error?.message || 'Lỗi không xác định'}`);
            }
        }

        // Phản hồi từ API thành công
        const data = await response.json();
        const botReply = data.choices[0].message.content;

        // Hiển thị phản hồi của ChatGPT
        addMessage(botReply, 'bot');
    } catch (error) {
        console.error('Lỗi khi kết nối API:', error.message);

        // Hiển thị lỗi trên giao diện
        addMessage('Có lỗi xảy ra: ' + error.message, 'bot');
    }
}

// Gửi tin nhắn khi nhấn nút hoặc Enter
sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});
