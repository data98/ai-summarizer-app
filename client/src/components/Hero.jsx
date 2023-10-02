import React from 'react'
import { logo } from '../assets';

const Hero = () => {
  return (
    <header className='w-full flex justify-center items-center flex-col'>
      <nav className='flex justify-between items-center w-full mb-110 pt-3'>
        <div className='flex justify-center items-center'>
          <img 
            src={logo} alt='logo'
            className='w-10 object-contain hue-rotate-30'
          />
          <h2 className='ml-3 logo_text'>AI Summarizer</h2>
        </div>
        <button type='button'
          onClick={() => window.open('https://github.com/data98/ai-summarizer-app')}
          className='black_btn'
        >
          GitHub
        </button>
      </nav>
      <h1 className='head_text'>
        Connect OpenAI GPT-3.5 to internet <br className='max-md:hidden' />
        <span className='orange_gradient'>with Metaphor API</span>
      </h1>
      <h2 className='desc'>
      Search and summarize information from across the internet, powered by Metaphor's neural search algorithm and OpenAI
      </h2>
    </header>
  )
}

export default Hero