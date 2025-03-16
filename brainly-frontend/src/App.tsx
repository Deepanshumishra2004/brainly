import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from './components/ui/Button'
import { PlusIcon } from './icons/PlusIcon'
import { ShareIcon } from './icons/ShareIcon'

function App() {
  return <>
    <Button
      variant='primary'
      startIcon={<PlusIcon size='lg' />}
      text='share'
      size='lg'
      endIcon={<ShareIcon size='lg'/>}/>

<Button
      variant='secondary'
      startIcon={<PlusIcon size='lg' />}
      text='content'
      size='lg'
      endIcon={<ShareIcon size='lg'/>}/>
  </>
  
}

export default App
