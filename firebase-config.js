// Firebase configuration
import { initializeApp } from "firebase/app"
import { getDatabase, ref, set, push, get, query, orderByChild, equalTo } from "firebase/database"

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDV5uecwO9YSqd9oc2c6-Bi2qSeQ60bp6I",
  authDomain: "aiconnect-ion-lejsx1.firebaseapp.com",
  databaseURL: "https://aiconnect-ion-lejsx1-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "aiconnect-ion-lejsx1",
  storageBucket: "aiconnect-ion-lejsx1.appspot.com",
  messagingSenderId: "673159361095",
  appId: "1:673159361095:web:eb5fd4f3062aaf66ea7762",
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
