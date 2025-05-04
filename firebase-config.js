// Firebase configuration
import { initializeApp } from "firebase/app"
import { getDatabase, ref, set, push, get, query, orderByChild, equalTo } from "firebase/database"

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDTsjYZNWFfZOESP-2QQfbD7jc5fG9FJdc",
  authDomain: "explore-malaysia-6d28d.firebaseapp.com",
  databaseURL: "https://explore-malaysia-6d28d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "explore-malaysia-6d28d",
  storageBucket: "explore-malaysia-6d28d.appspot.com",
  messagingSenderId: "869053244601",
  appId: "1:869053244601:web:fff43d6a3418dad40be768",
  measurementId: "G-NLKN76P93S",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

export { database, ref, set, push, get, query, orderByChild, equalTo }

// Add validation to ensure Firebase is properly initialized
export const validateFirebaseConnection = async () => {
  try {
    // Test the database connection
    const testRef = ref(database, "connection_test")
    await set(testRef, {
      timestamp: new Date().toISOString(),
      status: "connected",
    })

    console.log("Firebase connection validated successfully")
    return true
  } catch (error) {
    console.error("Firebase connection validation failed:", error)
    return false
  }
}
