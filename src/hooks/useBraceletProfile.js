import { useState, useEffect } from 'react'

// Mock data that matches the actual API structure
const mockBraceletData = {
  imageUrl: 'https://package-app-storage.oss-cn-shenzhen.aliyuncs.com/bracelet/sample-bracelet.webp',
  owner: '善缘居士',
  chipId: 'Y7K9P2M4Q8R5T1N6B3J0F2H5D9G4L9W8',
  material: '小叶紫檀',
  beadCount: '108',
  level: '开光加持',
  consecrationDate: '2024年7月8日',
  consecrationTemple: '普陀山普济禅寺',
  consecrationHall: '大雄宝殿',
  consecrationMaster: '慧明法师',
  consecrationVideo: 'https://package-app-storage.oss-cn-shenzhen.aliyuncs.com/videos/consecration.mp4',
  lampOfferingVideo: 'https://package-app-storage.oss-cn-shenzhen.aliyuncs.com/videos/lamp-offering.mp4',
  meritProgress: 75,
  // Additional fields for PWA
  theme: 'guanyin',
  language: 'zh',
  mood: '焦虑',
  goalTag: '内心平静',
  meritPoints: 1080
}

export default function useBraceletProfile(chipId = null) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Get braceletId from URL if not provided
  const getBraceletIdFromURL = () => {
    if (typeof window === 'undefined') return null
    const params = new URLSearchParams(window.location.search)
    return params.get('braceletId') || params.get('braceletid') || chipId
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        setError(null)

        const braceletId = getBraceletIdFromURL()
        
        if (!braceletId) {
          // Use mock data when no braceletId is provided
          setProfile(mockBraceletData)
          setLoading(false)
          return
        }

        // Try to fetch from actual API
        const apiUrl = `https://bless.top/wp-json/bracelet-info/v1/bracelet/${braceletId}`
        
        try {
          const response = await fetch(apiUrl)
          
          if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`)
          }
          
          const data = await response.json()
          
          // Merge API data with PWA-specific fields
          const enhancedProfile = {
            ...data,
            // Add PWA-specific fields if not present
            theme: data.theme || 'guanyin',
            language: data.language || 'zh',
            mood: data.mood || '焦虑',
            goalTag: data.goalTag || '内心平静',
            meritPoints: data.meritPoints || Math.floor((data.meritProgress || 0) * 10.8)
          }
          
          setProfile(enhancedProfile)
        } catch (apiError) {
          console.warn('API fetch failed, using mock data:', apiError.message)
          
          // Use mock data with the provided braceletId
          setProfile({
            ...mockBraceletData,
            chipId: braceletId
          })
        }
        
        setLoading(false)
      } catch (err) {
        console.error('Profile fetch error:', err)
        setError(err.message)
        setLoading(false)
      }
    }

    fetchProfile()
  }, [chipId])

  const updateMood = (newMood) => {
    if (profile) {
      setProfile(prev => ({
        ...prev,
        mood: newMood
      }))
    }
  }

  return {
    profile,
    loading,
    error,
    updateMood,
    refetch: () => {
      const braceletId = getBraceletIdFromURL()
      if (braceletId) {
        // Re-fetch data
        setLoading(true)
        setError(null)
        // The useEffect will handle the refetch
      }
    }
  }
} 