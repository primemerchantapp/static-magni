import { database, ref, push, set, get, query, orderByChild, equalTo } from "./firebase-config.js"

/**
 * Creates a new post in the database
 * @param {Object} post - Post object without id, likes, comments
 * @returns {Promise<string>} - The ID of the created post
 */
export const createPost = async (post) => {
  try {
    // Validate required fields
    if (!post.userId || !post.content) {
      throw new Error("Post must have userId and content")
    }

    // Create a reference to the posts collection
    const postsRef = ref(database, "posts")

    // Generate a new post with only required values
    const newPost = {
      userId: post.userId,
      content: post.content,
      imageUrl: post.imageUrl || null,
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Push the post to generate a unique ID
    const newPostRef = push(postsRef)

    // Set the post data with the generated ID
    await set(newPostRef, newPost)

    // Return the ID of the new post
    return newPostRef.key
  } catch (error) {
    console.error("Error creating post:", error)
    throw error
  }
}

/**
 * Gets all posts by a specific user ID
 * @param {string} userId - The ID of the user
 * @returns {Promise<Array>} - Array of posts
 */
export const getPostsByUserId = async (userId) => {
  try {
    // Create a query to find posts by userId
    const postsRef = ref(database, "posts")
    const userPostsQuery = query(postsRef, orderByChild("userId"), equalTo(userId))

    // Get the posts
    const snapshot = await get(userPostsQuery)

    if (snapshot.exists()) {
      // Convert the snapshot to an array of posts with IDs
      const posts = []
      snapshot.forEach((childSnapshot) => {
        posts.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        })
      })
      return posts
    } else {
      return []
    }
  } catch (error) {
    console.error("Error getting posts by user ID:", error)
    throw error
  }
}

/**
 * Adds a comment to a post
 * @param {Object} comment - Comment object without id
 * @returns {Promise<string>} - The ID of the created comment
 */
export const addComment = async (comment) => {
  try {
    // Create a reference to the comments collection
    const commentsRef = ref(database, "comments")

    // Generate a new comment
    const newComment = {
      postId: comment.postId,
      userId: comment.userId,
      content: comment.content,
      createdAt: new Date().toISOString(),
    }

    // Push the comment to generate a unique ID
    const newCommentRef = push(commentsRef)

    // Set the comment data with the generated ID
    await set(newCommentRef, newComment)

    // Update the comment count for the post
    const postRef = ref(database, `posts/${comment.postId}`)
    const postSnapshot = await get(postRef)

    if (postSnapshot.exists()) {
      const post = postSnapshot.val()
      await set(postRef, {
        ...post,
        comments: (post.comments || 0) + 1,
        updatedAt: new Date().toISOString(),
      })
    }

    // Return the ID of the new comment
    return newCommentRef.key
  } catch (error) {
    console.error("Error adding comment:", error)
    throw error
  }
}

/**
 * Gets all comments for a specific post
 * @param {string} postId - The ID of the post
 * @returns {Promise<Array>} - Array of comments
 */
export const getCommentsByPostId = async (postId) => {
  try {
    // Create a query to find comments by postId
    const commentsRef = ref(database, "comments")
    const postCommentsQuery = query(commentsRef, orderByChild("postId"), equalTo(postId))

    // Get the comments
    const snapshot = await get(postCommentsQuery)

    if (snapshot.exists()) {
      // Convert the snapshot to an array of comments with IDs
      const comments = []
      snapshot.forEach((childSnapshot) => {
        comments.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        })
      })
      return comments
    } else {
      return []
    }
  } catch (error) {
    console.error("Error getting comments by post ID:", error)
    throw error
  }
}

/**
 * Likes a post
 * @param {string} postId - The ID of the post to like
 * @returns {Promise<void>}
 */
export const likePost = async (postId) => {
  try {
    const postRef = ref(database, `posts/${postId}`)
    const snapshot = await get(postRef)

    if (snapshot.exists()) {
      const post = snapshot.val()
      await set(postRef, {
        ...post,
        likes: (post.likes || 0) + 1,
        updatedAt: new Date().toISOString(),
      })
    }
  } catch (error) {
    console.error("Error liking post:", error)
    throw error
  }
}
