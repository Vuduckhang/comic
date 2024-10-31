"use client";

import React from 'react';
import PropTypes from 'prop-types';
import styles from './DialogueOverlay.module.css';

const DialogueOverlay = ({ src, dialogues }) => {
  return (
    <div className={styles.container}>
      <img src={src} alt="Comic Panel" className={styles.image} />
      {dialogues.map((dialogue, index) => (
        <div
          key={index}
          className={styles.dialogue}
          style={{ top: `${dialogue.y}px`, left: `${dialogue.x}px` }}
        >
          {dialogue.text}
        </div>
      ))}
    </div>
  );
};

DialogueOverlay.propTypes = {
  src: PropTypes.string.isRequired,
  dialogues: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default DialogueOverlay;
