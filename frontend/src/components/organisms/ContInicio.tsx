import React from 'react'
import LICP1 from './LICP1'
import LICP2 from './LICP2'
import LICP3 from './LICP3'
import EncabInLog from './EncabInLog'


const ContInicio = () => {
  return (
    <div className='bshet'>
      <EncabInLog/>
      <LICP1 />
      <LICP2 />
      <LICP3 />
    </div>
  )
}

export default ContInicio