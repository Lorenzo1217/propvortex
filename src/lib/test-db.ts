// src/lib/test-db.ts
import { db } from './db'

export async function testDatabaseConnection() {
  try {
    // Try to count users (should be 0 initially)
    const userCount = await db.user.count()
    console.log('✅ Database connected successfully!')
    console.log(`📊 Current user count: ${userCount}`)
    return true
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    return false
  }
}
