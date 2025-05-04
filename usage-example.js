import { createPost, getPostsByUserId, addComment, likePost } from "./social-module.js"
import { getCourses } from "./course-module.js"

/**
 * Social Module API Documentation
 *
 * This module provides functions for managing social interactions like posts, comments, and likes.
 *
 * Usage:
 *
 * 1. Creating a post:
 *    const postId = await createPost({
 *      userId: "actual-user-id",
 *      content: "Post content",
 *      imageUrl: "optional-image-url"
 *    });
 *
 * 2. Getting posts by user:
 *    const posts = await getPostsByUserId("actual-user-id");
 *
 * 3. Adding a comment:
 *    const commentId = await addComment({
 *      postId: "actual-post-id",
 *      userId: "commenter-user-id",
 *      content: "Comment content"
 *    });
 *
 * 4. Getting comments on a post:
 *    const comments = await getCommentsByPostId("actual-post-id");
 *
 * 5. Liking a post:
 *    await likePost("actual-post-id");
 */

/**
 * Course Module API Documentation
 *
 * This module provides functions for managing educational courses, modules, and lessons.
 *
 * Usage:
 *
 * 1. Creating a course:
 *    const courseId = await createCourse({
 *      title: "Course title",
 *      description: "Course description",
 *      imageUrl: "course-image-url",
 *      price: 49.99,
 *      duration: "10 hours",
 *      level: "beginner",
 *      instructor: "Instructor name"
 *    });
 *
 * 2. Getting all courses:
 *    const courses = await getCourses();
 *
 * 3. Getting a specific course:
 *    const course = await getCourseById("actual-course-id");
 *
 * 4. Adding a module to a course:
 *    const moduleId = await addModuleToCourse("actual-course-id", {
 *      title: "Module title",
 *      description: "Module description",
 *      order: 1
 *    });
 *
 * 5. Adding a lesson to a module:
 *    const lessonId = await addLessonToModule("actual-course-id", "actual-module-id", {
 *      title: "Lesson title",
 *      description: "Lesson description",
 *      videoUrl: "lesson-video-url",
 *      duration: "15 minutes",
 *      order: 1
 *    });
 *
 * 6. Marking a lesson as completed:
 *    await markLessonAsCompleted("actual-course-id", "actual-module-id", "actual-lesson-id");
 */

// Export a function to initialize the modules with real user data
export const initializeWithUser = (userId) => {
  if (!userId) {
    console.error("User ID is required to initialize modules")
    return
  }

  console.log(`Modules initialized for user: ${userId}`)

  // Return an object with methods scoped to this user
  return {
    // Social methods
    createUserPost: (content, imageUrl) => createPost({ userId, content, imageUrl }),
    getUserPosts: () => getPostsByUserId(userId),
    commentOnPost: (postId, content) => addComment({ postId, userId, content }),
    likeUserPost: (postId) => likePost(postId),

    // Course methods
    getUserCourses: async () => {
      // This is a placeholder - in a real app, you would query courses by user enrollment
      const allCourses = await getCourses()
      return allCourses
    },
  }
}
