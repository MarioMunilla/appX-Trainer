import { test, expect, request } from '@playwright/test'
import { baseURL } from './fixtures'

test('GET /api/exercises devuelve lista', async () => {
    // Crear un contexto de API (opcional: puedes configurar baseURL, headers, etc.)
    const apiContext = await request.newContext({
        baseURL: baseURL,
        extraHTTPHeaders: {
            'Content-Type': 'application/json'
        }
    })

    // Hacer la petición
    const res = await apiContext.get('/api/exercises')

    // Comprobar status
    expect(res.ok()).toBeTruthy()

    // Leer JSON
    const json = await res.json()
    expect(json.results).toBeInstanceOf(Array)
    expect(json.results[0]).toHaveProperty('name')
})
