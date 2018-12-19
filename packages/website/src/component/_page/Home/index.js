import React from 'react'

export const Home = () =>
  Array.from({ length: 6 }).map((_, i) => (
    <section
      key={i}
      style={{ margin: '10px', height: '400px', backgroundColor: '#ddd' }}
    />
  ))
