import { useState, useEffect } from 'react'

const API_BASE = 'https://bless.top/wp-json/bracelet-info/v2'

// Mock data for development
const mockProfileData = {
  'demo-chip': {
    theme: 'guanyin',
    language: 'zh-CN',
    mood: 'anxious',
    goalTag: 'calm',
    owner: '演示用户',
    material: 'sandalwood',
    meritPoints: 108
  }
}

export function useBraceletProfile(chipId) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!chipId) return

    const fetchProfile = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`${API_BASE}/${chipId}`)
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }
        const data = await response.json()
        setProfile(data)
      } catch (err) {
        // Fallback to mock data in development
        if (mockProfileData[chipId]) {
          console.log('Using mock data for development')
          setProfile(mockProfileData[chipId])
        } else {
          setError(err.message)
          console.error('Failed to fetch bracelet profile:', err)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [chipId])

  const setMood = async (newMood) => {
    if (!chipId) return false

    try {
      const response = await fetch(`${API_BASE}/${chipId}/mood`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mood: newMood })
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const updatedProfile = await response.json()
      setProfile(updatedProfile)
      return true
    } catch (err) {
      // Fallback for development
      if (mockProfileData[chipId]) {
        const updated = { ...mockProfileData[chipId], mood: newMood }
        mockProfileData[chipId] = updated
        setProfile(updated)
        return true
      }
      console.error('Failed to update mood:', err)
      return false
    }
  }

  return {
    profile,
    loading,
    error,
    setMood
  }
} 