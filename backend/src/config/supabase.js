const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Carga las variables de entorno apuntando a la raíz del backend
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Inicializa el cliente oficial
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
