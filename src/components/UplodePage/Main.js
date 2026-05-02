import React from 'react'
import { Route, Routes } from 'react-router-dom'
import MainHead from '../MainHead'
import Works from '../Works'
import Ready from '../Ready'

export default function Main() {
  return (
    <div className='main'>
        
        <MainHead/>
        <Works/>
        <Ready/>
    </div>
  )
}
