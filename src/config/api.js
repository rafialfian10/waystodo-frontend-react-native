import axios from 'axios'
// import { KontenbaseClient } from '@kontenbase/sdk'

// const kontenbase = new KontenbaseClient({ apiKey: 'https://api.kontenbase.com/query/api/v1/d9bda5b2-9c4a-4a0b-ade9-7fec476bb04e' })

export const API = axios.create({
    baseURL: 'https://api.kontenbase.com/query/api/v1/d9bda5b2-9c4a-4a0b-ade9-7fec476bb04e'
})
