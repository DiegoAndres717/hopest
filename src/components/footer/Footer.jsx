import React from 'react'
import classes from './Footer.module.css'

const Footer = () => {
  return (
    <footer className={classes.footer}>
      <div className={classes.wrapper}>
        <div className={classes.col}>
          <h2>About the App</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Voluptates velit fuga perspiciatis itaque iste, aliquid dignissimos voluptate modi,
            tempore assumenda adipisci dolor hic atque quod consequuntur cupiditate. Quasi, nobis veritatis!
          </p>
        </div>
        <div className={classes.col}>
          <h2>Contacts</h2>
          <span>Phone +57 323 2456 789</span>
          <span>YouTube: DISA</span>
          <span>GitHub: DiegoAndress717</span>
        </div>
        <div className={classes.col}>
          <h2>Location</h2>
          <span>Continent: America</span>
          <span>Country: Colombia</span>
          <span>Current Location: Barranquilla</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer