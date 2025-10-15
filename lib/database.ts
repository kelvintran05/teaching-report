// Database fallback configuration
export const DATABASE_CONFIG = {
  // For production, we might need to handle database connection issues
  fallback: process.env.NODE_ENV === "production",
  
  // Connection timeout
  timeout: 10000,
  
  // Retry configuration
  retries: 3,
};

// Helper function to check database connection
export async function checkDatabaseConnection() {
  try {
    await prisma.$connect();
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    return false;
  }
}
