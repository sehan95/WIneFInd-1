import { useState } from 'react';
import styles from '../styles/Test.module.css';

export default function Questions({ questionnum, question }) {
  return (
    <div>
      <div className={styles.stars_container}>
        <div className={styles.question_container}>
          <h2>
            {questionnum}.&nbsp;&nbsp;
            {question}
          </h2>
        </div>
        <hr></hr>
        <div className={styles.stars}>
          <button className={styles.winebtn}>
            <img src='/images/redw.png' />
          </button>
          <button className={styles.winebtn}>
            <img src='/images/redw.png' />
          </button>
          <button className={styles.winebtn}>
            <img src='/images/redw.png' />
          </button>
          <button className={styles.winebtn}>
            <img src='/images/redw.png' />
          </button>
          <button className={styles.winebtn}>
            <img src='/images/redw.png' />
          </button>
        </div>
        <div className={styles.ratetext}>
          <div>
            <h1>매우 아니다</h1>
          </div>
          <div>
            <h1>매우 그렇다</h1>
          </div>
        </div>
      </div>
    </div>
  );
}