import { Link } from 'react-router-dom'

export default function IntroPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="glass-card p-8 max-w-md mx-auto text-center">
        <h1 className="text-3xl font-bold text-gradient mb-6">无畏布施</h1>
        <p className="text-gray-600 mb-8">Buddhist fearless giving for anxiety relief</p>
        <Link 
          to="/blessing" 
          className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
        >
          开始布施
        </Link>
      </div>
    </div>
  )
} 