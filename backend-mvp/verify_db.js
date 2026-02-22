const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log('Checking connection to:', supabaseUrl);

    // Try to select from qrcodes
    const { data, error } = await supabase
        .from('qrcodes')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error connecting to qrcodes table:', error);
    } else {
        console.log('Success! Found qrcodes table. Rows:', data);
    }
}

check();
