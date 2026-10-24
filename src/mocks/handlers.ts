import { http, HttpResponse } from 'msw'
import { nftFixtures } from '../features/nfts/fixtures'

export const handlers = [
  http.get('/api/nfts', () => {
    return HttpResponse.json(nftFixtures)
  }),
]