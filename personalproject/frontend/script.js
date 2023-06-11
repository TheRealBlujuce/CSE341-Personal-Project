
// ---------------------------------POSTS--------------------------------
fetch('/posts')
    .then(response => response.json())
    .then(posts => {
      console.log(posts)
      const postsContainer = document.getElementById('posts-container');

      posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'bg-white rounded-[12px] shadow-xl';
        // <img src="${post.imageUrl}" alt="${post.title}" class="w-full h-48 object-cover rounded-t">
        postElement.innerHTML = `
        <div class="p-6 relative">
            <h3 class="text-xl font-bold text-gray-800 w-fit sm:w-auto">${post.postTitle} by ${post.reviewer}</h3>
            <h2 class="text-lg font-bold text-gray-800 mt-2">Game: ${post.gameTitle}</h2>
            <div class="flex flex-row gap-auto sm:flex-col gap-2">
                <h2 class="text-md italic font-bold text-gray-600 mt-2">Rating: ${post.rating}</h2>
                <h2 class="text-md italic font-bold text-gray-600 mt-2">|</h2>
                <h4 class="text-md md:text-sm italic font-bold text-gray-600 mt-2 ml-4 self-start sm:self-auto">Platform: ${post.platform}</h4>
            </div>
            <p class="text-gray-600 mt-2">${post.postContent}</p>
            <div class="flex justify-between items-center h-[76px] mt-6 mx-auto">
                <a href="#" class="inline-block bg-blue-500 hover:bg-blue-600 w-[148px] transition-all ease-in-out duration-250 hover:scale-110 text-white py-1.5 text-center rounded-[24px]">Read More</a>
                <h4 class="text-md italic font-bold text-gray-600">${post.postDate}</h4>
            </div>
        </div>

        `;    

        postsContainer.appendChild(postElement);
      });
    })
    .catch(error => {
      console.error(error);
      alert('Failed to fetch posts');
    });
// ---------------------------------COMMENTS--------------------------------
fetch('/comments')
  .then(response => response.json())
  .then(comments => {
    console.log(comments);
    const commentsContainer = document.getElementById('comments-container');

    comments.forEach(comment => {
        // Create comment element
        const commentElement = document.createElement('div');

        commentElement.className = 'bg-white rounded-[12px] shadow-xl';
        commentElement.innerHTML = `
        <div class="p-6">
            <h3 class="text-xl font-bold text-gray-800">${comment.author}</h3>
            <p class="text-gray-600 mt-2">${comment.content}</p>
        </div>
        `;  
        commentsContainer.appendChild(commentElement);
    });
  })
  .catch(error => {
    console.error(error);
    alert('Failed to fetch comments');
  });


