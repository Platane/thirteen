import React from 'react'
import { Link } from '../Link'

export const Footer = () => (
  <footer>
    <div>
      <span>© js13kGames 2012-2018.</span>
      <p>
        Created and maintained by{' '}
        <Link target="_blank" href="https://end3r.com/">
          Andrzej Mazur
        </Link>
        <span> from </span>
        <Link target="_blank" href="https://enclavegames.com/">
          Enclave Games
        </Link>.
      </p>
    </div>
  </footer>
)
