#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

console.log('🎵 Top Fan MVP Setup Script')
console.log('==========================\n')

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local')
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env.local file...')
  fs.copyFileSync(path.join(process.cwd(), 'env.example'), envPath)
  console.log('✅ Created .env.local from template')
  console.log('⚠️  Please update the environment variables in .env.local\n')
} else {
  console.log('✅ .env.local already exists\n')
}

// Check if node_modules exists
const nodeModulesPath = path.join(process.cwd(), 'node_modules')
if (!fs.existsSync(nodeModulesPath)) {
  console.log('📦 Installing dependencies...')
  console.log('Run: npm install\n')
} else {
  console.log('✅ Dependencies already installed\n')
}

console.log('🚀 Setup Instructions:')
console.log('1. Update .env.local with your Spotify and Supabase credentials')
console.log('2. Run: npm install')
console.log('3. Set up your Supabase database using supabase-schema.sql')
console.log('4. Run: npm run dev')
console.log('5. Open http://localhost:3000\n')

console.log('📚 Next Steps:')
console.log('- Set up Spotify Developer App')
console.log('- Create Supabase project')
console.log('- Run the SQL schema in Supabase')
console.log('- Update environment variables')
console.log('- Start development server\n')

console.log('🎉 Happy coding!')
