const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables from the root .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const BACKUP_ROOT = path.join(__dirname, 'backups');
const BACKUP_DIR = path.join(BACKUP_ROOT, `cloudinary_backup_${timestamp}`);

async function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function downloadFile(url, targetPath) {
  const writer = fs.createWriteStream(targetPath);
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  });
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

async function backupCloudinary() {
  console.log('--- Starting Cloudinary recursive backup ---');
  
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('Error: Cloudinary credentials not found in .env file.');
    return;
  }

  await ensureDir(BACKUP_DIR);
  
  const resourceTypes = ['image', 'video', 'raw'];
  let allResources = [];

  for (const type of resourceTypes) {
    let nextCursor = null;
    console.log(`Scanning [${type}] items...`);
    try {
      do {
        // According to Cloudinary: no prefix = everything
        const result = await cloudinary.api.resources({
          resource_type: type,
          type: 'upload',
          max_results: 500,
          next_cursor: nextCursor,
          // We don't use prefix so we get everything
        });
        
        allResources = allResources.concat(result.resources);
        nextCursor = result.next_cursor;
        console.log(`  Found ${allResources.length} ${type}s so far...`);
      } while (nextCursor);
    } catch (err) {
      if (err.http_code !== 404) {
        console.error(`Error listing [${type}]:`, err.message);
      }
    }
  }

  console.log(`\nTotal resources to process: ${allResources.length}`);
  
  const metadata = [];
  let successCount = 0;
  let failCount = 0;

  for (const resource of allResources) {
    const { public_id, format, secure_url, resource_type, asset_folder, folder } = resource;
    
    // Choose the best folder info. In modern Cloudinary asset_folder is best.
    const destinationFolder = (asset_folder || folder || '').replace(/[<>:"|?*]/g, '_');
    
    let fileName = public_id.split('/').pop().replace(/[<>:"/\\|?*]/g, '_');
    if (format && !fileName.toLowerCase().endsWith(`.${format.toLowerCase()}`)) {
      fileName += `.${format}`;
    }

    const localFolderPath = path.join(BACKUP_DIR, destinationFolder);
    await ensureDir(localFolderPath);
    
    const localFilePath = path.join(localFolderPath, fileName);
    
    process.stdout.write(`Downloading [${resource_type}] ${public_id}... `);
    
    try {
      await downloadFile(secure_url, localFilePath);
      metadata.push({
        public_id,
        resource_type,
        format,
        url: secure_url,
        asset_folder: destinationFolder,
        display_name: resource.display_name || '',
        local_path: path.relative(BACKUP_DIR, localFilePath)
      });
      console.log('OK');
      successCount++;
    } catch (err) {
      console.log('FAILED');
      console.error(`  Error downloading ${public_id}: ${err.message}`);
      failCount++;
    }
  }

  fs.writeFileSync(
    path.join(BACKUP_DIR, 'metadata.json'),
    JSON.stringify(metadata, null, 2)
  );
  
  console.log('\n--- Backup Summary ---');
  console.log(`Saved to: ${BACKUP_DIR}`);
  console.log(`Success: ${successCount}`);
  console.log(`Failed: ${failCount}`);
  console.log(`Total: ${allResources.length}`);
}

backupCloudinary();
