import { renderHook, waitFor } from '@testing-library/react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { useBraceletProfile } from '../useBraceletProfile'

const mockProfile = {
  theme: 'guanyin',
  language: 'zh-CN',
  mood: 'anxious',
  goalTag: 'calm',
  owner: 'test-user',
  material: 'sandalwood',
  meritPoints: 108
}

const server = setupServer(
  rest.get('https://bless.top/wp-json/bracelet-info/v2/:chipId', (req, res, ctx) => {
    const { chipId } = req.params
    if (chipId === 'test-chip-123') {
      return res(ctx.json(mockProfile))
    }
    return res(ctx.status(404), ctx.json({ error: 'Not found' }))
  }),
  
  rest.post('https://bless.top/wp-json/bracelet-info/v2/:chipId/mood', (req, res, ctx) => {
    const { chipId } = req.params
    if (chipId === 'test-chip-123') {
      return res(ctx.json({ ...mockProfile, mood: 'peaceful' }))
    }
    return res(ctx.status(404), ctx.json({ error: 'Not found' }))
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('useBraceletProfile', () => {
  it('should fetch profile successfully', async () => {
    const { result } = renderHook(() => useBraceletProfile('test-chip-123'))
    
    expect(result.current.loading).toBe(true)
    expect(result.current.profile).toBe(null)
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    expect(result.current.profile).toEqual(mockProfile)
    expect(result.current.error).toBe(null)
  })
  
  it('should handle fetch error', async () => {
    const { result } = renderHook(() => useBraceletProfile('invalid-chip'))
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    expect(result.current.profile).toBe(null)
    expect(result.current.error).toBe('HTTP 404')
  })
  
  it('should update mood successfully', async () => {
    const { result } = renderHook(() => useBraceletProfile('test-chip-123'))
    
    await waitFor(() => {
      expect(result.current.profile).toEqual(mockProfile)
    })
    
    const success = await result.current.setMood('peaceful')
    
    expect(success).toBe(true)
    expect(result.current.profile.mood).toBe('peaceful')
  })
  
  it('should not fetch when chipId is null', () => {
    const { result } = renderHook(() => useBraceletProfile(null))
    
    expect(result.current.loading).toBe(false)
    expect(result.current.profile).toBe(null)
    expect(result.current.error).toBe(null)
  })
}) 