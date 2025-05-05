// Import the validateFirebaseConnection function from firebase-config.js
import { validateFirebaseConnection } from "./firebase-config.js"

// Immediately invoke an async function to test the connection
;(async () => {
  console.log("Starting Firebase connection validation...")

  try {
    // Call the validation function
    const isConnected = await validateFirebaseConnection()

    if (isConnected) {
      console.log("✅ SUCCESS: Firebase connection is working properly!")
      console.log("Your application is now connected to the new Firebase project: aiconnect-ion-lejsx1")
    } else {
      console.error("❌ ERROR: Firebase connection validation returned false.")
      console.error("Please check your Firebase configuration and permissions.")
    }
  } catch (error) {
    console.error("❌ ERROR: An exception occurred during validation:")
    console.error(error)
    console.error("Please verify your Firebase credentials and network connection.")
  }
})()
