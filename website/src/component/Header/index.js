import React from 'react'
import { Link } from '../Link'

const links = [
  { href: '/#winners', label: 'Winners' },
  { href: '/entries/2018', label: 'Entries' },
  { href: '/#partners', label: 'Partners' },
  { href: '/#judges', label: 'Judges' },
  { href: '/#prizes', label: 'Prizes' },
  { href: '/#rules', label: 'Rules' },
  { href: 'https://medium.com/js13kgames', label: 'Blog' },
]

export const Header = () => (
  <header>
    <nav>
      <Link className="logo" href="/">
        js13kGames
      </Link>
      <ul>
        {links.map(link => (
          <li key={link.href}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  </header>
)
