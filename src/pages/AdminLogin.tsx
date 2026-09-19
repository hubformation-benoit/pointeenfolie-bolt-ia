import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

export default function AdminLogin() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await signIn(email, password)
    if (error) {
      setError(error)
      setLoading(false)
    } else {
      navigate('/admin')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-50 px-4">
      <div className="card p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <img src="/images/iu/logo.svg" alt="Pointe en folie" className="h-16 w-auto mx-auto mb-4" />
          <h1 className="font-display text-2xl text-brand-green uppercase tracking-wide">Administration</h1>
          <p className="text-olive-600 text-sm mt-1">Connectez-vous pour gérer le contenu du site</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-olive-700 mb-1">Courriel</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full rounded-lg border border-olive-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
              placeholder="admin@pointeenfolie.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-olive-700 mb-1">Mot de passe</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full rounded-lg border border-olive-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
            />
          </div>
          {error && (
            <p className="text-brick-600 text-sm bg-brick-50 rounded-lg px-4 py-2">{error}</p>
          )}
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
}
