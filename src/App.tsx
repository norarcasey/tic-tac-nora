import { TicTacNora } from './components/TicTacNora'
import './App.css'

export default function App() {
  return (
    <main className="demo">
      <TicTacNora />
      <p className="demo__credit">
        An embeddable React component. Drop <code>&lt;TicTacNora /&gt;</code> anywhere.
      </p>
    </main>
  )
}
