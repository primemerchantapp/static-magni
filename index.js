import { database } from "./firebase-config.js"
import * as SocialModule from "./social-module.js"
import * as CourseModule from "./course-module.js"

// Export all modules
export { database, SocialModule, CourseModule }

console.log("Firebase Realtime Database modules initialized")
