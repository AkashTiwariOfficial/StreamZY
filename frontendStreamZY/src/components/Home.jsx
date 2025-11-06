
import { useEffect } from 'react'
import Videos from './Videos'

export default function Home() {

  useEffect(() => {
   console.log("Home page rendered")
  }, [])
    
  return (
    <div>
      <Videos />
    </div>
  )
}
