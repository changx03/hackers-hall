import React from 'react'
import Footer from './footer'
import Header from './header/headerContainer'

const MainContainer = ({ children }) => (
  <div className="site-view">
    <header className="header">
      <Header />
    </header>
    <main className="main">{children}</main>
    <footer className="footer">
      <Footer />
    </footer>
  </div>
)

export default MainContainer
