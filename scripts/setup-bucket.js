const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupBucket() {
  const bucketName = "rhp-uploads";
  const { data: buckets } = await supabase.storage.listBuckets();
  
  if (!buckets?.find(b => b.name === bucketName)) {
    console.log(`Creating bucket '${bucketName}'...`);
    const { data, error } = await supabase.storage.createBucket(bucketName, {
      public: false,
      allowedMimeTypes: ['application/pdf'],
      fileSizeLimit: 50 * 1024 * 1024 // 50MB
    });
    if (error) console.error("Error:", error);
    else console.log("Created:", data);
  } else {
    console.log("Bucket already exists.");
  }
}

setupBucket();
