import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'

// Lazy load pages for better performance
const IntroPage = lazy(() => import('./pages/IntroPage'))
const BlessingPage = lazy(() => import('./pages/BlessingPage'))
const EvalPage = lazy(() => import('./pages/EvalPage'))
const GiftPage = lazy(() => import('./pages/GiftPage'))
const BraceletPage = lazy(() => import('./pages/BraceletPage'))

// Loading component
const Loading = () => (
  <div className="min-h-screen bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
    <div className="glass-card p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      <p className="mt-4 text-gray-600 text-center">加载中...</p>
    </div>
  </div>
)

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-orange-100 to-orange-200">
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<IntroPage />} />
            <Route path="/blessing" element={<BlessingPage />} />
            <Route path="/blessing/eval" element={<EvalPage />} />
            <Route path="/blessing/gift" element={<GiftPage />} />
            <Route path="/bracelet" element={<BraceletPage />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  )
}

export default App 