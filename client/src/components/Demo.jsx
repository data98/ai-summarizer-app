import React from 'react'

import { useState } from 'react';

import { copy, promptIcon , submit, loader, tick } from '../assets';

const Demo = () => {
  const [prompt, setPrompt] = useState("");
  const [fetchedData, setFetchedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [displayLinks, setDisplayLinks] = useState(false);
  const [contents, setContents] = useState([]);
  const [message, setMessage] = useState(null);
  const [idString, setIdString] = useState(null);

  // console.log(fetchedData);
  
  const [copied, setCopied] = useState("");

  const baseURL = 'https://aisummarizedg.onrender.com/';
  // console.log(baseURL);

  let ids = '';

  // console.log(contents);

  const getWebsites = async () => {
    const options = {
      method: 'POST',
      body: JSON.stringify({
        numResults: 3, 
        query: prompt
      }), 
      headers: {
        'content-type': 'application/json',
      }
    }
    try {
      setLoading(true);
      const response = await fetch(`${baseURL}/search`, options);
      const data = await response.json().then(data => {
        // console.log("get websites: " + JSON.stringify(data.results));
        setFetchedData(data.results);
        setLoading(false);
        setDisplayLinks(true);
        getContents(data.results);
        let tempIds = ''
        data.results.map(item => {
          tempIds += 'ids=' + item.id + '&';
        });
        tempIds = tempIds.substring(0, tempIds.length-1)
        setIdString(tempIds);
        // idString && console.log(idString);
        // console.log("get websites: " + data.results);
      });
      // data && console.log(data);
    } catch (error) {
      setErrorMessage(error);
      setLoading(false);
      console.error(error);
    }
  }

  const getContents = async (dataArr) => {
    ids = '';
    dataArr.map((item) => {
      ids += 'ids=' + item.id + '&';
    });
    ids = ids.substring(0, ids.length-1);
    // console.log(ids);
    const options = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      }
    }
    try {
      fetch(`${baseURL}/contents?${ids}`, options)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => data.contents.map(item => {
        // console.log("item " + JSON.stringify(item.extract));
        setContents(...contents, JSON.stringify(item.extract));
        // contents && console.log("contents arr " + contents);
      })).then(() => {
        getSummary(contents);
      });

      
    } catch (error) {
      console.error(error);
    }
  }

  const getSummary = async (contents) => {
    const SYSTEM_MESSAGE = 'You are a helpful assistant that summarizes the content of a webpages. Summarize the users input.';
    // console.log("extracted pages: " + JSON.stringify(contents));
    const options = {
      method: 'POST',
      body: JSON.stringify({
        message: `${SYSTEM_MESSAGE}\n${JSON.stringify(contents)}`
      }), 
      headers: {
        'Content-Type': 'application/json'
      }
    }
    try {
      const response = await fetch(`${baseURL}/completions`, options);
      const data = await response.json();
      // console.log("GPT response: " + data);
      // console.log(contents);
      setMessage(data.choices[0].message);
      // console.log(message.content);
    } catch (error) {
      console.error(error);
    }
  }

  // console.log(message);

  const handleCopy = (copyUrl) => {
    setCopied(copyUrl);
    navigator.clipboard.writeText(copyUrl);
    setTimeout(() => setCopied(false), 3000);
  }

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      getWebsites();
    }
  };

  const MetaphorHeader = () => {
    return (
      <h2 className='font-satoshi font-bold text-gray-600 text-xl mt-5'>
        <span className='blue_gradient'>Metaphor</span> source links
      </h2>
    )
  }

  const TextCopyBtn = () => {
    return (
      <div className='copy_btn flex-end' onClick={() => handleCopy(message.content)}>
        <img src={copied === message.content ? tick : copy} alt='copy-icon' className='min-w-[40%] min-h-[40%] object-contain' />
      </div>
    )
  }

  return (
    <section className='mt-16 w-full max-2-xl'>
      {/* Search */}
      <div className='flex flex-col w-full gap-2'>
        <div className='relative flex justify-center items-center'>
          <img 
           src={promptIcon}
           alt='link_icon'
           className='absolute left-0 my-2 ml-3 w-5 bg-gray-200 rounded'
          />
          <input
            type='text'
            placeholder='Enter a prompt'
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            required
            className='prompt_input peer'
          />
          <button
            onClick={getWebsites}
            className='submit_btn peer-focus:border-indigo-700 peer-focus:text-gray-700'
          >
            <img src={submit} alt='submit' className='opacity-75 pl-0.4' />
          </button>
        </div>

        {/* Browse URL History */}
        <div className='flex flex-col gap-1 max-h-60 overflow-y-auto'>
          {displayLinks && <MetaphorHeader />}
          {displayLinks && fetchedData.map((item) => (
            <div key={item.id} className='link_card flex'>
              <div className=' ont-satoshi text-blue-700 font-medium text-sm text-clip truncate'>
                {item.url}
              </div>
              <p className='flex-1 font-satoshi text-gray-600 font-bold text-xs min-w-max'>
                {item.publishedDate}
              </p>
              <div className='copy_btn flex-end' onClick={() => handleCopy(item.url)}>
                <img src={copied === item.url ? tick : copy} alt='copy-icon' className='min-w-[40%] min-h-[40%] object-contain' />
              </div>
            </div>
          ))}  

        </div>
      </div>
      
      {/* Display Results */}
      <div className='my-10 max-w-full flex justify-center item-center'>
        {loading ? (
          <img src={loader} alt='loader' className='w-10 h-10' />
        ) : errorMessage ? (
          <p className='font-inter font-bold text-black text-center'>
            Something went wrong...
            <br />
            <span className='font-satoshi font-normal text-gray-700'>
              {error?.data?.error}
            </span>
          </p>
        ) : (
          displayLinks && (
            <div className='flex flex-col gap-3'>
              <div className='flex justify-between items-center'>
                <h2 className='font-satoshi font-bold text-gray-600 text-xl'>
                  Articles <span className='blue_gradient'>Summary</span>
                </h2>
                {message && <TextCopyBtn />}
              </div>
              <div className='summary_box'>
                <p className='font-inter font-medium text-sm text-gray-700'>
                  {message && message.content}
                </p>
              </div>
            </div>
          )
        )}
        
      </div>

      { /* Contact */ }
      <div className='w-full flex flex-col my-10 justify-center item-center'>
        <h2 className='font-satoshi font-semibold text-gray-600 text-xl/2 mb-2'>
          coded by <span className='blue_gradient'>Davit Goderdzishvili</span>
        </h2>
        <div className='flex '>
          <h2 className='font-satoshi font-normal text-gray-600 text-xl/2'>
            <span className='font-semibold'>Let's chat:</span> dgoderdz@gmail.com
          </h2>
          <div className='copy_btn flex-end ml-2' onClick={() => handleCopy('dgoderdz@gmail.com')}>
            <img src={copied === 'dgoderdz@gmail.com' ? tick : copy} alt='copy-icon' className='min-w-[40%] min-h-[40%] object-contain' />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Demo