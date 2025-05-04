import { database, ref, push, set, get } from "./firebase-config.js"

/**
 * Creates a new course in the database
 * @param {Object} course - Course object without id
 * @returns {Promise<string>} - The ID of the created course
 */
export const createCourse = async (course) => {
  try {
    // Validate required fields
    if (!course.title || !course.description) {
      throw new Error("Course must have title and description")
    }

    // Create a reference to the courses collection
    const coursesRef = ref(database, "courses")

    // Generate a new course with validated data
    const newCourse = {
      title: course.title,
      description: course.description,
      imageUrl: course.imageUrl || null,
      price: course.price || 0,
      duration: course.duration || "0 hours",
      level: course.level || "beginner",
      instructor: course.instructor || "",
      modules: course.modules || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Push the course to generate a unique ID
    const newCourseRef = push(coursesRef)

    // Set the course data with the generated ID
    await set(newCourseRef, newCourse)

    // Return the ID of the new course
    return newCourseRef.key
  } catch (error) {
    console.error("Error creating course:", error)
    throw error
  }
}

/**
 * Gets all courses from the database
 * @returns {Promise<Array>} - Array of courses
 */
export const getCourses = async () => {
  try {
    // Create a reference to the courses collection
    const coursesRef = ref(database, "courses")

    // Get all courses
    const snapshot = await get(coursesRef)

    if (snapshot.exists()) {
      // Convert the snapshot to an array of courses with IDs
      const courses = []
      snapshot.forEach((childSnapshot) => {
        courses.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        })
      })
      return courses
    } else {
      return []
    }
  } catch (error) {
    console.error("Error getting courses:", error)
    throw error
  }
}

/**
 * Gets a specific course by ID
 * @param {string} courseId - The ID of the course
 * @returns {Promise<Object|null>} - The course object or null if not found
 */
export const getCourseById = async (courseId) => {
  try {
    // Create a reference to the specific course
    const courseRef = ref(database, `courses/${courseId}`)

    // Get the course
    const snapshot = await get(courseRef)

    if (snapshot.exists()) {
      return {
        id: snapshot.key,
        ...snapshot.val(),
      }
    } else {
      return null
    }
  } catch (error) {
    console.error("Error getting course by ID:", error)
    throw error
  }
}

/**
 * Adds a module to a course
 * @param {string} courseId - The ID of the course
 * @param {Object} module - Module object without id
 * @returns {Promise<string>} - The ID of the created module
 */
export const addModuleToCourse = async (courseId, module) => {
  try {
    // Get the current course
    const course = await getCourseById(courseId)

    if (!course) {
      throw new Error(`Course with ID ${courseId} not found`)
    }

    // Generate a unique ID for the module
    const moduleId = Date.now().toString()

    // Create the new module
    const newModule = {
      id: moduleId,
      courseId: courseId,
      title: module.title,
      description: module.description,
      order: module.order,
      lessons: module.lessons || [],
    }

    // Add the module to the course's modules array
    const modules = course.modules || []
    modules.push(newModule)

    // Update the course with the new module
    const courseRef = ref(database, `courses/${courseId}`)
    await set(courseRef, {
      ...course,
      modules: modules,
      updatedAt: new Date().toISOString(),
    })

    return moduleId
  } catch (error) {
    console.error("Error adding module to course:", error)
    throw error
  }
}

/**
 * Adds a lesson to a module
 * @param {string} courseId - The ID of the course
 * @param {string} moduleId - The ID of the module
 * @param {Object} lesson - Lesson object without id
 * @returns {Promise<string>} - The ID of the created lesson
 */
export const addLessonToModule = async (courseId, moduleId, lesson) => {
  try {
    // Get the current course
    const course = await getCourseById(courseId)

    if (!course) {
      throw new Error(`Course with ID ${courseId} not found`)
    }

    // Find the module
    const moduleIndex = course.modules.findIndex((m) => m.id === moduleId)

    if (moduleIndex === -1) {
      throw new Error(`Module with ID ${moduleId} not found in course ${courseId}`)
    }

    // Generate a unique ID for the lesson
    const lessonId = Date.now().toString()

    // Create the new lesson
    const newLesson = {
      id: lessonId,
      moduleId: moduleId,
      title: lesson.title,
      description: lesson.description,
      videoUrl: lesson.videoUrl || null,
      duration: lesson.duration,
      order: lesson.order,
      completed: false,
    }

    // Add the lesson to the module's lessons array
    const module = course.modules[moduleIndex]
    const lessons = module.lessons || []
    lessons.push(newLesson)

    // Update the module with the new lesson
    course.modules[moduleIndex] = {
      ...module,
      lessons: lessons,
    }

    // Update the course with the updated module
    const courseRef = ref(database, `courses/${courseId}`)
    await set(courseRef, {
      ...course,
      updatedAt: new Date().toISOString(),
    })

    return lessonId
  } catch (error) {
    console.error("Error adding lesson to module:", error)
    throw error
  }
}

/**
 * Marks a lesson as completed
 * @param {string} courseId - The ID of the course
 * @param {string} moduleId - The ID of the module
 * @param {string} lessonId - The ID of the lesson
 * @returns {Promise<void>}
 */
export const markLessonAsCompleted = async (courseId, moduleId, lessonId) => {
  try {
    // Get the current course
    const course = await getCourseById(courseId)

    if (!course) {
      throw new Error(`Course with ID ${courseId} not found`)
    }

    // Find the module
    const moduleIndex = course.modules.findIndex((m) => m.id === moduleId)

    if (moduleIndex === -1) {
      throw new Error(`Module with ID ${moduleId} not found in course ${courseId}`)
    }

    // Find the lesson
    const module = course.modules[moduleIndex]
    const lessonIndex = module.lessons.findIndex((l) => l.id === lessonId)

    if (lessonIndex === -1) {
      throw new Error(`Lesson with ID ${lessonId} not found in module ${moduleId}`)
    }

    // Mark the lesson as completed
    module.lessons[lessonIndex] = {
      ...module.lessons[lessonIndex],
      completed: true,
    }

    // Update the course with the updated module
    const courseRef = ref(database, `courses/${courseId}`)
    await set(courseRef, {
      ...course,
      updatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error marking lesson as completed:", error)
    throw error
  }
}
