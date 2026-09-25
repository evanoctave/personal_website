import { useEffect, useState } from 'react'

const format = (date) => date.toLocaleTimeString('en-US', { hour12: false, timeZone: 'America/Los_Angeles' })

export default function Clock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])
  return <time dateTime={now.toISOString()}>{format(now)} PT</time>
}
