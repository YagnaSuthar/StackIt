

// JWT Secret Key Generator & Setup Guide

// === METHOD 1: Using Node.js crypto module (Recommended) ===

const crypto = require('crypto');

// Generate a random 256-bit (32-byte) secret key
const generateJWTSecret = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Generate multiple keys to choose from
const generateMultipleKeys = (count = 5) => {
  console.log('=== Generated JWT Secret Keys ===\n');
  
  for (let i = 1; i <= count; i++) {
    const secretKey = generateJWTSecret();
    console.log(`Key ${i}: ${secretKey}`);
  }
  
  console.log('\n=== Copy one of these keys to your .env file ===');
  console.log('Example: JWT_SECRET=your_chosen_key_here');
};

// Run the generator
generateMultipleKeys();

// === METHOD 2: Using base64 encoding ===

const generateBase64Secret = () => {
  return crypto.randomBytes(64).toString('base64');
};

console.log('\n=== Base64 Encoded Secret (Alternative) ===');
console.log('Base64 Key:', generateBase64Secret());

// === METHOD 3: Using UUID v4 (Less secure but still usable) ===

const { v4: uuidv4 } = require('uuid');

const generateUUIDSecret = () => {
  // Combine multiple UUIDs for extra security
  return `${uuidv4()}-${uuidv4()}-${uuidv4()}`;
};

console.log('\n=== UUID-based Secret (Alternative) ===');
console.log('UUID Key:', generateUUIDSecret());

// === METHOD 4: Custom string generator ===

const generateCustomSecret = (length = 64) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};

console.log('\n=== Custom Generated Secret ===');
console.log('Custom Key:', generateCustomSecret());

// === ENVIRONMENT SETUP HELPER ===

const fs = require('fs');
const path = require('path');

const setupEnvFile = (secretKey) => {
  const envPath = path.join(process.cwd(), '.env');
  
  // Check if .env file exists
  if (fs.existsSync(envPath)) {
    console.log('\n=== .env file already exists ===');
    console.log('Add this line to your .env file:');
    console.log(`JWT_SECRET=${secretKey}`);
    
    // Read existing .env and check if JWT_SECRET exists
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    if (envContent.includes('JWT_SECRET=')) {
      console.log('\n⚠️  JWT_SECRET already exists in .env file');
      console.log('Replace the existing JWT_SECRET with the new one if needed');
    } else {
      // Append JWT_SECRET to existing .env file
      fs.appendFileSync(envPath, `\nJWT_SECRET=${secretKey}\n`);
      console.log('\n✅ JWT_SECRET added to existing .env file');
    }
  } else {
    // Create new .env file with common variables
    const envTemplate = `# Environment Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/stackit
# For MongoDB Atlas, use:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/stackit?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=${secretKey}
JWT_EXPIRE=30d

# CORS Configuration (Frontend URL)
FRONTEND_URL=http://localhost:3000
`;
    
    fs.writeFileSync(envPath, envTemplate);
    console.log('\n✅ .env file created with JWT_SECRET');
  }
};

// === VALIDATION HELPER ===

const validateJWTSecret = (secret) => {
  const issues = [];
  
  if (!secret) {
    issues.push('JWT_SECRET is empty or undefined');
  }
  
  if (secret && secret.length < 32) {
    issues.push('JWT_SECRET should be at least 32 characters long');
  }
  
  if (secret && secret === 'your_super_secret_jwt_key_here') {
    issues.push('JWT_SECRET is using the default placeholder value');
  }
  
  if (secret && /^[a-zA-Z0-9]*$/.test(secret) && secret.length < 64) {
    issues.push('JWT_SECRET should contain special characters for better security');
  }
  
  return {
    isValid: issues.length === 0,
    issues: issues
  };
};

// === COMPLETE SETUP FUNCTION ===

const completeJWTSetup = () => {
  console.log('\n=== JWT Secret Key Setup ===\n');
  
  // Generate a secure key
  const secretKey = generateJWTSecret();
  
  console.log('1. Generated secure JWT secret key:');
  console.log(`   ${secretKey}\n`);
  
  // Setup .env file
  setupEnvFile(secretKey);
  
  // Validate the key
  const validation = validateJWTSecret(secretKey);
  if (validation.isValid) {
    console.log('✅ JWT secret key is secure and valid\n');
  } else {
    console.log('⚠️  JWT secret key issues:');
    validation.issues.forEach(issue => console.log(`   - ${issue}`));
  }
  
  console.log('=== Next Steps ===');
  console.log('1. Restart your server to load the new environment variables');
  console.log('2. Test your authentication endpoints');
  console.log('3. Make sure to keep your JWT_SECRET secure and never commit it to version control');
  console.log('4. Use different secrets for development, staging, and production environments\n');
};

// === SECURITY BEST PRACTICES ===

const securityBestPractices = () => {
  console.log('\n=== JWT Security Best Practices ===\n');
  
  const practices = [
    'Use a strong, random secret key (at least 256 bits)',
    'Never hardcode secrets in your source code',
    'Use environment variables for configuration',
    'Use different secrets for different environments',
    'Rotate your secrets periodically',
    'Set appropriate token expiration times',
    'Use HTTPS in production',
    'Consider using RS256 (RSA) instead of HS256 for better security',
    'Store secrets securely (use secret management services in production)',
    'Never log or expose JWT secrets in error messages'
  ];
  
  practices.forEach((practice, index) => {
    console.log(`${index + 1}. ${practice}`);
  });
  
  console.log('\n=== Environment-specific Secrets ===');
  console.log('Development: Use generated random key');
  console.log('Staging: Use different random key');
  console.log('Production: Use secure key management service (AWS Secrets Manager, Azure Key Vault, etc.)');
};

// === EXPORT FUNCTIONS ===

module.exports = {
  generateJWTSecret,
  generateMultipleKeys,
  generateBase64Secret,
  generateUUIDSecret,
  generateCustomSecret,
  setupEnvFile,
  validateJWTSecret,
  completeJWTSetup,
  securityBestPractices
};

// === COMMAND LINE INTERFACE ===

if (require.main === module) {
  // Get command line arguments
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    completeJWTSetup();
  } else {
    switch (args[0]) {
      case 'generate':
        generateMultipleKeys(parseInt(args[1]) || 5);
        break;
      case 'setup':
        completeJWTSetup();
        break;
      case 'validate':
        const secret = args[1] || process.env.JWT_SECRET;
        const validation = validateJWTSecret(secret);
        console.log('Validation result:', validation);
        break;
      case 'best-practices':
        securityBestPractices();
        break;
      default:
        console.log('Usage: node jwt-secret-generator.js [generate|setup|validate|best-practices]');
    }
  }
}

// === QUICK USAGE EXAMPLES ===

/*
Usage Examples:

1. Generate and setup everything:
   node jwt-secret-generator.js

2. Just generate keys:
   node jwt-secret-generator.js generate

3. Generate specific number of keys:
   node jwt-secret-generator.js generate 10

4. Validate existing secret:
   node jwt-secret-generator.js validate your_secret_key_here

5. Show best practices:
   node jwt-secret-generator.js best-practices
*/