import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  global: {
    headers: {
      get Authorization() {
        const token = localStorage.getItem('access_token')
        return token ? `Bearer ${token}` : ''
      },
    },
  },
})

export const uploadProductImage = async (file, userId) => {
  const fileName = `${userId}/${Date.now()}-${file.name}`

  const { data, error } = await supabase.storage.from('products').upload(fileName, file, {
    cacheControl: '3600',
    upsert: false,
  })

  if (error) throw error

  const { data: urlData } = supabase.storage.from('products').getPublicUrl(fileName)

  return urlData.publicUrl
}
