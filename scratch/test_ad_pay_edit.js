import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runTest() {
  console.log('🧪 Testing ad_pay edit functionality...');
  
  try {
    const res = await fetch('http://localhost:3000/api/af/ad_pay/data/sn/3267?sld=10&sln=1552375');
    if (!res.ok) {
      console.log('❌ Server is not running or API failed. Ensure server.js is running on port 3000.');
      return;
    }
    const data = await res.json();
    console.log(`✅ Loaded pay data: success=${data.success}, courses=${data.courses.length}, students=${data.students.length}`);
    
    if (data.students.length > 0) {
      const firstStudent = data.students[0];
      console.log(`- Testing individual update for student ${firstStudent.id}...`);
      
      const payload = {
        id: firstStudent.id,
        lec_num: data.currentSln,
        lec_pay: 100000,
        lec_use_cost: 10000,
        lec_pay_book: 0,
        lec_pay_item: 0,
        add_date: ''
      };
      
      const updateRes = await fetch('http://localhost:3000/api/af/ad_pay/update-single', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const updateResult = await updateRes.json();
      console.log(`✅ Update single: success=${updateResult.success}, message=${updateResult.message}`);
    }
  } catch (err) {
    console.error('Error during test:', err.message);
  }
}

runTest();
