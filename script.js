document.addEventListener('DOMContentLoaded', () => {
    const postForm = document.getElementById('postForm');
    const messageInput = document.getElementById('message');
    const postsContainer = document.getElementById('posts');

    // Load posts from localStorage
    loadPosts();

    postForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const message = messageInput.value;
        if (message.trim() === '') return;

        const post = {
            message,
            timestamp: new Date().getTime()
        };

        addPostToDOM(post);
        savePostToLocalStorage(post);

        messageInput.value = '';
    });

    function addPostToDOM(post) {
        const postContainer = document.createElement('div');
        postContainer.className = 'post';

        const postContent = document.createElement('p');
        postContent.textContent = post.message;

        const timestamp = document.createElement('div');
        timestamp.className = 'timestamp';
        timestamp.textContent = formatTime(post.timestamp);

        postContainer.appendChild(postContent);
        postContainer.appendChild(timestamp);
        postsContainer.appendChild(postContainer);
    }

    function savePostToLocalStorage(post) {
        const posts = getPostsFromLocalStorage();
        posts.push(post);
        localStorage.setItem('posts', JSON.stringify(posts));
    }

    function getPostsFromLocalStorage() {
        const posts = localStorage.getItem('posts');
        return posts ? JSON.parse(posts) : [];
    }

    function loadPosts() {
        const posts = getPostsFromLocalStorage();
        const oneHour = 60 * 60 * 1000;
        const now = new Date().getTime();
        const validPosts = posts.filter(post => now - post.timestamp < oneHour);

        validPosts.forEach(post => addPostToDOM(post));
        localStorage.setItem('posts', JSON.stringify(validPosts));
    }

    function formatTime(timestamp) {
        const diff = new Date().getTime() - timestamp;
        if (diff < 60 * 1000) {
            return 'less than a minute ago';
        } else if (diff < 60 * 60 * 1000) {
            const minutes = Math.floor(diff / (60 * 1000));
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else {
            const hours = Math.floor(diff / (60 * 60 * 1000));
            return `about ${hours} hour${hours > 1 ? 's' : ''} ago`;
        }
    }
});
